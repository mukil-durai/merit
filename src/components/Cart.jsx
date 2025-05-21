import React, { useState, useContext, useEffect } from "react";
import { CartContext } from "../components/Cartcontext";
import { AuthContext } from "../pages/AuthContext";
import { useNavigate } from 'react-router-dom'; 
import './Cart.css';
import {
  Button,
  Container,
  Row,
  Col,
  Card,
  Alert,
  ListGroup,
  Form,
  Modal,
  Badge,
  InputGroup,
  Spinner
} from "react-bootstrap";
import { 
  Trash,
  GeoAlt,
  CreditCard2Front,
  BagCheck,
  Truck,
  CheckCircle,
  ArrowRightCircle,
  CurrencyDollar,
  ShieldLock,
  ArrowRight
} from "react-bootstrap-icons";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE_URL = "http://localhost:5001"; // Update base URL to match backend server

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

// ✅ Helper function for image handling:
const getImageSrc = (image) => {
  if (!image) return "https://via.placeholder.com/250";
  if (image?.startsWith("data:image") || image?.startsWith("http")) return image;
  return `data:image/jpeg;base64,${image}`;
};

// Replace the CheckoutProgressBar component with the improved version
const CheckoutProgressBar = ({ currentStep }) => {
  const steps = [
    { title: 'Cart', icon: <BagCheck /> },
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

const Cart = () => {
  const { cartItems, clearCart, updateCartCount, removeFromCart, updateCartItemQuantity } = useContext(CartContext);
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();
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
  const [paymentMethod, setPaymentMethod] = useState("online"); // "online" or "cod" (Cash on Delivery)
  const [paymentInProgress, setPaymentInProgress] = useState(false);

  useEffect(() => {
    // When state changes, update the available cities
    if (state) {
      setCityOptions(statesWithCities[state] || []);
      setCity(""); // Reset city when state changes
    } else {
      setCityOptions([]);
    }
  }, [state]);

  const calculateTotal = () =>
    cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleRemoveFromCart = (index) => {
    // Use the context function to remove item
    removeFromCart(index);
  };

  const handleQuantityChange = (index, newQuantity) => {
    // Use the context function to update quantity
    updateCartItemQuantity(index, newQuantity);
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
          items: cartItems.map(item => ({
            productId: item._id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
          totalAmount: calculateTotal(),
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
        clearCart();
        updateCartCount();
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
      
      const amount = calculateTotal();
      
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
        description: "Cart Payment",
        handler: async function (paymentResponse) {
          try {
            const token = localStorage.getItem("token");
            if (!token) {
              toast.error("You are not logged in. Please log in to place an order.");
              return;
            }

            const orderData = {
              items: cartItems.map(item => ({
                productId: item._id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image,
              })),
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
            clearCart();
            updateCartCount();
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

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.warning("Please login to proceed!");
      return;
    }
    setShowCheckout(true);
    setStep(1);
    
    // Initialize with user data if available
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
    setPaymentMethod("online");
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

  const handleNavigateToKitchen = () => {
    navigate('/catlog/kitchen');
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <Card className="border-0 shadow-sm checkout-card">
            <Card.Body className="p-4">
              <div className="d-flex align-items-center mb-4">
                <div className="step-icon-large bg-primary text-white">1</div>
                <h5 className="mb-0 ms-3">Review Your Cart</h5>
              </div>
              
              <ListGroup variant="flush">
                {cartItems.map((item, index) => (
                  <ListGroup.Item key={index} className="py-3">
                    <div className="d-flex align-items-center">
                      <div className="position-relative checkout-product-img-container">
                        <img 
                          src={getImageSrc(item.image)} 
                          alt={item.name} 
                          className="checkout-product-img"
                          style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                        />
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="ms-3 flex-grow-1">
                        <h6 className="mb-1 product-name">{item.name}</h6>
                        <div className="d-flex justify-content-between align-items-center">
                          <Badge bg="light" text="dark" className="border">
                            Unit Price: ₹{item.price}
                          </Badge>
                          <Badge bg="warning" text="dark">
                            Total: ₹{item.price * item.quantity}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              
              <div className="price-summary mt-3">
                <div className="d-flex justify-content-between py-2">
                  <span>Subtotal</span>
                  <span>₹{calculateTotal()}</span>
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
                  <span className="total-price">₹{calculateTotal()}</span>
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
                <ListGroup variant="flush">
                  {cartItems.map((item, index) => (
                    <ListGroup.Item key={index} className="bg-light border-0 py-2">
                      <div className="d-flex align-items-center">
                        <img 
                          src={getImageSrc(item.image)} 
                          alt={item.name} 
                          width="40" 
                          height="40" 
                          className="rounded"
                          style={{ objectFit: "cover" }}
                        />
                        <div className="ms-3 flex-grow-1">
                          <div className="d-flex justify-content-between">
                            <h6 className="mb-0">{item.name}</h6>
                            <span>₹{item.price * item.quantity}</span>
                          </div>
                          <small className="text-muted">
                            {item.quantity} x ₹{item.price}
                          </small>
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
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
                  <span>₹{calculateTotal()}</span>
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
                  <span className="total-price">₹{calculateTotal()}</span>
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
                      <div className="amount">₹{calculateTotal()}</div>
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
                  <div className="d-flex justify-content-between mb-3">
                    <span>Items:</span>
                    <span>{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</span>
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
      /* Checkout Progress Bar Styles */
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
      
      /* New styles for enhanced checkout */
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
        width: 60px;
        height: 60px;
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
      
      .order-details-section {
        margin-bottom: 20px;
        background-color: #f8f9fa;
        padding: 15px;
        border-radius: 8px;
      }
      
      .section-title {
        border-bottom: 1px solid #dee2e6;
        padding-bottom: 8px;
        margin-bottom: 12px;
        color: #495057;
      }
      
      .detail-item {
        display: flex;
        margin-bottom: 8px;
      }
      
      .detail-label {
        font-weight: 500;
        width: 80px;
        color: #6c757d;
      }
      
      .detail-value {
        flex: 1;
      }
      
      .shipping-address {
        color: #495057;
      }
      
      .payment-method-option {
        padding: 10px;
        border: 1px solid #dee2e6;
        border-radius: 8px;
        margin-bottom: 10px;
        cursor: pointer;
      }
      
      .payment-method-option:hover {
        background-color: #f8f9fa;
      }
      
      .payment-method-card {
        display: flex;
        align-items: center;
        padding: 15px;
        border-radius: 8px;
        border: 1px solid #dee2e6;
      }
      
      .payment-method-card.online {
        background-color: #e8f4ff;
        border-color: #b8daff;
      }
      
      .payment-method-card.cod {
        background-color: #fff8e1;
        border-color: #ffe0b2;
      }
      
      .payment-method-icon {
        width: 50px;
        height: 50px;
        background-color: #0d6efd;
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        margin-right: 15px;
      }
      
      .payment-method-icon.cod {
        background-color: #ff9800;
      }
      
      .payment-method-details {
        flex: 1;
      }
      
      .total-amount-circle {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background-color: #198754;
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 auto;
        box-shadow: 0 5px 15px rgba(25, 135, 84, 0.3);
      }
      
      .amount {
        font-size: 1.5rem;
        font-weight: bold;
      }
      
      .order-summary-container {
        border-left: 4px solid #6c757d;
      }
      
      .security-info {
        color: #28a745;
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
    <Container className="mt-5 pt-4">
      <ToastContainer position="top-right" autoClose={3000} style={{ paddingTop: 80 }} />
      <h1 className="text-center mb-4">Your Shopping Cart 🛒</h1>

      {cartItems.length === 0 ? (
        <Alert variant="info" className="text-center py-5">
          <div className="mb-3">
            <BagCheck size={50} className="text-info opacity-75" />
          </div>
          <h4>Your cart is empty</h4>
          <p className="text-muted mb-4">Add some items to your cart and start shopping!</p>
          <Button 
            variant="warning" 
            size="lg" 
            className="px-4" 
            onClick={handleNavigateToKitchen}
          >
            Start Shopping <ArrowRight className="ms-2" />
          </Button>
        </Alert>
      ) : (
        <>
          <Row>
            {cartItems.map((item, index) => (
              <Col md={6} lg={4} key={index} className="mb-4">
                <Card className="shadow-sm border-0">
                  <Card.Img
                    variant="top"
                    src={getImageSrc(item.image)}
                    style={{ height: "250px", objectFit: "cover" }}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/250";
                    }}
                  />
                  <Card.Body>
                    <Card.Title className="text-center">{item.name}</Card.Title>
                    <ListGroup variant="flush" className="my-2">
                      <ListGroup.Item>
                        <strong>Price: </strong>Rs {item.price}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <strong>Quantity: </strong>
                        <Form.Select
                          className="w-50 d-inline ms-2"
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(index, parseInt(e.target.value))
                          }
                        >
                          {[...Array(10)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1}
                            </option>
                          ))}
                        </Form.Select>
                      </ListGroup.Item>
                    </ListGroup>
                    <div className="text-center">
                      <Button
                        variant="outline-danger"
                        onClick={() => handleRemoveFromCart(index)}
                      >
                        <Trash /> Remove
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          <div
            className="position-sticky bottom-0 start-0 end-0 p-4 bg-white shadow-lg d-flex justify-content-between align-items-center mt-4 rounded"
            style={{ zIndex: 10 }}
          >
            <h4 className="mb-0">
              Total:{" "}
              <span className="text-success fw-bold">Rs {calculateTotal()}</span>
            </h4>
            <Button variant="success" size="lg" onClick={handleCheckout}>
              Proceed to Checkout
            </Button>
          </div>
        </>
      )}

      {/* Enhanced Checkout Modal */}
      <Modal show={showCheckout} onHide={() => setShowCheckout(false)} size="lg">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="text-primary">Checkout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {orderPlaced ? (
            <div className="text-center py-5">
              <CheckCircle size={60} className="text-success mb-3" />
              <h4 className="text-success mb-3">Order Placed Successfully!</h4>
              <p className="mb-1">Order ID: #{Math.random().toString(36).substr(2, 9)}</p>
              <p className="text-muted mb-4">
                {paymentMethod === "cod" 
                  ? "Thank you for shopping with us! Your cash on delivery order has been confirmed." 
                  : "Thank you for shopping with us! Your payment has been received."}
              </p>
              <div className="d-flex justify-content-center gap-3">
                <Button
                  variant="outline-primary"
                  onClick={handleNavigateToKitchen}
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

export default Cart;
