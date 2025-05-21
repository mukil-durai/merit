import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../components/Cartcontext";
import { AuthContext } from "../pages/AuthContext";
import {
  Card,
  Col,
  Row,
  Spinner,
  Alert,
  Form,
  Button,
  Container,
  InputGroup,
  Badge,
  Modal,
  ListGroup,
  OverlayTrigger,
  Tooltip,
  Tabs,
  Tab,
} from "react-bootstrap";
import { 
  Heart, HeartFill, CartPlus, CheckCircle, ArrowRight, Truck,
  BagCheck, GeoAlt, CurrencyDollar, ShieldLock, Search, 
  StarFill, Star, Filter, SortDown
} from "react-bootstrap-icons";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/linen.css";

const API_BASE_URL = "http://localhost:5001";

// Add Indian states with their cities
const statesWithCities = {
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool"],
  "Assam": ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon"],
  "Bihar": ["Patna", "Gaya", "Muzaffarpur", "Bhagalpur", "Darbhanga"],
  "Chhattisgarh": ["Raipur", "Bhilai", "Bilaspur", "Korba", "Durg"],
  "Delhi": ["New Delhi", "Delhi", "Noida", "Gurgaon", "Faridabad"],
  "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar"],
  "Haryana": ["Chandigarh", "Faridabad", "Gurgaon", "Panipat", "Ambala"],
  "Himachal Pradesh": ["Shimla", "Dharamshala", "Manali", "Kullu", "Solan"],
  "Jharkhand": ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Hazaribagh"],
  "Karnataka": ["Bengaluru", "Mysuru", "Hubballi", "Mangaluru", "Belagavi"],
  "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam"],
  "Madhya Pradesh": ["Bhopal", "Indore", "Jabalpur", "Gwalior", "Ujjain"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik"],
  "Odisha": ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur"],
  "Punjab": ["Chandigarh", "Ludhiana", "Amritsar", "Jalandhar", "Patiala"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Ghaziabad", "Agra", "Meerut"],
  "Uttarakhand": ["Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rudrapur"],
  "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri"]
};

const getImageSrc = (image) => {
  if (!image) return "https://via.placeholder.com/250";
  if (image?.startsWith("data:image") || image?.startsWith("http")) return image;
  return `data:image/jpeg;base64,${image}`;
};

