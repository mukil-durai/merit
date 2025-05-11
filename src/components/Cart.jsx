import React, { useState, useContext } from "react";
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

// ✅ Helper function for image handling:
const getImageSrc = (image) => {
  if (!image) return "https://via.placeholder.com/250";
  if (image?.startsWith("data:image") || image?.startsWith("http")) return image;
  return `data:image/jpeg;base64,${image}`;
};

// New checkout step components
const CheckoutProgressBar = ({ currentStep }) => {
  const steps = [
    { title: 'Cart', icon: <BagCheck /> },
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

const Cart = () => {
  const { cartItems, setCartItems, updateCartCount } = useContext(CartContext);
  const { isAuthenticated, user } = useContext(AuthContext);
  const [showCheckout, setShowCheckout] = useState(false);
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);

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

  const handleCheckout = () => {
    if (!isAuthenticated) {
      alert("Please login to proceed!");
      return;
    }
    setShowCheckout(true);
    setStep(1);
    setOrderPlaced(false);
  };

  const nextStep = () => {
    if (step === 2 && address.trim() === "") {
      alert("Please enter delivery address.");
      return;
    }
    if (step === 3 && (name.trim() === "" || phone.trim() === "")) {
      alert("Please enter your name and phone number.");
      return;
    }
    if (step === 4 && paymentMethod.trim() === "") {
      alert("Please select a payment method.");
      return;
    }
    setStep(step + 1);
  };

  const previousStep = () => setStep(step - 1);

  const confirmOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token || !name || !phone || !address) {
        alert('Please fill in all delivery details');
        return;
      }

      const orderData = {
        items: cartItems.map(item => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        totalAmount: calculateTotal(),
        // Add delivery details
        name: name,
        phone: phone,
        address: address
      };

      const response = await axios.post('http://localhost:5001/api/orders', orderData, {
        headers: {
          Authorization: token
        }
      });

      if (response.data?.order) {
        setOrderPlaced(true);
        if (isAuthenticated && user) {
          localStorage.removeItem(`cart_${user.id}`);
        }
        setCartItems([]);
        updateCartCount();
        
        setTimeout(() => {
          setShowCheckout(false);
          navigate('/profile'); // Redirect to profile page
        }, 2000);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert(error.response?.data?.error || 'Failed to place order. Please try again.');
    }
  };

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
                  <span>₹{calculateTotal()}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between align-items-center">
                  <span>Delivery Charges</span>
                  <Badge bg="success">FREE</Badge>
                </ListGroup.Item>
                <ListGroup.Item className="bg-light">
                  <div className="d-flex justify-content-between align-items-center">
                    <h6 className="mb-0">Total Amount</h6>
                    <h5 className="mb-0 text-success">₹{calculateTotal()}</h5>
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

export default Cart;
