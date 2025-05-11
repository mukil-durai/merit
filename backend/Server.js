import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs'; // Use bcryptjs instead of bcrypt
import jwt from 'jsonwebtoken'; // Import JWT for authentication
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI;

const JWT_SECRET = process.env.JWT_SECRET; // JWT Secret Key

// Middleware
app.use(cors({
  origin: ['http://localhost:5174', 'http://localhost:5173'], // Add both Vite default ports
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Increase body size limit for large payloads (default is 100kb)
app.use(express.json({ limit: '10mb' })); // Increase if needed
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Add a catch-all CORS header for debugging (remove in production)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// Optionally, log request size for debugging large payloads
app.use((req, res, next) => {
  if (req.method === "POST" || req.method === "PUT") {
    const contentLength = req.headers['content-length'];
    if (contentLength) {
      console.log(`Incoming ${req.method} request to ${req.url} with content-length: ${contentLength}`);
    }
  }
  next();
});

// MongoDB Connection
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Update nodemailer configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER, // Add this to your .env file
    pass: process.env.EMAIL_PASS  // Add this to your .env file
  }
});

// Verify email configuration
transporter.verify(function(error, success) {
  if (error) {
    console.error('Email configuration error:', error);
  } else {
    console.log('Email server is ready');
  }
});

// User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String, // Hashed Password
  profilePic: {
    data: Buffer,
    contentType: String
  },
  phone: String,
  address: String,
  bio: String,
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], // Add wishlist field
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Order Schema
const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{
    productId: String,
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  totalAmount: Number,
  orderDate: { 
    type: Date, 
    default: () => new Date() // Ensure current time is used
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered'],
    default: 'Pending'
  },
  statusUpdateDate: { 
    type: Date, 
    default: () => new Date()
  },
  statusTimeline: [{
    status: String,
    date: Date,
    description: String
  }]
});

const Order = mongoose.model('Order', orderSchema);

// Add Product Schema
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  category: String,
  // ...add other fields as needed...
});
const Product = mongoose.model("Product", productSchema);

// Add Review Schema
const reviewSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  text: String,
  rating: { type: Number, min: 1, max: 5 },
  createdAt: { type: Date, default: Date.now },
});
const Review = mongoose.model("Review", reviewSchema);

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const token = authHeader.split(' ')[1]; // Extract token after 'Bearer '
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// 🔹 Register Route
app.post('/account', async (req, res) => {
  try {
    console.log('Incoming Data:', req.body);

    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id, name: newUser.name }, JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ message: 'User registered successfully', token, user: { id: newUser._id, name, email } });
  } catch (err) {
    console.error('Error Details:', err);
    res.status(500).json({ error: 'Error registering user' });
  }
});

// 🔹 Sign-in Route
app.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

    // Include profile picture in response if exists
    const profilePic = user.profilePic?.data ? 
      `data:${user.profilePic.contentType};base64,${user.profilePic.data.toString('base64')}` : 
      null;

    res.status(200).json({ 
      message: 'Login successful', 
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePic
      }
    });
  } catch (err) {
    console.error('Signin Error:', err);
    res.status(500).json({ error: 'Error during sign-in' });
  }
});

// 🔹 Get User Data Route (Protected)
app.get('/user', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized - No token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error('User Fetch Error:', err);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});

// Update profile endpoint to include all user fields
app.get('/api/profile', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const orders = await Order.find({ userId }).sort({ orderDate: -1 });
    
    // Convert binary profile pic to base64
    const responseUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      bio: user.bio,
      wishlist: user.wishlist || [],
      profilePic: user.profilePic?.data ? 
        `data:${user.profilePic.contentType};base64,${user.profilePic.data.toString('base64')}` : 
        null
    };

    res.json({ user: responseUser, orders });
  } catch (error) {
    console.error('Profile Error:', error);
    res.status(500).json({ error: 'Error fetching profile data' });
  }
});

