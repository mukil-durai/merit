import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Razorpay from 'razorpay';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware
app.use(cors({
  origin: ['http://localhost:5174', 'http://localhost:5173'], // Ensure frontend origins are allowed
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' })); // Increased payload size limit
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// MongoDB Connection
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Razorpay Configuration
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // Use environment variable
  key_secret: process.env.RAZORPAY_KEY_SECRET, // Use environment variable
});

// Nodemailer Configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  debug: true, // Enable debug output
});

// Verify email configuration on startup
transporter.verify((error) => {
  if (error) {
    console.error('❌ Email configuration error:', error);
  } else {
    console.log('✅ Email server is ready');
  }
});

// Schemas
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  profilePic: {
    data: Buffer,
    contentType: String
  },
  phone: String,
  address: String,
  bio: String,
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  updatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now } // <-- Add this line
});
const User = mongoose.model('User', userSchema);

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
  orderDate: { type: Date, default: () => new Date() },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered'], default: 'Pending' },
  statusUpdateDate: { type: Date, default: () => new Date() },
  statusTimeline: [{ status: String, date: Date, description: String }]
});
const Order = mongoose.model('Order', orderSchema);

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  category: String,
});
const Product = mongoose.model("Product", productSchema);

const reviewSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  text: String,
  rating: { type: Number, min: 1, max: 5 },
  createdAt: { type: Date, default: Date.now },
});
const Review = mongoose.model("Review", reviewSchema);

// Helper Middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.error("Authorization header missing");
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const token = authHeader.split(' ')[1];
    console.log("Token received:", token); // Log the token for debugging
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Routes
app.post('/api/create-order', async (req, res) => {
  console.log('Creating Razorpay order with request body:', req.body);
  const { amount } = req.body;
  
  // Validate amount
  if (!amount) {
    console.error('Missing amount parameter');
    return res.status(400).json({ error: 'Amount is required' });
  }
  
  // Ensure amount is a number
  const orderAmount = parseInt(amount, 10);
  if (isNaN(orderAmount) || orderAmount <= 0) {
    console.error('Invalid amount value:', amount);
    return res.status(400).json({ error: 'Invalid amount value' });
  }
  
  // Verify Razorpay configuration
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.error('Razorpay credentials are missing');
    return res.status(500).json({ error: 'Payment gateway configuration error' });
  }
  
  try {
    console.log(`Attempting to create Razorpay order for amount: ${orderAmount}`);
    const options = { 
      amount: orderAmount, 
      currency: 'INR', 
      receipt: `receipt_${Date.now()}` 
    };
    
    console.log('Razorpay order options:', options);
    const order = await razorpay.orders.create(options);
    console.log('Razorpay order created successfully:', order);
    
    res.json({ 
      orderId: order.id, 
      key: process.env.RAZORPAY_KEY_ID, 
      amount: order.amount, 
      currency: order.currency 
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    // Return a more detailed error response
    res.status(500).json({
      error: 'Failed to create Razorpay order',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

app.post('/api/store-order', verifyToken, async (req, res) => {
  const { items, totalAmount, name, phone, address, paymentId } = req.body;
  try {
    const newOrder = new Order({
      userId: req.user.id,
      items,
      totalAmount,
      orderDate: new Date(),
      status: 'Pending',
      statusTimeline: [{ status: 'Pending', date: new Date(), description: 'Order placed successfully' }],
    });
    await newOrder.save();
    res.status(201).json({ message: 'Order stored successfully', order: newOrder });
  } catch (error) {
    console.error('Error storing order:', error);
    res.status(500).json({ error: 'Failed to store order' });
  }
});

app.post('/send-email', async (req, res) => {
  const { fullName, email, phone, subject, message } = req.body;
  
  // Log received data for debugging
  console.log('Received contact form submission:', { fullName, email, subject });
  
  try {
    // Check for required fields
    if (!fullName || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, email and message are required fields.' 
      });
    }
    
    const mailOptions = {
      from: `"${fullName}" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to your own email for testing
      subject: `New Contact Form Message: ${subject || 'No Subject'}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Subject:</strong> ${subject || 'Not provided'}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
      text: `Name: ${fullName}\nEmail: ${email}\nPhone: ${phone || 'Not provided'}\nSubject: ${subject || 'Not provided'}\nMessage: ${message}`, // Plain text version
    };
    
    console.log('Attempting to send email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    
    res.status(200).json({ 
      success: true, 
      message: 'Message sent successfully!',
      messageId: info.messageId
    });
  } catch (error) {
    console.error('Error sending email:', error);
    // More detailed error response
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send message. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

app.get('/api/profile', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId)
      .select('-password') // Exclude the password field
      .populate('wishlist', 'name price image'); // Populate wishlist with product details

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Format the profilePic as base64 if it exists
    const formattedUser = {
      ...user.toObject(),
      profilePic: user.profilePic?.data
        ? `data:${user.profilePic.contentType};base64,${user.profilePic.data.toString('base64')}`
        : null, // Return null if no profilePic exists
    };

    res.status(200).json(formattedUser);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

// Update user profile
app.put('/api/profile', verifyToken, async (req, res) => {
  const { name, phone, address, bio, profilePic } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user fields
    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.address = address || user.address;
    user.bio = bio || user.bio;

    // Update profile picture if provided
    if (profilePic) {
      user.profilePic = {
        data: Buffer.from(profilePic.split(',')[1], 'base64'),
        contentType: profilePic.split(',')[0].split(':')[1].split(';')[0],
      };
    }

    await user.save();

    // Return updated user data with profilePic as base64
    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        ...user.toObject(),
        profilePic: user.profilePic
          ? `data:${user.profilePic.contentType};base64,${user.profilePic.data.toString('base64')}`
          : null,
      },
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

app.get('/api/orders', verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ orderDate: -1 });
    res.status(200).json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Add a placeholder route for updating order statuses if needed
app.get('/api/orders/update-status', verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ orderDate: -1 });
    res.status(200).json({ orders });
  } catch (error) {
    console.error('Error updating order statuses:', error);
    res.status(500).json({ error: 'Failed to update order statuses' });
  }
});

app.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate a JWT token
    const token = `Bearer ${jwt.sign({ id: user._id, name: user.name }, JWT_SECRET, { expiresIn: '7d' })}`;

    // Return the token and user data
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic?.data
          ? `data:${user.profilePic.contentType};base64,${user.profilePic.data.toString('base64')}`
          : null,
        createdAt: user.createdAt, // Include createdAt field
      },
    });
  } catch (error) {
    console.error('Error during sign-in:', error); // Log the error
    res.status(500).json({ error: 'An error occurred during sign-in' });
  }
});