const CheckoutProgressBar = ({ currentStep }) => {
  const steps = [
    { title: 'Review', icon: <BagCheck /> },
    { title: 'Address', icon: <GeoAlt /> },
    { title: 'Payment', icon: <CurrencyDollar /> },
    { title: 'Place Order', icon: <ShieldLock /> }
  ];

  return (
    <div className="checkout-progress mb-4">
      <div className="checkout-steps-container">
        {steps.map((step, index) => (
          <div 
            key={index}
            className={`checkout-step ${currentStep >= index + 1 ? 'active' : ''} ${currentStep > index + 1 ? 'completed' : ''}`}
          >
            <div className="step-circle">
              {currentStep > index + 1 ? (
                <CheckCircle className="check-icon" />
              ) : (
                <div className="step-number">
                  <span>{index + 1}</span>
                  {currentStep === index + 1 && <div className="active-pulse"></div>}
                </div>
              )}
            </div>
            <div className="step-label">{step.title}</div>

            {index < steps.length - 1 && (
              <div className={`step-line ${currentStep > index + 1 ? 'completed' : ''}`}>
                {currentStep > index + 1 && <div className="moving-car-container">
                  <Truck className="moving-car" />
                </div>}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const linen = () => {
  const [linenProducts, setlinenProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [wishlist, setWishlist] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [cityOptions, setCityOptions] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsProduct, setDetailsProduct] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortOption, setSortOption] = useState("");
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState(null);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [paymentInProgress, setPaymentInProgress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("online"); // "online" or "cod" (Cash on Delivery)
  const [detailsQuantity, setDetailsQuantity] = useState(1);

  const { cartItems, addToCart } = useContext(CartContext);
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const isValidObjectId = (id) => /^[a-f\d]{24}$/i.test(id);

  const logAlllinenProductIds = (products) => {
    console.log("linen Products in DB:");
    products.forEach(p => {
      console.log(`Name: ${p.name}, _id: ${p._id}`);
    });
  };

  const logReviewProductId = (productId) => {
    console.log("Submitting review for productId:", productId);
  };

  useEffect(() => {
    const fetchlinenProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products", {
          params: { category: "linen" },
        });
        const products = Array.isArray(response.data)
          ? response.data
          : response.data.products || [];
        
        logAlllinenProductIds(products);

        const productsWithRatings = await Promise.all(
          products.map(async (product) => {
            try {
              if (product._id && /^[a-f\d]{24}$/i.test(product._id)) {
                const reviewsResponse = await axios.get(
                  `http://localhost:5001/api/reviews/${product._id}`
                );
                
                const reviews = reviewsResponse.data.reviews || [];
                
                const avgRating = reviews.length 
                  ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
                  : 0;
                
                return {
                  ...product,
                  image: product.image || "https://via.placeholder.com/200?text=No+Image",
                  reviews: reviews.length,
                  rating: Math.round(avgRating),
                  reviewsData: reviews
                };
              } else {
                return {
                  ...product,
                  image: product.image || "https://via.placeholder.com/200?text=No+Image",
                  reviews: 0,
                  rating: 0,
                  reviewsData: []
                };
              }
            } catch (err) {
              if (err.response?.status === 404) {
                console.warn(`No reviews found for product ${product._id}`);
              } else {
                console.error(`Error fetching reviews for product ${product._id}:`, err);
              }
              return {
                ...product,
                image: product.image || "https://via.placeholder.com/200?text=No+Image",
                reviews: 0,
                rating: 0,
                reviewsData: []
              };
            }
          })
        );
        
        setlinenProducts(productsWithRatings);
        setFilteredProducts(productsWithRatings);
      } catch (err) {
        setError("Failed to fetch linen products");
      } finally {
        setLoading(false);
      }
    };

    fetchlinenProducts();
  }, []);

  useEffect(() => {
    let filtered = linenProducts.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      return matchesSearch && matchesPrice;
    });

    if (sortOption === "priceLowToHigh") {
      filtered = filtered.sort((a, b) => a.price - b.price);
    } else if (sortOption === "priceHighToLow") {
      filtered = filtered.sort((a, b) => b.price - a.price);
    } else if (sortOption === "nameAsc") {
      filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "nameDesc") {
      filtered = filtered.sort((a, b) => b.name.localeCompare(a.name));
    }

    setFilteredProducts(filtered);
  }, [searchQuery, priceRange, sortOption, linenProducts]);

  useEffect(() => {
    if (
      showDetailsModal &&
      detailsProduct?._id &&
      isValidObjectId(detailsProduct._id)
    ) {
      setReviewsLoading(true);
      setReviewsError(null);
      if (detailsProduct.reviewsData && detailsProduct.reviewsData.length > 0) {
        setReviews(detailsProduct.reviewsData);
        setReviewsLoading(false);
      } else {
        axios
          .get(`http://localhost:5001/api/reviews/${detailsProduct._id}`)
          .then((res) => setReviews(res.data.reviews || []))
          .catch((err) => {
            setReviewsError("Failed to load reviews");
            console.error("Review fetch error:", err);
          })
          .finally(() => setReviewsLoading(false));
      }
    } else if (showDetailsModal) {
      setReviews([]);
      setReviewsLoading(false);
    }
  }, [showDetailsModal, detailsProduct]);

  useEffect(() => {
    // When state changes, update the available cities
    if (state) {
      setCityOptions(statesWithCities[state] || []);
      setCity(""); // Reset city when state changes
    } else {
      setCityOptions([]);
    }
  }, [state]);

  const fetchUserWishlist = async () => {
    if (!isAuthenticated) {
      setWishlist([]);
      return;
    }
    
    try {
      let token = localStorage.getItem("token");
      if (!token) {
        setWishlist([]);
        return;
      }
      
      if (!token.startsWith("Bearer ")) {
        token = `Bearer ${token}`;
      }
      
      setWishlistLoading(true);
      const response = await axios.get("http://localhost:5001/api/wishlist", {
        headers: { Authorization: token }
      });
      
      const wishlistIds = response.data.wishlist.map(item => 
        typeof item === 'object' && item._id ? item._id : item
      );
      
      console.log("Fetched wishlist IDs:", wishlistIds);
      setWishlist(wishlistIds);
    } catch (error) {
      if (error.response?.status === 404) {
        console.warn("No wishlist found for the user.");
        setWishlist([]);
      } else {
        console.error("Error fetching wishlist:", error);
      }
    } finally {
      setWishlistLoading(false);
    }
  };

  useEffect(() => {
    fetchUserWishlist();
  }, [isAuthenticated]);

  const handleSearch = (e) => setSearchQuery(e.target.value);

  const handlePriceChange = (e) => {
    const [min, max] = e.target.value.split("-").map(Number);
    setPriceRange([min, max]);
  };

  const handleSortChange = (e) => setSortOption(e.target.value);

  const handleWishlistToggle = async (productId) => {
    if (!isAuthenticated) {
      toast.warning("Please sign in to save items to wishlist");
      return;
    }
    
    try {
      let token = localStorage.getItem("token");
      if (!token) {
        toast.warning("Please sign in to save items to wishlist");
        return;
      }
      if (!token.startsWith("Bearer ")) {
        token = `Bearer ${token}`;
      }
      
      setWishlistLoading(true);
      
      const productIdString = productId.toString();
      const isInWishlist = wishlist.some(id => 
        id.toString() === productIdString
      );
      
      const action = isInWishlist ? "remove" : "add";
      
      if (action === "add") {
        setWishlist(prev => [...prev, productId]);
      } else {
        setWishlist(prev => prev.filter(id => id.toString() !== productIdString));
      }
      
      const response = await axios.post(
        "http://localhost:5001/api/wishlist", 
        { 
          productId,
          action
        },
        { headers: { Authorization: token } }
      );
      
      if (response.status === 200) {
        toast.success(action === "add" 
          ? "Added to your wishlist!" 
          : "Removed from your wishlist");
          
        fetchUserWishlist();
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      fetchUserWishlist();
      toast.error("Failed to update wishlist");
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleAddToCart = (product, quantity = 1) => {
    try {
      addToCart({ ...product, quantity }, navigate);
      toast.success("Item added to cart successfully!");
    } catch (error) {
      if (
        error instanceof DOMException &&
        (error.name === "QuotaExceededError" || error.code === 22)
      ) {
        toast.error("Your cart is full. Please remove some items or clear storage.");
      } else {
        console.error("Error adding to cart:", error);
        toast.error("Failed to add item to cart.");
      }
    }
  };

  const handleBuyNow = (product, quantity = 1) => {
    if (!isAuthenticated) {
      toast.warning("Please login to proceed!");
      return;
    }
    
    let imageData = product.image;
    if (imageData && !imageData.startsWith("data:image") && !imageData.startsWith("http")) {
      imageData = `data:image/jpeg;base64,${imageData}`;
    }
    
    setSelectedProduct({
      ...product,
      image: imageData,
      quantity // Pass selected quantity
    });
    setShowCheckout(true);
    setStep(1);
    setOrderPlaced(false);
    
    // Reset form fields and errors
    if (user) {
      setName(user.name || "");
    } else {
      setName("");
    }
    setPhone("");
    setAddress("");
    setState("");
    setCity("");
    setPinCode("");
    setFormErrors({});
  };

  const handleRazorpayPayment = async () => {
    // If Cash on Delivery is selected, skip Razorpay and place the order directly
    if (paymentMethod === "cod") {
      try {
        setPaymentInProgress(true);
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("You are not logged in. Please log in to place an order.");
          setPaymentInProgress(false);
          return;
        }

        const orderData = {
          items: [{
            productId: selectedProduct._id,
            name: selectedProduct.name,
            price: selectedProduct.price,
            quantity: 1,
            image: selectedProduct.image,
          }],
          totalAmount: selectedProduct.price,
          name,
          phone,
          address,
          state,
          city,
          pinCode,
          paymentMethod: "COD",
          paymentStatus: "Pending"
        };

        await axios.post(`${API_BASE_URL}/api/store-order`, orderData, {
          headers: {
            Authorization: token,
          },
        });
        
        toast.success("Order placed successfully! Payment will be collected upon delivery.");
        setOrderPlaced(true);
        setTimeout(() => {
          setShowCheckout(false);
          navigate("/profile");
        }, 2000);
        setPaymentInProgress(false);
        return;
      } catch (error) {
        console.error("Error placing COD order:", error.response || error);
        toast.error(error.response?.data?.error || "Failed to place order. Please try again.");
        setPaymentInProgress(false);
        return;
      }
    }

    // If online payment is selected, proceed with Razorpay
    try {
      setPaymentInProgress(true);
      
      const amount = selectedProduct.price;
      
      const response = await axios.post(`${API_BASE_URL}/api/create-order`, {
        amount: amount * 100,
      });

      const { orderId, key, amount: payAmount, currency } = response.data;

      const options = {
        key,
        amount: payAmount,
        currency,
        order_id: orderId,
        name: "Merit Creators",
        description: "Product Purchase",
        handler: async function (paymentResponse) {
          try {
            const token = localStorage.getItem("token");
            if (!token) {
              toast.error("You are not logged in. Please log in to place an order.");
              return;
            }

            const orderData = {
              items: [{
                productId: selectedProduct._id,
                name: selectedProduct.name,
                price: selectedProduct.price,
                quantity: 1,
                image: selectedProduct.image,
              }],
              totalAmount: amount,
              name,
              phone,
              address,
              state,
              city,
              pinCode,
              paymentId: paymentResponse.razorpay_payment_id,
            };

            await axios.post(`${API_BASE_URL}/api/store-order`, orderData, {
              headers: {
                Authorization: token,
              },
            });
            
            toast.success("Order placed successfully!");
            setOrderPlaced(true);
            setTimeout(() => {
              setShowCheckout(false);
              navigate("/profile");
            }, 2000);
          } catch (error) {
            console.error("Error storing order:", error.response || error);
            toast.error(error.response?.data?.error || "Failed to store order. Please contact support.");
          } finally {
            setPaymentInProgress(false);
          }
        },
        prefill: {
          name: user?.name || name || "Customer Name",
          email: user?.email || "customer@example.com",
          contact: phone || "9999999999",
        },
        modal: {
          ondismiss: function() {
            setPaymentInProgress(false);
          }
        }
      };

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        const rzp = new window.Razorpay(options);
        rzp.open();
      };
      script.onerror = () => {
        toast.error("Failed to load Razorpay. Please try again.");
        setPaymentInProgress(false);
      };
      document.body.appendChild(script);
    } catch (error) {
      console.error("Error initiating Razorpay payment:", error.response || error);
      toast.error("Failed to initiate payment. Please try again.");
      setPaymentInProgress(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Name validation
    if (!name.trim()) {
      errors.name = "Name is required";
    } else if (name.trim().length < 3) {
      errors.name = "Name must be at least 3 characters";
    }
    
    // Phone validation
    if (!phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(phone.trim())) {
      errors.phone = "Phone must be 10 digits";
    }
    
    // Address validation
    if (!address.trim()) {
      errors.address = "Address is required";
    } else if (address.trim().length < 5) {
      errors.address = "Address is too short";
    }
    
    // State validation
    if (!state) {
      errors.state = "Please select a state";
    }
    
    // City validation
    if (!city) {
      errors.city = "Please select a city";
    }
    
    // PIN Code validation
    if (!pinCode.trim()) {
      errors.pinCode = "PIN Code is required";
    } else if (!/^\d{6}$/.test(pinCode.trim())) {
      errors.pinCode = "PIN Code must be 6 digits";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (step === 2) {
      if (!validateForm()) {
        toast.warning("Please fill all required fields correctly.");
        return;
      }
    }
    
    if (step === 4) {
      handleRazorpayPayment();
      return;
    }
    
    setStep(step + 1);
  };

  const previousStep = () => setStep(step - 1);

  const handleViewDetails = (product) => {
    setDetailsProduct(product);
    setShowDetailsModal(true);
    setDetailsQuantity(1); // Reset quantity to 1 when opening modal
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setDetailsProduct(null);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) {
      toast.warning("Please enter your review.");
      return;
    }
    setReviewSubmitting(true);

    try {
      // Validate the product ID format
      if (!detailsProduct?._id || !isValidObjectId(detailsProduct._id)) {
        toast.warning("Invalid product for review.");
        setReviewSubmitting(false);
        return;
      }
      
      // Log the product ID being used
      logReviewProductId(detailsProduct._id);

      // Get token for authentication
      let token = localStorage.getItem("token");
      if (!token) {
        toast.warning("Please login to submit a review.");
        setReviewSubmitting(false);
        return;
      }
      if (!token.startsWith("Bearer ")) {
        token = `Bearer ${token}`;
      }

      // Submit the review directly without product verification
      const reviewResponse = await axios.post(
        "http://localhost:5001/api/reviews",
        {
          productId: detailsProduct._id,
          review: reviewText,
          rating: reviewRating,
        },
        { headers: { Authorization: token } }
      );
      
      if (reviewResponse.status === 201) {
        toast.success("Review submitted successfully!");
        setReviewText("");
        setReviewRating(5);
        
        // Refresh reviews list
        const res = await axios.get(`http://localhost:5001/api/reviews/${detailsProduct._id}`);
        setReviews(res.data.reviews || []);
      }
    } catch (err) {
      console.error("Review submit error:", err);
      if (err.response?.status === 404) {
        toast.error("Product not found. Cannot submit review.");
      } else if (err.response?.status === 401) {
        toast.error("Please login again to submit a review.");
      } else {
        toast.error(err.response?.data?.message || "Failed to submit review. Please try again.");
      }
    }
    setReviewSubmitting(false);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <Card className="border-0 shadow-sm checkout-card">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center mb-4">
                <div className="step-icon-large bg-primary text-white">1</div>
                <h5 className="mb-0 ms-3">Review Your Order</h5>
              </div>
              
              <div className="bg-light p-3 rounded mb-4">
                <h6 className="text-muted mb-3 border-bottom pb-2">ORDER SUMMARY</h6>
                <div className="d-flex align-items-center">
                  <div className="position-relative checkout-product-img-container">
                    <img 
                      src={getImageSrc(selectedProduct?.image)} 
                      alt={selectedProduct?.name} 
                      className="checkout-product-img"
                    />
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary">
                      1
                    </span>
                  </div>
                  <div className="ms-3 flex-grow-1">
                    <h6 className="mb-1 product-name">{selectedProduct?.name}</h6>
                    <div className="d-flex justify-content-between align-items-center">
                      <Badge bg="light" text="dark" className="border">
                        Unit Price: ₹{selectedProduct?.price}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="price-summary">
                <div className="d-flex justify-content-between py-2">
                  <span>Subtotal</span>
                  <span>₹{selectedProduct?.price}</span>
                </div>
                <div className="d-flex justify-content-between py-2">
                  <span>Shipping</span>
                  <span className="text-success">FREE</span>
                </div>
                <div className="d-flex justify-content-between py-2">
                  <span>Tax</span>
                  <span>₹0</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between py-2 fw-bold">
                  <span>Total</span>
                  <span className="total-price">₹{selectedProduct?.price}</span>
                </div>
              </div>
              
              <div className="mt-4 checkout-info-box">
                <div className="d-flex">
                  <Truck className="text-primary me-3 mt-1" size={22} />
                  <div>
                    <h6 className="mb-1">Free shipping</h6>
                    <p className="text-muted small mb-0">Delivery within 3-5 business days</p>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        );

      case 2:
        return (
          <Card className="border-0 shadow-sm checkout-card">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center mb-4">
                <div className="step-icon-large bg-primary text-white">2</div>
                <h5 className="mb-0 ms-3">Delivery Information</h5>
              </div>
              
              <Form>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-semibold">
                        Full Name <span className="text-danger">*</span>
                      </Form.Label>
                      <InputGroup hasValidation>
                        <InputGroup.Text className="bg-light">
                          <i className="bi bi-person"></i>
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter your full name"
                          isInvalid={!!formErrors.name}
                        />
                        <Form.Control.Feedback type="invalid">
                          {formErrors.name}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label className="fw-semibold">
                        Phone Number <span className="text-danger">*</span>
                      </Form.Label>
                      <InputGroup hasValidation>
                        <InputGroup.Text className="bg-light">+91</InputGroup.Text>
                        <Form.Control
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                          placeholder="10-digit number"
                          maxLength={10}
                          isInvalid={!!formErrors.phone}
                        />
                        <Form.Control.Feedback type="invalid">
                          {formErrors.phone}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label className="fw-semibold">
                        Address Line <span className="text-danger">*</span>
                      </Form.Label>
                      <InputGroup hasValidation>
                        <InputGroup.Text className="bg-light">
                          <GeoAlt size={16} />
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="House/Flat No., Street Name, Area"
                          isInvalid={!!formErrors.address}
                        />
                        <Form.Control.Feedback type="invalid">
                          {formErrors.address}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label className="fw-semibold">
                        State <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Select 
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        isInvalid={!!formErrors.state}
                        className="form-select-custom"
                      >
                        <option value="">Select State</option>
                        {Object.keys(statesWithCities).map((stateName) => (
                          <option key={stateName} value={stateName}>
                            {stateName}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {formErrors.state}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label className="fw-semibold">
                        City <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Select 
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        disabled={!state}
                        isInvalid={!!formErrors.city}
                        className="form-select-custom"
                      >
                        <option value="">Select City</option>
                        {cityOptions.map((cityName) => (
                          <option key={cityName} value={cityName}>
                            {cityName}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {formErrors.city}
                      </Form.Control.Feedback>
                      {!state && !formErrors.city && (
                        <Form.Text className="text-muted">
                          Please select a state first
                        </Form.Text>
                      )}
                    </Form.Group>
                  </Col>
                  
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label className="fw-semibold">
                        PIN Code <span className="text-danger">*</span>
                      </Form.Label>
                      <InputGroup hasValidation>
                        <InputGroup.Text className="bg-light">
                          <i className="bi bi-geo"></i>
                        </InputGroup.Text>
                        <Form.Control
                          type="text"
                          value={pinCode}
                          onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                          placeholder="6-digit PIN"
                          maxLength={6}
                          isInvalid={!!formErrors.pinCode}
                        />
                        <Form.Control.Feedback type="invalid">
                          {formErrors.pinCode}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        );

      case 3:
        return (
          <Card className="border-0 shadow-sm checkout-card">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center mb-4">
                <div className="step-icon-large bg-primary text-white">3</div>
                <h5 className="mb-0 ms-3">Confirm Your Details</h5>
              </div>
              
              <div className="bg-light p-3 rounded mb-4">
                <h6 className="text-muted mb-3 border-bottom pb-2">ORDER SUMMARY</h6>
                <div className="d-flex align-items-center">
                  <div className="position-relative checkout-product-img-container">
                    <img 
                      src={getImageSrc(selectedProduct?.image)} 
                      alt={selectedProduct?.name} 
                      className="checkout-product-img"
                    />
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary">
                      1
                    </span>
                  </div>
                  <div className="ms-3 flex-grow-1">
                    <h6 className="mb-1 product-name">{selectedProduct?.name}</h6>
                    <div className="d-flex justify-content-between align-items-center">
                      <Badge bg="light" text="dark" className="border">
                        Unit Price: ₹{selectedProduct?.price}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="row">
                <div className="col-md-6">
                  <div className="order-details-section">
                    <h6 className="section-title">Customer Details</h6>
                    <div className="detail-item">
                      <div className="detail-label">Name:</div>
                      <div className="detail-value">{name}</div>
                    </div>
                    <div className="detail-item">
                      <div className="detail-label">Phone:</div>
                      <div className="detail-value">{phone}</div>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="order-details-section">
                    <h6 className="section-title">Shipping Address</h6>
                    <div className="shipping-address">
                      <p className="mb-1">{name}</p>
                      <p className="mb-1">{address}</p>
                      <p className="mb-1">{city}, {state} - {pinCode}</p>
                      <p className="mb-1">Phone: {phone}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="price-summary mt-4">
                <div className="d-flex justify-content-between py-2">
                  <span>Subtotal</span>
                  <span>₹{selectedProduct?.price}</span>
                </div>
                <div className="d-flex justify-content-between py-2">
                  <span>Shipping</span>
                  <span className="text-success">FREE</span>
                </div>
                <div className="d-flex justify-content-between py-2">
                  <span>Tax</span>
                  <span>₹0</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between py-2 fw-bold">
                  <span>Total</span>
                  <span className="total-price">₹{selectedProduct?.price}</span>
                </div>
              </div>
              
              <div className="mt-4">
                <Form.Group>
                  <Form.Label className="fw-semibold">Choose Payment Method</Form.Label>
                  <div className="payment-method-options">
                    <Form.Check
                      type="radio"
                      id="payment-online"
                      name="paymentMethod"
                      label={
                        <div className="d-flex align-items-center">
                          <CurrencyDollar className="me-2" size={20} />
                          <div>
                            <span className="d-block">Online Payment</span>
                            <small className="text-muted">Pay securely with Razorpay</small>
                          </div>
                        </div>
                      }
                      value="online"
                      checked={paymentMethod === "online"}
                      onChange={() => setPaymentMethod("online")}
                      className="payment-method-option"
                    />
                    <Form.Check
                      type="radio"
                      id="payment-cod"
                      name="paymentMethod"
                      label={
                        <div className="d-flex align-items-center">
                          <Truck className="me-2" size={20} />
                          <div>
                            <span className="d-block">Cash on Delivery</span>
                            <small className="text-muted">Pay when you receive the product</small>
                          </div>
                        </div>
                      }
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="payment-method-option mt-2"
                    />
                  </div>
                </Form.Group>
              </div>
              
              <Alert variant="info" className="d-flex align-items-center mt-4">
                <ShieldLock className="text-primary me-2" size={18} />
                <div>
                  Please verify all details are correct before proceeding to payment.
                </div>
              </Alert>
            </Card.Body>
          </Card>
        );

      case 4:
        return (
          <Card className="border-0 shadow-sm checkout-card">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center mb-4">
                <div className="step-icon-large bg-primary text-white">4</div>
                <h5 className="mb-0 ms-3">Complete Payment</h5>
              </div>
              
              <div className="text-center payment-info">
                <div className="mb-4">
                  <div className="total-amount-circle">
                    <div>
                      <small className="text-muted">Total</small>
                      <div className="amount">₹{selectedProduct?.price}</div>
                    </div>
                  </div>
                </div>
                
                <div className="selected-payment-method mb-4">
                  <h6 className="mb-3">Selected Payment Method:</h6>
                  <div className={`payment-method-card ${paymentMethod === "online" ? "online" : "cod"}`}>
                    {paymentMethod === "online" ? (
                      <>
                        <div className="payment-method-icon">
                          <CurrencyDollar size={28} />
                        </div>
                        <div className="payment-method-details">
                          <h6 className="mb-1">Online Payment</h6>
                          <p className="mb-0">You'll be redirected to our secure payment partner</p>
                          <img 
                            src="https://upload.wikimedia.org/wikipedia/en/e/e8/Razorpay_logo.svg" 
                            alt="Razorpay" 
                            height="25"
                            className="mt-2" 
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="payment-method-icon cod">
                          <Truck size={28} />
                        </div>
                        <div className="payment-method-details">
                          <h6 className="mb-1">Cash on Delivery</h6>
                          <p className="mb-0">Pay when you receive the product at your doorstep</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="order-summary-container p-3 bg-light rounded mb-4">
                  <div className="d-flex align-items-center mb-3">
                    <img 
                      src={getImageSrc(selectedProduct?.image)} 
                      alt={selectedProduct?.name} 
                      width="50" 
                      height="50" 
                      className="me-3 rounded"
                      style={{ objectFit: "cover" }}
                    />
                    <div>
                      <h6 className="mb-0">{selectedProduct?.name}</h6>
                      <span className="badge bg-success">₹{selectedProduct?.price}</span>
                    </div>
                  </div>
                  <div className="address-summary">
                    <small className="text-muted d-block">Delivery Address:</small>
                    <small>{address}, {city}, {state} - {pinCode}</small>
                  </div>
                </div>
                
                {paymentMethod === "online" && (
                  <div className="security-info mb-3">
                    <div className="d-flex align-items-center justify-content-center">
                      <ShieldLock className="text-success me-2" size={22} />
                      <span>Your payment information is secure</span>
                    </div>
                    <div className="payment-icons mt-3">
                      <i className="payment-icon bi bi-credit-card me-2"></i>
                      <i className="payment-icon bi bi-paypal me-2"></i>
                      <i className="payment-icon bi bi-wallet2 me-2"></i>
                      <i className="payment-icon bi bi-bank me-2"></i>
                      <i className="payment-icon bi bi-currency-rupee"></i>
                    </div>
                  </div>
                )}
                
                <div className="action-text">
                  <p className="mb-0">
                    {paymentMethod === "online" 
                      ? "Click 'Pay Now' to complete your payment." 
                      : "Click 'Place Order' to confirm your Cash on Delivery order."}
                  </p>
                </div>
              </div>
            </Card.Body>
          </Card>
        );

      default:
        return null;
    }
  };

  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
      .checkout-card {
        transition: all 0.3s ease;
        border-radius: 12px;
        overflow: hidden;
      }
      
      .checkout-card:hover {
        box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important;
      }
      
      .step-icon-large {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 1.2rem;
      }
      
      .checkout-product-img-container {
        width: 80px;
        height: 80px;
      }
      
      .checkout-product-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 8px;
      }
      
      .product-name {
        font-weight: 600;
        color: #333;
      }
      
      .price-summary {
        background-color: #f8f9fa;
        padding: 15px;
        border-radius: 8px;
        margin-top: 20px;
      }
      
      .total-price {
        font-size: 1.2rem;
        color: #198754;
      }
      
      .checkout-info-box {
        background-color: #f0f8ff;
        padding: 15px;
        border-radius: 8px;
        border-left: 4px solid #0d6efd;
      }
      
      .form-select-custom {
        padding-left: 12px;
        height: calc(1.5em + 0.75rem + 10px);
      }
      
      .progress-track {
        position: absolute;
        height: 4px;
        background-color: #e9ecef;
        width: 75%;
        top: 20px;
        left: 12%;
        z-index: 0;
        border-radius: 4px;
        overflow: hidden;
      }
      
      .progress-line {
        height: 100%;
        background-color: #0d6efd;
        transition: width 0.5s ease;
        position: relative;
        border-radius: 4px;
      }
      
      .progress-animation {
        position: absolute;
        top: 0;
        right: 0;
        height: 100%;
        width: 60px;
        background: linear-gradient(90deg, rgba(13,110,253,0) 0%, rgba(255,255,255,0.5) 50%, rgba(13,110,253,0) 100%);
        animation: shimmer 1.5s infinite;
      }
      
      .step-item {
        z-index: 1;
        text-align: center;
        transition: all 0.3s ease;
        position: relative;
        width: 60px;
      }
      
      .step-icon {
        width: 40px;
        height: 40px;
        background-color: #e9ecef;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 8px;
        transition: all 0.3s ease;
        position: relative;
        box-shadow: 0 0 0 4px #fff;
      }
      
      .pulse-animation {
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: rgba(13, 110, 253, 0.2);
        animation: pulse 1.5s infinite;
      }
      
      .step-item.active .step-icon {
        background-color: #0d6efd;
        color: white;
        transform: scale(1.1);
      }
      
      .step-item.completed .step-icon {
        background-color: #198754;
        color: white;
      }
      
      .complete-icon {
        animation: check-pop 0.5s ease-out;
      }
      
      .step-item.active .step-title {
        color: #0d6efd;
        font-weight: 600;
      }
      
      .step-item.completed .step-title {
        color: #198754;
        font-weight: 600;
      }
      
      .step-connector {
        position: absolute;
        top: 20px;
        left: 70px;
        height: 4px;
        width: calc(100% - 20px);
        background-color: transparent;
        z-index: 0;
        overflow: hidden;
      }
      
      .step-connector.completed {
        background-color: #198754;
      }
      
      .moving-dot {
        position: absolute;
        width: 10px;
        height: 10px;
        background-color: white;
        border-radius: 50%;
        top: -3px;
        left: 0;
        animation: move-dot 3s infinite;
        box-shadow: 0 0 5px rgba(0,0,0,0.3);
      }
      
      @keyframes pulse {
        0% {
          transform: scale(1);
          opacity: 0.8;
        }
        50% {
          transform: scale(1.5);
          opacity: 0;
        }
        100% {
          transform: scale(1);
          opacity: 0;
        }
      }
      
      @keyframes shimmer {
        0% {
          transform: translateX(-100%);
        }
        100% {
          transform: translateX(100%);
        }
      }
      
      @keyframes move-dot {
        0% {
          left: 0;
        }
        50% {
          left: calc(100% - 10px);
        }
        100% {
          left: 0;
        }
      }
      
      @keyframes check-pop {
        0% {
          transform: scale(0);
        }
        70% {
          transform: scale(1.2);
        }
        100% {
          transform: scale(1);
        }
      }

      /* New Checkout Progress Bar Styles */
      .checkout-progress {
        position: relative;
        padding: 30px 0;
        margin-bottom: 2rem;
        overflow: visible;
      }

      .checkout-steps-container {
        display: flex;
        justify-content: space-between;
        position: relative;
        max-width: 700px;
        margin: 0 auto;
      }

      .checkout-step {
        position: relative;
        z-index: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        flex: 1;
      }

      .step-circle {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: #e9ecef;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 0 5px white, 0 2px 5px rgba(0,0,0,0.1);
        position: relative;
        transition: all 0.5s ease;
        margin-bottom: 10px;
        font-weight: 500;
        color: #6c757d;
      }

      .checkout-step.active .step-circle {
        background-color: #0d6efd;
        color: white;
        transform: scale(1.15);
        box-shadow: 0 0 0 5px white, 0 5px 15px rgba(13, 110, 253, 0.3);
      }

      .checkout-step.completed .step-circle {
        background-color: #198754;
        color: white;
        box-shadow: 0 0 0 5px white, 0 5px 15px rgba(25, 135, 84, 0.3);
      }

      .step-number {
        font-size: 1.2rem;
        position: relative;
      }

      .check-icon {
        font-size: 1.3rem;
        animation: check-appear 0.5s ease;
      }

      .step-label {
        font-weight: 500;
        font-size: 0.9rem;
        color: #6c757d;
        transition: all 0.3s ease;
      }

      .checkout-step.active .step-label {
        color: #0d6efd;
        font-weight: 600;
      }

      .checkout-step.completed .step-label {
        color: #198754;
        font-weight: 600;
      }

      .step-line {
        position: absolute;
        top: 25px;
        left: 60%;
        width: 80%;
        height: 4px;
        background-color: #e9ecef;
        z-index: 0;
        border-radius: 4px;
        overflow: hidden;
      }

      .step-line.completed {
        background-color: #198754;
      }

      .active-pulse {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: rgba(13, 110, 253, 0.3);
        animation: pulse-ring 2s ease infinite;
      }

      .moving-car-container {
        position: absolute;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }

      .moving-car {
        position: absolute;
        color: white;
        font-size: 20px;
        top: -8px;
        animation: move-truck 4s linear infinite;
      }

      @keyframes pulse-ring {
        0% {
          transform: translate(-50%, -50%) scale(0.8);
          opacity: 0.8;
        }
        50% {
          transform: translate(-50%, -50%) scale(1.3);
          opacity: 0;
        }
        100% {
          transform: translate(-50%, -50%) scale(0.8);
          opacity: 0;
        }
      }

      @keyframes check-appear {
        0% {
          transform: scale(0);
          opacity: 0;
        }
        50% {
          transform: scale(1.3);
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }

      @keyframes move-truck {
        0% {
          left: -15px;
        }
        100% {
          left: calc(100% + 15px);
        }
      }
    `;
    document.head.appendChild(styleEl);
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  return (
    <Container fluid className="mt-5 pt-5 px-4">
      <ToastContainer position="top-right" autoClose={3000} style={{ paddingTop: 80 }} />
      
      <div className="linen-header d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-2">linen Collection</h2>
          <p className="text-muted mb-0">Explore our premium linen essentials.</p>
        </div>
        <Button 
          variant="primary" 
          className="d-flex align-items-center gap-2 rounded-pill px-3 py-2 shadow-sm"
          onClick={() => navigate("/cart")}
        >
          <CartPlus size={18} />
          <span>Cart</span>
          <Badge bg="light" text="dark" pill className="cart-badge">
            {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
          </Badge>
        </Button>
      </div>

      <div className="filter-bar">
        <Row>
          <Col md={4}>
            <InputGroup>
              <InputGroup.Text className="bg-white border-end-0">
                <Search size={16} />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search linen items..."
                value={searchQuery}
                onChange={handleSearch}
                className="border-start-0"
              />
            </InputGroup>
          </Col>
          <Col md={4}>
            <InputGroup>
              <InputGroup.Text className="bg-white border-end-0">
                <Filter size={16} />
              </InputGroup.Text>
              <Form.Select onChange={handlePriceChange} className="border-start-0">
                <option value="0-10000">Filter by Price</option>
                <option value="0-500">₹0 - ₹500</option>
                <option value="500-1000">₹500 - ₹1000</option>
                <option value="1000-5000">₹1000 - ₹5000</option>
                <option value="5000-10000">₹5000 - ₹10000</option>
              </Form.Select>
            </InputGroup>
          </Col>
          <Col md={4}>
            <InputGroup>
              <InputGroup.Text className="bg-white border-end-0">
                <SortDown size={16} />
              </InputGroup.Text>
              <Form.Select onChange={handleSortChange} className="border-start-0">
                <option value="">Sort Products</option>
                <option value="priceLowToHigh">Price: Low to High</option>
                <option value="priceHighToLow">Price: High to Low</option>
                <option value="nameAsc">Name: A to Z</option>
                <option value="nameDesc">Name: Z to A</option>
              </Form.Select>
            </InputGroup>
          </Col>
        </Row>
      </div>

      {filteredProducts.length > 0 ? (
        <Row>
          {filteredProducts.map((product) => (
            <Col key={product._id} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <Card className="h-100 border-0 shadow-sm product-card">
                <div className="position-relative overflow-hidden">
                  <div 
                    className="image-container"
                    onClick={() => handleViewDetails(product)}
                    style={{ cursor: "pointer" }}
                  >
                    <Card.Img
                      variant="top"
                      src={
                        product.image?.startsWith("data:image")
                          ? product.image
                          : `data:image/jpeg;base64,${product.image}`
                      }
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://via.placeholder.com/200?text=No+Image";
                      }}
                      style={{ objectFit: "cover", height: "250px" }}
                    />
                    <Button 
                      variant="light" 
                      className="buy-now-button shadow"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(product);
                      }}
                    >
                      View Details
                    </Button>
                  </div>

                  <div className="price-tag">
                    ₹{product.price}
                  </div>

                  <button
                    className={`wishlist-btn ${wishlist.includes(product._id) ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWishlistToggle(product._id);
                    }}
                  >
                    {wishlist.includes(product._id) ? (
                      <HeartFill color="#dc3545" />
                    ) : (
                      <Heart />
                    )}
                  </button>
                  
                  {product.discount && (
                    <Badge
                      bg="danger"
                      className="position-absolute top-0 end-0 m-2 mt-5"
                    >
                      {product.discount}% OFF
                    </Badge>
                  )}
                </div>
                
                <Card.Body className="d-flex flex-column">
                  <div className="product-title">{product.name}</div>
                  
                  <div className="d-flex align-items-center mb-3">
                    <div className="text-warning me-2">
                      {Array(5).fill().map((_, i) => (
                        <span key={i}>
                          {i < (product.rating || 0) ? <StarFill size={14} /> : <Star size={14} />}
                        </span>
                      ))}
                    </div>
                    <small className="text-muted">
                      {product.reviews || 0} {product.reviews === 1 ? 'review' : 'reviews'}
                    </small>
                  </div>
                  
                  <div className="mb-3">
                    {product.oldPrice && (
                      <span className="text-muted text-decoration-line-through me-2">
                        ₹{product.oldPrice}
                      </span>
                    )}
                    <span className="fw-bold text-success">₹{product.price}</span>
                  </div>
                  
                  <div className="mt-auto d-flex flex-column gap-2">
                    <Button
                      variant="warning"
                      className="w-100 btn-add-cart"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                    >
                      <CartPlus className="me-1" /> Add to Cart
                    </Button>
                    <Button
                      variant="primary"
                      className="w-100 btn-buy-now"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBuyNow(product);
                      }}
                    >
                      Buy Now
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <div className="no-products">
          <p>No linen products found. Try adjusting your filter.</p>
          <Button variant="outline-primary" onClick={() => {
            setSearchQuery("");
            setPriceRange([0, 10000]);
            setSortOption("");
          }}>
            Clear Filters
          </Button>
        </div>
      )}      
      <Modal show={showDetailsModal} onHide={handleCloseDetailsModal} size="lg" centered className="product-modal">
        <Modal.Header closeButton>
          <Modal.Title>Product Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {detailsProduct && (
            <Row>
              <Col md={6} className="mb-4 mb-md-0">
                <div className="product-image-container" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  {detailsProduct.discount && (
                    <Badge bg="danger" className="discount-tag">
                      {detailsProduct.discount}% OFF
                    </Badge>
                  )}
                  {/* Portrait image, centered and fixed size */}
                  <img
                    src={
                      detailsProduct.image?.startsWith("data:image")
                        ? detailsProduct.image
                        : `data:image/jpeg;base64,${detailsProduct.image}`
                    }
                    alt={detailsProduct.name}
                    className="product-detail-img"
                    style={{
                      width: "220px",
                      height: "330px",
                      objectFit: "cover",
                      borderRadius: "12px",
                      boxShadow: "0 2px 16px rgba(0,0,0,0.08)"
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/220x330?text=No+Image";
                    }}
                  />
                  {/* No thumbnails, no view images */}
                </div>
              </Col>
              <Col md={6}>
                <h3 className="product-detail-title">{detailsProduct.name}</h3>
                
                <div className="d-flex align-items-center mb-3">
                  <div className="rating-stars me-2">
                    {Array(5).fill().map((_, i) => (
                      <span key={i} className="star-icon">
                        {i < (detailsProduct.rating || 0) ? <StarFill size={18} /> : <Star size={18} />}
                      </span>
                    ))}
                  </div>
                  <span className="review-count">
                    {detailsProduct.reviews || 0} {detailsProduct.reviews === 1 ? 'review' : 'reviews'}
                  </span>
                </div>
                
                <div className="product-price-section">
                  <div className="current-price">₹{detailsProduct.price?.toFixed(2)}</div>
                  {detailsProduct.oldPrice && (
                    <div className="price-details">
                      <span className="old-price">₹{detailsProduct.oldPrice?.toFixed(2)}</span>
                      <span className="discount-percentage">
                        {Math.round(((detailsProduct.oldPrice - detailsProduct.price) / detailsProduct.oldPrice) * 100)}% off
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="product-description">
                  <p>{detailsProduct.description || detailsProduct.details || "Premium quality linen essential designed for everyday use. Elevate your cooking experience with this elegant and functional product."}</p>
                </div>
                
                <div className="product-attributes">
                  {detailsProduct.brand && (
                    <div className="attribute">
                      <span className="attribute-label">Brand:</span>
                      <span className="attribute-value">{detailsProduct.brand}</span>
                    </div>
                  )}
                  {detailsProduct.material && (
                    <div className="attribute">
                      <span className="attribute-label">Material:</span>
                      <span className="attribute-value">{detailsProduct.material}</span>
                    </div>
                  )}
                  {detailsProduct.dimensions && (
                    <div className="attribute">
                      <span className="attribute-label">Dimensions:</span>
                      <span className="attribute-value">{detailsProduct.dimensions}</span>
                    </div>
                  )}
                </div>
                
                <div className="shipping-info">
                  <div className="shipping-item">
                    <Truck className="shipping-icon" size={20} />
                    <div className="shipping-text">
                      <span className="shipping-title">Free Delivery</span>
                      <span className="shipping-detail">On orders above ₹500</span>
                    </div>
                  </div>
                  <div className="shipping-item">
                    <ArrowRight className="shipping-icon" size={20} />
                    <div className="shipping-text">
                      <span className="shipping-title">7 Days Returns</span>
                      <span className="shipping-detail">Change of mind accepted</span>
                    </div>
                  </div>
                </div>
                
                <div className="quantity-selector">
                  <span className="quantity-label">Quantity:</span>
                  <div className="quantity-controls">
                    <Button 
                      variant="outline-secondary" 
                      size="sm" 
                      className="quantity-btn"
                      onClick={() => setDetailsQuantity(q => Math.max(1, q - 1))}
                    >
                      -
                    </Button>
                    <input
                      type="number"
                      className="quantity-input"
                      value={detailsQuantity}
                      readOnly
                    />
                    <Button 
                      variant="outline-secondary" 
                      size="sm" 
                      className="quantity-btn"
                      onClick={() => setDetailsQuantity(q => q + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
                
                <div className="action-buttons">
                  <Button
                    variant="outline-primary"
                    className="btn-add-cart w-100"
                    onClick={() => handleAddToCart(detailsProduct, detailsQuantity)}
                  >
                    <CartPlus size={18} className="me-2" /> Add to Cart
                  </Button>
                  <Button
                    variant="primary"
                    className="btn-buy-now w-100"
                    onClick={() => {
                      handleCloseDetailsModal();
                      handleBuyNow(detailsProduct, detailsQuantity);
                    }}
                  >
                    Buy Now
                  </Button>
                  <Button
                    variant={wishlist.includes(detailsProduct._id) ? "danger" : "outline-danger"}
                    className="btn-wishlist"
                    onClick={() => handleWishlistToggle(detailsProduct._id)}
                  >
                    {wishlist.includes(detailsProduct._id) ? <HeartFill size={18} /> : <Heart size={18} />}
                  </Button>
                </div>
              </Col>
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0">
          <div className="w-100">
            <Tabs defaultActiveKey="specifications" className="mb-3">
              <Tab eventKey="specifications" title="Specifications">
                <div className="specifications-table">
                  {detailsProduct?.specifications ? (
                    <Row>
                      {Object.entries(detailsProduct.specifications).map(([key, value], index) => (
                        <Col md={6} key={index} className="specification-item">
                          <div className="spec-key">{key}</div>
                          <div className="spec-value">{value}</div>
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    <div className="no-specs">
                      <p>No detailed specifications available for this product.</p>
                    </div>
                  )}
                </div>
              </Tab>
              <Tab eventKey="reviews" title={`Reviews (${reviews.length})`}>
                {reviewsLoading ? (
                  <div className="text-center py-3">
                    <Spinner animation="border" size="sm" className="me-2" />
                    <span>Loading reviews...</span>
                  </div>
                ) : reviewsError ? (
                  <Alert variant="danger">{reviewsError}</Alert>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-3 bg-light rounded">
                    <p className="text-muted mb-0">No reviews yet. Be the first to review!</p>
                  </div>
                ) : (
                  <div className="review-list">
                    {reviews.map((rev) => (
                      <div key={rev._id} className="review-item">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <div className="d-flex align-items-center">
                            <div className="review-avatar">
                              {(rev.userId?.name || "User").charAt(0)}
                            </div>
                            <strong className="ms-2">
                              {rev.userId?.name || "User"}
                            </strong>
                          </div>
                          <small className="text-muted">
                            {new Date(rev.createdAt).toLocaleDateString()}
                          </small>
                        </div>
                        <div className="review-rating">
                          {Array(5).fill().map((_, i) => (
                            <span key={i} className={`star ${i < rev.rating ? 'filled' : ''}`}>
                              {i < rev.rating ? <StarFill size={14} /> : <Star size={14} />}
                            </span>
                          ))}
                        </div>
                        <p className="review-text">{rev.text}</p>
                      </div>
                    ))}
                  </div>
                )}
                {isAuthenticated ? (
                  <div className="review-form">
                    <h6 className="review-form-title">Write a Review</h6>
                    <Form onSubmit={handleReviewSubmit}>
                      <Form.Group className="mb-3">
                        <Form.Label>Your Rating</Form.Label>
                        <div className="d-flex rating-selector">
                          {[5, 4, 3, 2, 1].map((star) => (
                            <Form.Check
                              key={star}
                              inline
                              type="radio"
                              id={`rating-${star}`}
                              label={`${star} Star${star > 1 ? 's' : ''}`}
                              name="rating"
                              value={star}
                              checked={reviewRating === star}
                              onChange={() => setReviewRating(star)}
                              className="me-3"
                            />
                          ))}
                        </div>
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Your Review</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          placeholder="Share your experience with this product..."
                          disabled={reviewSubmitting}
                        />
                      </Form.Group>
                      <Button
                        type="submit"
                        variant="success"
                        disabled={reviewSubmitting}
                        className="px-4"
                      >
                        {reviewSubmitting ? (
                          <>
                            <Spinner animation="border" size="sm" className="me-2" />
                            Submitting...
                          </>
                        ) : (
                          "Submit Review"
                        )}
                      </Button>
                    </Form>
                  </div>
                ) : (
                  <Alert variant="info" className="mt-3">
                    Please <Button variant="link" className="p-0" onClick={() => navigate("/signin")}>sign in</Button> to leave a review.
                  </Alert>
                )}
              </Tab>
              <Tab eventKey="shipping" title="Shipping & Returns">
                <div className="shipping-returns-info">
                  <div className="info-section">
                    <h5>Shipping Information</h5>
                    <p>We offer free shipping on all orders over ₹500. Standard delivery typically takes 3-5 business days, depending on your location.</p>
                  </div>
                  
                  <div className="info-section">
                    <h5>Return Policy</h5>
                    <p>We accept returns within 7 days of delivery. The product must be in its original condition and packaging.</p>
                  </div>
                  
                  <div className="info-section">
                    <h5>Warranty</h5>
                    <p>This product comes with a standard manufacturer's warranty of 12 months from the date of purchase.</p>
                  </div>
                </div>
              </Tab>
            </Tabs>
          </div>
        </Modal.Footer>
      </Modal>
      
      <Modal show={showCheckout} onHide={() => setShowCheckout(false)} size="lg">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="text-primary">Quick Checkout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {orderPlaced ? (
            <div className="text-center py-5">
              <CheckCircle size={60} className="text-success mb-3" />
              <h4 className="text-success mb-3">Order Placed Successfully!</h4>
              <p className="mb-1">
                Order ID: #{Math.random().toString(36).substr(2, 9)}
              </p>
              <p className="text-muted mb-4">
                {paymentMethod === "cod" 
                  ? "Thank you for shopping with us! Your cash on delivery order has been confirmed." 
                  : "Thank you for shopping with us! Your payment has been received."}
              </p>
              <div className="d-flex justify-content-center gap-3">
                <Button
                  variant="outline-primary"
                  onClick={() => window.location.href = "/linen"}
                               >
                  Continue Shopping
                </Button>
                <Button
                  variant="primary"
                  onClick={() => navigate("/profile")}
                >
                  View My Orders
                </Button>
              </div>
            </div>
          ) : (
            <>
              <CheckoutProgressBar currentStep={step} />
              {renderStepContent()}
            </>
          )}
        </Modal.Body>
        {!orderPlaced && (
          <Modal.Footer className="border-0">
            {step > 1 && (
              <Button variant="outline-secondary" onClick={previousStep} disabled={paymentInProgress}>
                Back
              </Button>
            )}
            {step < 4 ? (
              <Button variant="warning" onClick={nextStep} disabled={paymentInProgress}>
                Continue <ArrowRight size={20} />
              </Button>
            ) : (
              <Button 
                variant={paymentMethod === "online" ? "success" : "primary"} 
                onClick={handleRazorpayPayment} 
                disabled={paymentInProgress}
                className="px-4"
              >
                {paymentInProgress ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    {paymentMethod === "online" ? (
                      <>Pay Now <CurrencyDollar className="ms-2" /></>
                    ) : (
                      <>Place Order <Truck className="ms-2" /></>
                    )}
                  </>
                )}
              </Button>
            )}
          </Modal.Footer>
        )}
      </Modal>
    </Container>
  );
};

export default linen;