// Fix profile update endpoint
app.put('/api/profile', verifyToken, async (req, res) => {
  try {
    const { name, phone, address, bio, profilePic } = req.body;
    const userId = req.user.id;

    const updateData = {
      ...(name && { name }),
      ...(phone && { phone }),
      ...(address && { address }),
      ...(bio && { bio }),
      updatedAt: new Date()
    };

    // Handle profile picture as binary
    if (profilePic) {
      const base64Data = profilePic.replace(/^data:image\/\w+;base64,/, '');
      const imageBuffer = Buffer.from(base64Data, 'base64');
      const contentType = profilePic.split(';')[0].split(':')[1];
      
      updateData.profilePic = {
        data: imageBuffer,
        contentType: contentType
      };
    }

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, select: '-password' }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Convert binary data back to base64 for response
    const responseUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      bio: user.bio,
      profilePic: user.profilePic?.data ? 
        `data:${user.profilePic.contentType};base64,${user.profilePic.data.toString('base64')}` : 
        null
    };

    res.json({
      message: 'Profile updated successfully',
      user: responseUser
    });
  } catch (error) {
    console.error('Profile Update Error:', error);
    res.status(500).json({ error: 'Error updating profile' });
  }
});

// Add endpoint to save orders
app.post('/api/orders', verifyToken, async (req, res) => {
  try {
    const { items, totalAmount, name, phone, address } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!items || !totalAmount || !name || !phone || !address) {
      return res.status(400).json({ error: 'Missing required order details' });
    }

    const now = new Date();
    const estimatedDelivery = new Date(now);
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 6);

    const newOrder = new Order({
      userId,
      items: items.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      totalAmount,
      orderDate: now,
      statusUpdateDate: now,
      status: 'Pending',
      contactName: name,
      contactPhone: phone,
      deliveryAddress: address,
      estimatedDelivery,
      statusTimeline: [{
        status: 'Pending',
        date: now,
        description: 'Order placed successfully'
      }]
    });

    await newOrder.save();
    res.status(201).json({ 
      message: 'Order placed successfully', 
      order: newOrder 
    });

  } catch (error) {
    console.error('Order Error:', error);
    res.status(500).json({ error: 'Error placing order' });
  }
});

// Add new endpoint to update order status
app.put('/api/orders/:orderId/status', verifyToken, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { 
        status,
        statusUpdateDate: new Date()
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ message: 'Order status updated', order });
  } catch (error) {
    console.error('Status Update Error:', error);
    res.status(500).json({ error: 'Error updating order status' });
  }
});

// Helper functions for order status updates
const calculateOrderStatus = (orderDate) => {
  const now = new Date();
  const diffDays = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24));
  if (diffDays >= 6) return 'Delivered';
  if (diffDays >= 3) return 'Shipped';
  if (diffDays >= 1) return 'Confirmed';
  return 'Pending';
};

const getStatusDetails = (status) => {
  const descriptions = {
    Pending: 'Order placed successfully',
    Confirmed: 'Order confirmed by the seller',
    Shipped: 'Order shipped to the delivery address',
    Delivered: 'Order delivered successfully',
  };
  return { description: descriptions[status] || 'Status updated' };
};

// Fix status update endpoint
app.get('/api/orders/update-status', verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({
      userId: req.user.id,
      status: { $ne: 'Delivered' },
    });

    const updatedOrders = await Promise.all(
      orders.map(async (order) => {
        const newStatus = calculateOrderStatus(order.orderDate);
        if (newStatus !== order.status) {
          const now = new Date();
          order.status = newStatus;
          order.statusUpdateDate = now;
          order.statusTimeline.push({
            status: newStatus,
            date: now,
            description: getStatusDetails(newStatus).description,
          });
          await order.save();
        }
        return order;
      })
    );

    res.json({ success: true, orders: updatedOrders });
  } catch (error) {
    console.error('Status Update Error:', error);
    res.status(500).json({ error: 'Error updating order statuses' });
  }
});

