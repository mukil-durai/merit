import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CartContext } from "./Cartcontext";
import { AuthContext } from "../pages/AuthContext";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
  Badge
} from "react-bootstrap";
import {
  Heart,
  HeartFill,
  CartPlus,
  Trash,
  ExclamationCircle,
  StarFill,
  Star,
  BagCheck
} from "react-bootstrap-icons";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE_URL = "http://localhost:5001";

// Helper function for image handling
const getImageSrc = (image) => {
  if (!image) return "https://via.placeholder.com/250";
  if (image?.startsWith("data:image") || image?.startsWith("http")) return image;
  return `data:image/jpeg;base64,${image}`;
};

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, [isAuthenticated]);

  const fetchWishlist = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      setError("Please login to view your wishlist");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found");
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/api/wishlist`, {
        headers: { Authorization: token }
      });

      // Get detailed product info for each wishlist item
      const wishlistProductsResponse = await Promise.all(
        response.data.wishlist.map(async (item) => {
          try {
            const productId = typeof item === 'object' ? item._id : item;
            const productResponse = await axios.get(`http://localhost:5000/api/products/${productId}`);
            
            // Get ratings from reviews
            let rating = 0;
            let reviewCount = 0;
            
            try {
              const reviewsResponse = await axios.get(`${API_BASE_URL}/api/reviews/${productId}`);
              const reviews = reviewsResponse.data.reviews || [];
              reviewCount = reviews.length;
              
              if (reviews.length > 0) {
                rating = Math.round(
                  reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
                );
              }
            } catch (error) {
              console.warn(`Couldn't fetch reviews for product ${productId}`);
            }
            
            return {
              ...productResponse.data,
              _id: productId,
              rating,
              reviews: reviewCount
            };
          } catch (err) {
            console.error(`Error fetching product ${item}:`, err);
            return null;
          }
        })
      );

      // Filter out any null results
      const validProducts = wishlistProductsResponse.filter(item => item !== null);
      setWishlistItems(validProducts);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching wishlist:", err);
      setError("Failed to load wishlist. Please try again later.");
      setLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication required");
        return;
      }

      await axios.post(
        `${API_BASE_URL}/api/wishlist`,
        { productId, action: "remove" },
        { headers: { Authorization: token } }
      );

      setWishlistItems(prevItems => prevItems.filter(item => item._id !== productId));
      toast.success("Item removed from wishlist");
    } catch (err) {
      console.error("Error removing from wishlist:", err);
      toast.error("Failed to remove item from wishlist");
    }
  };

  const handleAddToCart = (product) => {
    try {
      addToCart(product);
      toast.success("Added to cart successfully!");
    } catch (error) {
      toast.error("Failed to add item to cart");
      console.error("Error adding to cart:", error);
    }
  };

  const handleBuyNow = (product) => {
    if (!isAuthenticated) {
      toast.warning("Please login to proceed!");
      return;
    }
    
    try {
      addToCart(product);
      navigate("/cart");
    } catch (error) {
      toast.error("Failed to process. Please try again.");
      console.error("Error in buy now flow:", error);
    }
  };

  if (!isAuthenticated) {
    return (
      <Container className="mt-5 pt-5">
        <Alert variant="warning" className="text-center py-5">
          <ExclamationCircle size={50} className="text-warning mb-3" />
          <h4>Please Sign In</h4>
          <p className="mb-4">You need to be logged in to view your wishlist</p>
          <Button variant="warning" onClick={() => navigate("/signin")}>
            Sign In
          </Button>
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container className="mt-5 pt-5 text-center">
        <Spinner animation="border" variant="warning" />
        <p className="mt-3">Loading your wishlist...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5 pt-5">
        <Alert variant="danger">
          <ExclamationCircle className="me-2" />
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5 pt-5">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">
          <HeartFill className="text-danger me-2" />
          My Wishlist
        </h2>
        
        <Button 
          variant="outline-primary" 
          onClick={() => navigate("/catlog/kitchen")}
        >
          Continue Shopping
        </Button>
      </div>

      {wishlistItems.length === 0 ? (
        <Alert variant="info" className="text-center py-5">
          <Heart size={50} className="text-info mb-3" />
          <h4>Your wishlist is empty</h4>
          <p className="mb-4">Save items you like to your wishlist and find them all in one place!</p>
          <Button 
            variant="warning" 
            onClick={() => navigate("/catlog/kitchen")}
          >
            Browse Products
          </Button>
        </Alert>
      ) : (
        <Row>
          {wishlistItems.map((product) => (
            <Col key={product._id} md={4} lg={3} className="mb-4">
              <Card className="h-100 shadow-sm border-0 product-card">
                <div className="position-relative">
                  <Card.Img
                    variant="top"
                    src={getImageSrc(product.image)}
                    style={{ height: "200px", objectFit: "cover" }}
                    onClick={() => navigate(`/product/${product._id}`)}
                    className="cursor-pointer"
                  />
                  <Button
                    variant="danger"
                    size="sm"
                    className="position-absolute top-0 end-0 m-2 rounded-circle p-2"
                    onClick={() => handleRemoveFromWishlist(product._id)}
                  >
                    <Trash size={16} />
                  </Button>
                  
                  {product.discount && (
                    <Badge
                      bg="danger"
                      className="position-absolute top-0 start-0 m-2"
                    >
                      {product.discount}% OFF
                    </Badge>
                  )}
                </div>
                
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="h6">{product.name}</Card.Title>
                  
                  <div className="d-flex align-items-center mb-2">
                    <div className="text-warning me-2">
                      {Array(5).fill().map((_, i) => (
                        <span key={i}>
                          {i < (product.rating || 0) ? (
                            <StarFill size={14} />
                          ) : (
                            <Star size={14} />
                          )}
                        </span>
                      ))}
                    </div>
                    <small className="text-muted">
                      {product.reviews || 0} {product.reviews === 1 ? "review" : "reviews"}
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
                  
                  <div className="mt-auto d-flex gap-2">
                    <Button
                      variant="outline-primary"
                      className="w-100"
                      onClick={() => handleAddToCart(product)}
                    >
                      <CartPlus className="me-1" /> Add to Cart
                    </Button>
                    <Button
                      variant="primary"
                      className="w-100"
                      onClick={() => handleBuyNow(product)}
                    >
                      Buy Now
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default Wishlist;
