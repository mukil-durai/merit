import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../components/Cartcontext";
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
} from "react-bootstrap";
import { Heart, HeartFill, CartPlus } from "react-bootstrap-icons";
import "bootstrap/dist/css/bootstrap.min.css";

const living = () => {
  const [livingProducts, setlivingProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [wishlist, setWishlist] = useState([]);

  const { cartItems, addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchlivingProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/products", {
          params: { category: "Living" },
        });
        setlivingProducts(response.data);
        setFilteredProducts(response.data);
      } catch (err) {
        setError("Failed to fetch living products");
      } finally {
        setLoading(false);
      }
    };

    fetchlivingProducts();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProducts(livingProducts);
    } else {
      const filtered = livingProducts.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, livingProducts]);

  const handleSearch = (e) => setSearchQuery(e.target.value);

  const handleWishlistToggle = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleAddToCart = (product) => {
    let imageData = product.image;
    if (
      imageData &&
      !imageData.startsWith("data:image") &&
      !imageData.startsWith("http")
    ) {
      imageData = `data:image/jpeg;base64,${imageData}`;
    }

    const cartItem = {
      ...product,
      image: imageData,
      quantity: 1,
    };

    addToCart(cartItem, navigate);
  };

  if (loading)
    return (
      <Spinner
        animation="border"
        variant="primary"
        className="d-block mx-auto my-5"
      />
    );
  if (error)
    return <Alert variant="danger" className="text-center">{error}</Alert>;

  return (
    <Container className="mt-5 pt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>living Products</h2>
        <Button variant="dark" onClick={() => navigate("/cart")}>
          Cart <Badge bg="danger">{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</Badge>
        </Button>
      </div>

      <InputGroup className="mb-4">
        <Form.Control
          type="text"
          placeholder="Search living items..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </InputGroup>

      <Row>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Col key={product._id} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <div className="position-relative">
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
                  {product.discount && (
                    <Badge
                      bg="danger"
                      className="position-absolute top-0 end-0 m-2"
                    >
                      {product.discount}% OFF
                    </Badge>
                  )}
                  <Button
                    className="position-absolute top-0 start-0 m-2"
                    variant="light"
                    onClick={() => handleWishlistToggle(product._id)}
                  >
                    {wishlist.includes(product._id) ? (
                      <HeartFill color="red" />
                    ) : (
                      <Heart />
                    )}
                  </Button>
                </div>
                <Card.Body className="d-flex flex-column">
                  <Card.Title
                    className="fw-semibold mb-2"
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {product.name}
                  </Card.Title>
                  <Card.Text className="mb-3">
                    {product.oldPrice && (
                      <span className="text-muted text-decoration-line-through me-2">
                        ₹{product.oldPrice}
                      </span>
                    )}
                    <span className="fw-bold text-success">₹{product.price}</span>
                  </Card.Text>
                  <div className="mt-auto">
                    <Button
                      variant="warning"
                      className="w-100"
                      onClick={() => handleAddToCart(product)}
                    >
                      <CartPlus /> Add to Cart
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col className="text-center">
            <p>No living products found.</p>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default living;
