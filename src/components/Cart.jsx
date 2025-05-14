import React, { useState, useContext, useEffect } from "react";
import { CartContext } from "../components/Cartcontext";
import { AuthContext } from "../pages/AuthContext";
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
  ProgressBar,
  Badge
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

const API_BASE_URL = "http://localhost:5001"; // Update base URL to match backend server

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
  const { cartItems, clearCart, updateCartCount } = useContext(CartContext);
  const { isAuthenticated, user } = useContext(AuthContext);
  const [showCheckout, setShowCheckout] = useState(false);
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);

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

  const calculateTotal = () =>
    cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleRemoveFromCart = (index) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    setCartItems(updatedCart);
    if (isAuthenticated && user) {
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(updatedCart));
    }
    updateCartCount();
  };

  const handleQuantityChange = (index, newQuantity) => {
    const updatedCart = cartItems.map((item, i) =>
      i === index ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    if (isAuthenticated && user) {
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(updatedCart));
    }
    updateCartCount();
  };

  const handleRazorpayPayment = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/create-order`, {
        amount: calculateTotal() * 100, // Convert to paise
      });

      const { orderId, key, amount, currency } = response.data;

      const options = {
        key, // Razorpay API Key
        amount, // Amount in paise
        currency,
        order_id: orderId,
        name: "Your Company Name",
        description: "Cart Payment",
        handler: async function (paymentResponse) {
          alert("Payment Successful!");
          // Store the order in the backend
          try {
            const token = localStorage.getItem("token"); // Retrieve token from localStorage
            if (!token) {
              alert("You are not logged in. Please log in to place an order.");
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
              paymentId: paymentResponse.razorpay_payment_id,
            };

            await axios.post(`${API_BASE_URL}/api/store-order`, orderData, {
              headers: {
                Authorization: token, // Pass the token in the Authorization header
              },
            });
            alert("Order Stored Successfully!");

            // Clear cart items using clearCart function
            clearCart();
            updateCartCount();

            // Set orderPlaced to true to show the success message
            setOrderPlaced(true);
          } catch (error) {
            console.error("Error storing order:", error.response || error);
            alert(error.response?.data?.error || "Failed to store order. Please contact support.");
          }
        },
        prefill: {
          name: user?.name || "Customer Name",
          email: user?.email || "customer@example.com",
          contact: phone || "9999999999",
        },
      };

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        const rzp = new window.Razorpay(options);
        rzp.open();
      };
      script.onerror = () => {
        alert("Failed to load Razorpay. Please try again.");
      };
      document.body.appendChild(script);
    } catch (error) {
      console.error("Error initiating Razorpay payment:", error.response || error);
      alert("Failed to initiate payment. Please check the backend API.");
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      alert("Please login to proceed!");
      return;
    }
    setShowCheckout(true);
  };

  const nextStep = () => {
    if (step === 2) {
      if (address.trim() === "") {
        alert("Please enter delivery address.");
        return;
      }
      if (name.trim() === "") {
        alert("Please enter your full name.");
        return;
      }
      if (phone.trim() === "" || !/^\d{10}$/.test(phone)) {
        alert("Please enter a valid 10-digit phone number.");
        return;
      }
    }
    if (step === 4) {
      handleRazorpayPayment(); // Trigger Razorpay payment
      return; // Wait for Razorpay to complete before proceeding
    }
    setStep(step + 1);
  };

  const previousStep = () => setStep(step - 1);

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h5 className="mb-4">Review Your Cart</h5>
              <ListGroup variant="flush">
                {cartItems.map((item, index) => (
                  <ListGroup.Item key={index} className="py-3">
                    <div className="d-flex align-items-center">
                      <img 
                        src={getImageSrc(item.image)} 
                        alt={item.name} 
                        style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                        className="rounded"
                      />
                      <div className="ms-3 flex-grow-1">
                        <h6 className="mb-1">{item.name}</h6>
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <small className="text-muted">Qty: {item.quantity}</small>
                            <Badge bg="success" className="ms-2">₹{item.price}</Badge>
                          </div>
                          <div>
                            <Badge bg="warning" text="dark">₹{item.price * item.quantity}</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}
                <ListGroup.Item className="bg-light">
                  <div className="d-flex justify-content-between align-items-center">
                    <h6 className="mb-0">Total Amount:</h6>
                    <h5 className="mb-0 text-success">₹{calculateTotal()}</h5>
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
              <h5 className="mb-4">Confirm Your Details</h5>
              <p><strong>Name:</strong> {name}</p>
              <p><strong>Phone:</strong> {phone}</p>
              <p><strong>Address:</strong> {address}</p>
              <p><strong>Total Amount:</strong> ₹{calculateTotal()}</p>
            </Card.Body>
          </Card>
        );

      case 4:
        return (
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h5 className="mb-4">Proceed to Payment</h5>
              <p>Click "Pay Now" to complete your payment using Razorpay.</p>
            </Card.Body>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <Container className="mt-5 pt-4">
      <h1 className="text-center mb-4">Your Shopping Cart 🛒</h1>

      {cartItems.length === 0 ? (
        <Alert variant="info" className="text-center">
          Your cart is empty. Start shopping!
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
              <p className="text-muted mb-4">Thank you for shopping with us!</p>
              <Button variant="outline-primary" onClick={() => window.location.href = '/kitchen'}>
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
              <Button variant="success" onClick={handleRazorpayPayment}>
                Pay Now <Truck className="ms-2" />
              </Button>
            )}
          </Modal.Footer>
        )}
      </Modal>
    </Container>
  );
};

export default Cart;