// Update email endpoint with better error handling
app.post('/send-email', async (req, res) => {
  const { fullName, email, phone, subject, message } = req.body;

  console.log('Received email request:', { fullName, email, subject }); // Debug log

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'dmukil554@gmail.com', // Your email address - fixed recipient
    subject: `New Contact Form Message: ${subject}`,
    html: `
      <h3>New Contact Form Submission</h3>
      <p><strong>Name:</strong> ${fullName}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `,
    replyTo: email // This allows you to reply directly to the sender
  };

  try {
    console.log('Attempting to send email...'); // Debug log
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId); // Debug log
    res.json({ 
      success: true, 
      message: 'Message sent successfully! We will get back to you soon.',
      messageId: info.messageId 
    });
  } catch (error) {
    console.error('Detailed email error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send message. Please try again later.',
      error: error.message 
    });
  }
});

// 🔹 Admin Dashboard Statistics Route
app.get('/api/admin/stats', verifyToken, async (req, res) => {
  try {
    // In a real app, you would verify admin role here
    // if (!req.user.isAdmin) return res.status(403).json({ error: 'Unauthorized' });

    // Get total users count
    const totalUsers = await User.countDocuments();
    
    // Get total orders count
    const totalOrders = await Order.countDocuments();
    
    // Get total revenue (sum of all order amounts)
    const revenueResult = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" }
        }
      }
    ]);
    const totalRevenue = revenueResult[0]?.totalRevenue || 0;
    
    // Get orders by status
    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Get recent 5 orders
    const recentOrders = await Order.find()
      .sort({ orderDate: -1 })
      .limit(5)
      .populate('userId', 'name email');
    
    // Get user signups over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const userSignups = await User.aggregate([
      {
        $match: {
          updatedAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.json({
      totalUsers,
      totalOrders,
      totalRevenue,
      ordersByStatus,
      recentOrders,
      userSignups
    });
    
  } catch (error) {
    console.error('Admin Stats Error:', error);
    res.status(500).json({ error: 'Error fetching admin statistics' });
  }
});

// Add review endpoint (POST)
app.post("/api/reviews", verifyToken, async (req, res) => {
  try {
    const { productId, review, rating } = req.body;
    const userId = req.user.id;

    if (!productId || !review || !rating) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid productId" });
    }

    const newReview = new Review({ productId, userId, text: review, rating });
    await newReview.save();

    // Populate user details for the response
    const populatedReview = await Review.findById(newReview._id).populate("userId", "name");
    if (!populatedReview) {
      return res.status(500).json({ error: "Failed to populate review data" });
    }

    res.status(201).json({ message: "Review added successfully", review: populatedReview });
  } catch (error) {
    console.error("Error adding review:", error.message || error);
    res.status(500).json({ error: "Error adding review" });
  }
});

// Get reviews for a product (GET)
app.get("/api/reviews/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid productId" });
    }
    const reviews = await Review.find({ productId }).populate("userId", "name");
    res.status(200).json({ reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Error fetching reviews" });
  }
});

// Add Product creation endpoint (for testing/demo)
app.post('/api/products', async (req, res) => {
  try {
    const { name, price, image, category } = req.body;
    if (!name || !price || !category) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    // Check if product with same name exists (optional)
    let product = await Product.findOne({ name });
    if (product) {
      return res.status(200).json({ message: "Product already exists", product });
    }
    product = new Product({ name, price, image, category });
    await product.save();
    res.status(201).json({ message: "Product created", product });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Error creating product" });
  }
});

// Add a new endpoint to get product ratings summary
app.get("/api/products/:productId/ratings", async (req, res) => {
  try {
    const { productId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid productId" });
    }
    
    // Get all reviews for this product
    const reviews = await Review.find({ productId });
    
    if (reviews.length === 0) {
      return res.status(200).json({ 
        productId,
        reviewCount: 0,
        averageRating: 0,
        ratingDistribution: {
          5: 0, 4: 0, 3: 0, 2: 0, 1: 0
        }
      });
    }
    
    // Calculate average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;
    
    // Calculate rating distribution
    const ratingDistribution = {
      5: 0, 4: 0, 3: 0, 2: 0, 1: 0
    };
    
    reviews.forEach(review => {
      ratingDistribution[review.rating]++;
    });
    
    res.status(200).json({
      productId,
      reviewCount: reviews.length,
      averageRating,
      ratingDistribution
    });
    
  } catch (error) {
    console.error("Error fetching product ratings:", error);
    res.status(500).json({ error: "Error fetching product ratings" });
  }
});

