import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Spinner, Alert, Container, Row, Col, Badge } from "react-bootstrap";

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/products`, {
          params: { category: "kitchen", search: productId },
        });
        setProduct(response.data[0]); // Assuming the first match is the product
      } catch (err) {
        setError("Failed to fetch product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  if (loading) {
    return <Spinner animation="border" variant="primary" className="d-block mx-auto my-5" />;
  }

  if (error) {
    return <Alert variant="danger" className="text-center">{error}</Alert>;
  }

  if (!product) {
    return <Alert variant="warning" className="text-center">Product not found</Alert>;
  }

  return (
    <Container className="mt-5 pt-5">
      <Row>
        <Col md={6}>
          <img
            src={
              product.image?.startsWith("data:image")
                ? product.image
                : `data:image/jpeg;base64,${product.image}`
            }
            alt={product.name}
            className="img-fluid rounded"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/400?text=No+Image";
            }}
          />
        </Col>
        <Col md={6}>
          <h2>{product.name}</h2>
          <p>{product.details}</p>
          <h4 className="text-success">₹{product.price}</h4>
          {product.discount && (
            <Badge bg="danger" className="mb-3">
              {product.discount}% OFF
            </Badge>
          )}
          <div className="d-flex gap-3 mt-4">
            <Button variant="warning" onClick={() => navigate("/kitchen")}>
              Back to Kitchen
            </Button>
            <Button variant="primary" onClick={() => alert("Add to Cart functionality here!")}>
              Add to Cart
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetails;
