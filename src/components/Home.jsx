import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEye, FaBullseye } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="pt-5 mt-5">
      <Container fluid className="p-0">
        {/* Hero Section with Video */}
        <div className="position-relative">
          <video 
            autoPlay
            muted
            loop
            className="w-100"
            style={{ maxHeight: '70vh', objectFit: 'cover' }}
          >
            <source src="/assets/Knit-Fabric.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
               style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
            <div className="text-center text-white p-3">
              <h1 className="display-4 fw-bold">Merit Creators</h1>
              <p className="lead fs-4">Quality Textile Products for Your Home</p>
            </div>
          </div>
        </div>

        {/* Enhanced Vision & Mission Section with better mobile text visibility */}
        <Container className="py-5">
          <Row className="mb-4 justify-content-center text-center">
            <Col xs={12}>
              <h2 className="display-5 fw-bold mb-3">Our Vision & Mission</h2>
              <div className="border-bottom border-warning mb-4 mx-auto" style={{ width: '100px', height: '4px' }}></div>
            </Col>
          </Row>
          
          <Row className="g-4">
            <Col lg={6} md={6} xs={12} className="mb-4">
              <Card className="h-100 shadow-lg border-0" style={{ backgroundColor: "#fff8e1" }}>
                <Card.Body className="p-4 p-sm-5">
                  <div className="text-center mb-4">
                    <div className="bg-warning p-3 rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '70px', height: '70px' }}>
                      <FaEye size={32} />
                    </div>
                  </div>
                  <Card.Title className="text-center fw-bold fs-2 mb-4" style={{ color: "#000" }}>Our Vision</Card.Title>
                  <Card.Text 
                    className="fs-5 fw-medium text-dark lh-lg px-2 px-sm-3" 
                    style={{ 
                      fontSize: '1.2rem !important',
                      color: '#000000 !important', 
                      fontWeight: '500 !important' 
                    }}
                  >
                    To become the leading textile manufacturing company, recognized for our commitment to quality, 
                    innovation, and sustainable practices. We strive to enhance the lives of our customers through 
                    exceptional textile products.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            
            <Col lg={6} md={6} xs={12} className="mb-4">
              <Card className="h-100 shadow-lg border-0" style={{ backgroundColor: "#fff8e1" }}>
                <Card.Body className="p-4 p-sm-5">
                  <div className="text-center mb-4">
                    <div className="bg-warning p-3 rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '70px', height: '70px' }}>
                      <FaBullseye size={32} />
                    </div>
                  </div>
                  <Card.Title className="text-center fw-bold fs-2 mb-4" style={{ color: "#000" }}>Our Mission</Card.Title>
                  <Card.Text 
                    className="fs-5 fw-medium text-dark lh-lg px-2 px-sm-3" 
                    style={{ 
                      fontSize: '1.2rem !important',
                      color: '#000000 !important', 
                      fontWeight: '500 !important' 
                    }}
                  >
                    To provide high-quality textile products while maintaining ethical business practices, 
                    supporting our local community, and ensuring customer satisfaction through innovative design 
                    and excellent craftsmanship.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>

        {/* You can add more sections here */}
      </Container>
    </div>
  );
};

export default Home;