// Add an endpoint to get ratings for multiple products
app.post("/api/products/batch-ratings", async (req, res) => {
  try {
    const { productIds } = req.body;
    
    if (!Array.isArray(productIds)) {
      return res.status(400).json({ error: "productIds must be an array" });
    }
    
    // Filter out invalid ObjectIds
    const validProductIds = productIds.filter(id => mongoose.Types.ObjectId.isValid(id));
    
    if (validProductIds.length === 0) {
      return res.status(400).json({ error: "No valid productIds provided" });
    }
    
    // Get reviews for all products
    const reviews = await Review.find({ 
      productId: { $in: validProductIds } 
    });
    
    // Group reviews by productId
    const reviewsByProduct = {};
    validProductIds.forEach(id => {
      reviewsByProduct[id] = [];
    });
    
    reviews.forEach(review => {
      const productId = review.productId.toString();
      if (!reviewsByProduct[productId]) {
        reviewsByProduct[productId] = [];
      }
      reviewsByProduct[productId].push(review);
    });
    
    // Calculate statistics for each product
    const results = {};
    
    Object.keys(reviewsByProduct).forEach(productId => {
      const productReviews = reviewsByProduct[productId];
      const reviewCount = productReviews.length;
      
      let averageRating = 0;
      const ratingDistribution = {
        5: 0, 4: 0, 3: 0, 2: 0, 1: 0
      };
      
      if (reviewCount > 0) {
        const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0);
        averageRating = totalRating / reviewCount;
        
        productReviews.forEach(review => {
          ratingDistribution[review.rating]++;
        });
      }
      
      results[productId] = {
        reviewCount,
        averageRating,
        ratingDistribution
      };
    });
    
    res.status(200).json(results);
    
  } catch (error) {
    console.error("Error fetching batch ratings:", error);
    res.status(500).json({ error: "Error fetching batch ratings" });
  }
});

// Add an endpoint to get user's wishlist
app.get('/api/wishlist', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Return the user's wishlist
    res.json({ wishlist: user.wishlist || [] });
  } catch (error) {
    console.error('Wishlist fetch error:', error);
    res.status(500).json({ error: 'Error fetching wishlist' });
  }
});

// Add an endpoint to update wishlist (add/remove items)
app.post('/api/wishlist', verifyToken, async (req, res) => {
  try {
    const { productId, action } = req.body;
    const userId = req.user.id;
    
    if (!productId || !action) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }
    
    if (action !== 'add' && action !== 'remove') {
      return res.status(400).json({ error: 'Invalid action' });
    }
    
    let updateOperation;
    
    if (action === 'add') {
      // Add product to wishlist if not already there
      updateOperation = {
        $addToSet: { wishlist: productId }
      };
    } else {
      // Remove product from wishlist
      updateOperation = {
        $pull: { wishlist: productId }
      };
    }
    
    const user = await User.findByIdAndUpdate(
      userId,
      updateOperation,
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ 
      success: true, 
      message: action === 'add' ? 'Added to wishlist' : 'Removed from wishlist',
      wishlist: user.wishlist
    });
    
  } catch (error) {
    console.error('Wishlist update error:', error);
    res.status(500).json({ error: 'Error updating wishlist' });
  }
});

// Add an endpoint to check if a product is in user's wishlist
app.get('/api/wishlist/check/:productId', verifyToken, async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;
    
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const isInWishlist = user.wishlist.includes(productId);
    
    res.json({ isInWishlist });
    
  } catch (error) {
    console.error('Wishlist check error:', error);
    res.status(500).json({ error: 'Error checking wishlist' });
  }
});

// Add an endpoint to get products in the wishlist
app.get('/api/wishlist/products', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Find all products in the user's wishlist
    const wishlistProducts = await Product.find({
      _id: { $in: user.wishlist }
    });
    
    res.json({ wishlistProducts });
    
  } catch (error) {
    console.error('Wishlist products error:', error);
    res.status(500).json({ error: 'Error fetching wishlist products' });
  }
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
