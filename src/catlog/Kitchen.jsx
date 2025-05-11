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
import "../css/kitchen.css";

const CheckoutProgressBar = ({ currentStep }) => {
  const steps = [
    { title: 'Review', icon: <BagCheck /> },
    { title: 'Address', icon: <GeoAlt /> },
    { title: 'Payment', icon: <CurrencyDollar /> },
    { title: 'Place Order', icon: <ShieldLock /> }
  ];

  return (
    <div className="checkout-progress mb-4">
      <div className="d-flex justify-content-between position-relative">
        {steps.map((step, index) => (
          <div 
            key={index} 
            className={`step-item ${currentStep >= index + 1 ? 'active' : ''}`}
          >
            <div className="step-icon">
              {currentStep > index + 1 ? <CheckCircle /> : step.icon}
            </div>
            <div className="step-title">{step.title}</div>
          </div>
        ))}
        <div className="progress-line" style={{ width: `${(currentStep - 1) * 33.33}%` }} />
      </div>
    </div>
  );
};

const Kitchen = () => {
  const [kitchenProducts, setKitchenProducts] = useState([]);
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
  const [paymentMethod, setPaymentMethod] = useState("");
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

  const { cartItems, addToCart } = useContext(CartContext);
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const isValidObjectId = (id) => /^[a-f\d]{24}$/i.test(id);

  useEffect(() => {
    const fetchKitchenProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products", {
          params: { category: "kitchen" },
        });
        const products = Array.isArray(response.data)
          ? response.data
          : response.data.products || [];
        
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
              console.error(`Error fetching reviews for product ${product._id}:`, err);
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
        
        setKitchenProducts(productsWithRatings);
        setFilteredProducts(productsWithRatings);
      } catch (err) {
        setError("Failed to fetch kitchen products");
      } finally {
        setLoading(false);
      }
    };

    fetchKitchenProducts();
  }, []);

  useEffect(() => {
    let filtered = kitchenProducts.filter((product) => {
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
  }, [searchQuery, priceRange, sortOption, kitchenProducts]);

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

  const fetchUserWishlist = async () => {
    if (!isAuthenticated) return;
    
    try {
      let token = localStorage.getItem("token");
      if (!token) return;
      if (!token.startsWith("Bearer ")) {
        token = `Bearer ${token}`;
      }
      
      setWishlistLoading(true);
      const response = await axios.get("http://localhost:5001/api/wishlist", {
        headers: { Authorization: token }
      });
      
      setWishlist(response.data.wishlist || []);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
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
      
      const isAdding = !wishlist.includes(productId);
      
      if (isAdding) {
        setWishlist(prev => [...prev, productId]);
      } else {
        setWishlist(prev => prev.filter(id => id !== productId));
      }
      
      await axios.post(
        "http://localhost:5001/api/wishlist", 
        { 
          productId,
          action: isAdding ? "add" : "remove" 
        },
        { headers: { Authorization: token } }
      );
      
      toast.success(isAdding 
        ? "Added to your wishlist!" 
        : "Removed from your wishlist");
        
    } catch (error) {
      console.error("Error updating wishlist:", error);
      
      fetchUserWishlist();
      toast.error("Failed to update wishlist");
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    try {
      addToCart(product, navigate);
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

  const handleBuyNow = (product) => {
    const isAuthenticated = localStorage.getItem("token");
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
      image: imageData
    });
    setShowCheckout(true);
    setStep(1);
    setOrderPlaced(false);
  };

  const handleViewDetails = (product) => {
    setDetailsProduct(product);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setDetailsProduct(null);
  };

  const nextStep = () => {
    if (step === 2 && address.trim() === "") {
      toast.warning("Please enter delivery address.");
      return;
    }
    if (step === 3 && (name.trim() === "" || phone.trim() === "")) {
      toast.warning("Please enter your name and phone number.");
      return;
    }
    if (step === 4 && paymentMethod.trim() === "") {
      toast.warning("Please select a payment method.");
      return;
    }
    setStep(step + 1);
  };

  const previousStep = () => setStep(step - 1);

  const confirmOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !name || !phone || !address) {
        toast.warning("Please fill in all delivery details");
        return;
      }

      const orderData = {
        items: [
          {
            productId: selectedProduct._id,
            name: selectedProduct.name,
            price: selectedProduct.price,
            quantity: 1,
            image: selectedProduct.image,
          },
        ],
        totalAmount: selectedProduct.price,
        name: name,
        phone: phone,
        address: address,
      };

      const response = await axios.post(
        "http://localhost:5001/api/orders",
        orderData,
        {
          headers: { Authorization: token },
        }
      );

      if (response.data?.order) {
        setOrderPlaced(true);
        setTimeout(() => {
          setShowCheckout(false);
          navigate("/profile");
        }, 2000);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error(
        error.response?.data?.error ||
          "Failed to place order. Please try again."
      );
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) {
      toast.warning("Please enter your review.");
      return;
    }
    setReviewSubmitting(true);
    try {
      let token = localStorage.getItem("token");
      if (!token) {
        toast.warning("Please login to submit a review.");
        setReviewSubmitting(false);
        return;
      }
      if (!token.startsWith("Bearer ")) {
        token = `Bearer ${token}`;
      }
      if (!detailsProduct?._id || !isValidObjectId(detailsProduct._id)) {
        toast.warning("Invalid product for review.");
        setReviewSubmitting(false);
        return;
      }
      await axios.post(
        "http://localhost:5001/api/reviews",
        {
          productId: detailsProduct._id,
          review: reviewText,
          rating: reviewRating,
        },
        { headers: { Authorization: token } }
      );
      setReviewText("");
      setReviewRating(5);
      const res = await axios.get(`http://localhost:5001/api/reviews/${detailsProduct._id}`);
      setReviews(res.data.reviews || []);
    } catch (err) {
      toast.error("Failed to submit review.");
      console.error("Review submit error:", err);
    }
    setReviewSubmitting(false);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h5 className="mb-4">Review Your Order</h5>
              <ListGroup variant="flush">
                <ListGroup.Item className="py-3">
                  <div className="d-flex align-items-center">
                    <img 
                      src={selectedProduct?.image} 
                      alt={selectedProduct?.name} 
                      style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                      className="rounded"
                    />
                    <div className="ms-3 flex-grow-1">
                      <h6 className="mb-1">{selectedProduct?.name}</h6>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <small className="text-muted">Qty: 1</small>
                          <Badge bg="success" className="ms-2">₹{selectedProduct?.price}</Badge>
                        </div>
                        <div>
                          <Badge bg="warning" text="dark">₹{selectedProduct?.price}</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item className="bg-light">
                  <div className="d-flex justify-content-between align-items-center">
                    <h6 className="mb-0">Total Amount:</h6>
                    <h5 className="mb-0 text-success">₹{selectedProduct?.price}</h5>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        );

      case 2:
        return (
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h5 className="mb-4">Delivery Address</h5>
              <Form>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your full name"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter your phone number"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>Address Line 1</Form.Label>
                  <Form.Control
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House/Flat No., Street Name"
                  />
                </Form.Group>
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>City</Form.Label>
                      <Form.Control type="text" placeholder="City" />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>State</Form.Label>
                      <Form.Control type="text" placeholder="State" />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>PIN Code</Form.Label>
                      <Form.Control type="text" placeholder="PIN Code" />
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        );

      case 3:
        return (
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h5 className="mb-4">Select Payment Method</h5>
              <ListGroup variant="flush">
                {['UPI', 'Credit/Debit Card', 'Net Banking', 'Cash on Delivery'].map((method) => (
                  <ListGroup.Item key={method} className="py-3">
                    <Form.Check
                      type="radio"
                      id={method}
                      name="paymentMethod"
                      label={method}
                      checked={paymentMethod === method}
                      onChange={() => setPaymentMethod(method)}
                      className="d-flex align-items-center gap-3"
                    />
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        );

      case 4:
        return (
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h5 className="mb-4">Order Summary</h5>
              <ListGroup variant="flush">
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                  <span>Items Total</span>
                  <span>₹{selectedProduct?.price}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                  <span>Delivery Charges</span>
                  <Badge bg="success">FREE</Badge>
                </ListGroup.Item>
                <ListGroup.Item className="bg-light">
                  <div className="d-flex justify-content-between align-items-center">
                    <h6 className="mb-0">Total Amount</h6>
                    <h5 className="mb-0 text-success">₹{selectedProduct?.price}</h5>
                  </div>
                </ListGroup.Item>
              </ListGroup>

              <div className="mt-4">
                <h6>Delivery Address:</h6>
                <p className="mb-0">{name}</p>
                <p className="mb-0">{address}</p>
                <p className="mb-0">Phone: {phone}</p>
              </div>

              <div className="mt-4">
                <h6>Payment Method:</h6>
                <p className="mb-0">{paymentMethod}</p>
              </div>
            </Card.Body>
          </Card>
        );

      default:
        return null;
    }
  };
  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
        <Spinner
          animation="border"
          variant="primary"
          className="loading-spinner"
        />
      </div>
    );
  if (error)
    return (
      <Container className="mt-5 pt-5">
        <Alert variant="danger" className="text-center p-4 shadow-sm">
          <Alert.Heading>Oh snap! Something went wrong.</Alert.Heading>
          <p>{error}</p>
        </Alert>
      </Container>
    );

  return (
    <Container fluid className="mt-5 pt-5 px-4">
      <ToastContainer position="top-right" autoClose={3000} style={{ paddingTop: 80 }} />
      
      <div className="kitchen-header d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-2">Kitchen Collection</h2>
          <p className="text-muted mb-0">Explore our premium kitchen essentials.</p>
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
                placeholder="Search kitchen items..."
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
          <p>No kitchen products found. Try adjusting your filter.</p>
          <Button variant="outline-primary" onClick={() => {
            setSearchQuery("");
            setPriceRange([0, 10000]);
            setSortOption("");
          }}>
            Clear Filters
          </Button>
        </div>
      )}      
      <Modal show={showDetailsModal} onHide={closeDetailsModal} size="lg" centered className="product-modal">
        <Modal.Header closeButton>
          <Modal.Title>Product Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {detailsProduct && (
            <Row>
              <Col md={6} className="mb-4 mb-md-0">
                <div className="product-image-container">
                  {detailsProduct.discount && (
                    <Badge bg="danger" className="discount-tag">
                      {detailsProduct.discount}% OFF
                    </Badge>
                  )}
                  <img
                    src={
                      detailsProduct.image?.startsWith("data:image")
                        ? detailsProduct.image
                        : `data:image/jpeg;base64,${detailsProduct.image}`
                    }
                    alt={detailsProduct.name}
                    className="product-detail-img"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/400?text=No+Image";
                    }}
                  />
                  <div className="product-thumbnails">
                    <div className="thumbnail active">
                      <img
                        src={
                          detailsProduct.image?.startsWith("data:image")
                            ? detailsProduct.image
                            : `data:image/jpeg;base64,${detailsProduct.image}`
                        }
                        alt="Main view"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/80?text=Image";
                        }}
                      />
                    </div>
                    {[1, 2, 3].map((_, idx) => (
                      <div key={idx} className="thumbnail">
                        <img
                          src={`https://via.placeholder.com/80?text=View+${idx + 1}`}
                          alt={`View ${idx + 1}`}
                        />
                      </div>
                    ))}
                  </div>
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
                  <p>{detailsProduct.description || detailsProduct.details || "Premium quality kitchen essential designed for everyday use. Elevate your cooking experience with this elegant and functional product."}</p>
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
                      onClick={() => {
                        // Handle decrement
                      }}
                    >
                      -
                    </Button>
                    <input
                      type="number"
                      className="quantity-input"
                      value={1}
                      readOnly
                    />
                    <Button 
                      variant="outline-secondary" 
                      size="sm" 
                      className="quantity-btn"
                      onClick={() => {
                        // Handle increment
                      }}
                    >
                      +
                    </Button>
                  </div>
                </div>
                
                <div className="action-buttons">
                  <Button
                    variant="outline-primary"
                    className="btn-add-cart w-100"
                    onClick={() => handleAddToCart(detailsProduct)}
                  >
                    <CartPlus size={18} className="me-2" /> Add to Cart
                  </Button>
                  <Button
                    variant="primary"
                    className="btn-buy-now w-100"
                    onClick={() => {
                      closeDetailsModal();
                      handleBuyNow(detailsProduct);
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
                              {isAuthenticated && user && rev.userId?._id === user.id
                                ? "You"
                                : rev.userId?.name || "User"}
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
              <p className="text-muted mb-4">Thank you for shopping with us!</p>
              <Button
                variant="outline-primary"
                onClick={() => window.location.href = "/kitchen"}
              >
                Continue Shopping
              </Button>
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
              <Button variant="outline-secondary" onClick={previousStep}>
                Back
              </Button>
            )}
            {step < 4 ? (
              <Button variant="warning" onClick={nextStep}>
                Continue <ArrowRight size={20} />
              </Button>
            ) : (
              <Button variant="success" onClick={confirmOrder}>
                Place Order <Truck className="ms-2" />
              </Button>
            )}
          </Modal.Footer>
        )}
      </Modal>
    </Container>
  );
};

export default Kitchen;