// Fetch wishlist
app.get('/api/wishlist', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // If wishlist exists but is not populated, return IDs
    if (!user.wishlist) {
      user.wishlist = [];
      await user.save();
    }
    
    // Return the wishlist array (either IDs or populated objects)
    res.status(200).json({ wishlist: user.wishlist });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
});

// Add or remove wishlist item
app.post('/api/wishlist', verifyToken, async (req, res) => {
  const { productId, action } = req.body;
  
  if (!productId) {
    return res.status(400).json({ error: 'Product ID is required' });
  }
  
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Initialize wishlist array if it doesn't exist
    if (!user.wishlist) {
      user.wishlist = [];
    }
    
    // Convert all IDs to strings for comparison
    const wishlistIds = user.wishlist.map(id => id.toString());
    const productIdStr = productId.toString();
    
    if (action === 'add') {
      // Only add if not already in wishlist
      if (!wishlistIds.includes(productIdStr)) {
        user.wishlist.push(productId);
        console.log(`Added product ${productId} to wishlist`);
      }
    } else if (action === 'remove') {
      // Filter out the productId
      user.wishlist = user.wishlist.filter(id => id.toString() !== productIdStr);
      console.log(`Removed product ${productId} from wishlist`);
    } else {
      return res.status(400).json({ error: 'Invalid action' });
    }

    // Save the updated user document
    await user.save();
    
    // Return the updated wishlist
    res.status(200).json({ 
      message: 'Wishlist updated successfully',
      wishlist: user.wishlist
    });
  } catch (error) {
    console.error('Error updating wishlist:', error);
    res.status(500).json({ error: 'Failed to update wishlist' });
  }
});

// Fetch reviews for a product
app.get('/api/reviews/:productId', async (req, res) => {
  const { productId } = req.params;
  try {
    const reviews = await Review.find({ productId }).populate('userId', 'name');
    // Always return 200 with an empty array if no reviews found
    res.status(200).json({ reviews: reviews || [] });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Submit a review
app.post('/api/reviews', verifyToken, async (req, res) => {
  // Accept both { productId, text, rating } and { productId, review, rating }
  const { productId, text, review, rating } = req.body;
  try {
    // Accept review text as either 'text' or 'review'
    const reviewText = typeof text === "string" ? text : (typeof review === "string" ? review : "");
    if (!productId || !reviewText || !rating) {
      return res.status(400).json({ error: 'Missing productId, review text, or rating' });
    }

    // Fix: Ensure productId is a valid ObjectId string
    if (!/^[a-f\d]{24}$/i.test(productId)) {
      return res.status(400).json({ error: 'Invalid productId' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const newReview = new Review({
      productId,
      userId: req.user.id,
      text: reviewText,
      rating,
    });

    await newReview.save();
    res.status(201).json({ message: 'Review submitted successfully', review: newReview });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ error: 'Failed to submit review' });
  }
});

// User Registration
app.post('/account', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Generate a JWT token
    const token = `Bearer ${jwt.sign({ id: newUser._id, name: newUser.name }, JWT_SECRET, { expiresIn: '7d' })}`;

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt, // Include createdAt field
      },
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Fetch all users (admin or for table display)
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find({})
      .select('-password -__v') // Exclude password and version fields
      .populate('wishlist', 'name price image'); // Optionally populate wishlist
    res.status(200).json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Fetch all products (for table display)
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Fetch all reviews (for table display)
app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await Review.find({})
      .populate({ path: 'userId', select: 'name email', options: { strictPopulate: false } })
      .populate({ path: 'productId', select: 'name', options: { strictPopulate: false } })
      .lean();
    res.status(200).json({ reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Fetch all wishlists (for table display)
app.get('/api/wishlists', async (req, res) => {
  try {
    const users = await User.find({})
      .select('name email wishlist')
      .populate('wishlist', 'name price image');
    // Format as array of { user, wishlist }
    const wishlists = users.map(u => ({
      user: { id: u._id, name: u.name, email: u.email, createdAt: u.createdAt }, // Include createdAt field
      wishlist: u.wishlist
    }));
    res.status(200).json({ wishlists });
  } catch (error) {
    console.error('Error fetching wishlists:', error);
    res.status(500).json({ error: 'Failed to fetch wishlists' });
  }
});

// Change password
app.put('/api/change-password', verifyToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Current password is incorrect' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
});

// Delete account
app.delete('/api/delete-account', verifyToken, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Optionally, delete related data (orders, reviews, etc.)
    await Order.deleteMany({ userId: req.user.id });
    await Review.deleteMany({ userId: req.user.id });

    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
