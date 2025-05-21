import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { 
  FaPencilRuler, FaYarn, FaFillDrip, FaTshirt, FaCut, FaFeatherAlt, 
  FaUsers, FaHandshake, FaStar, FaGlobe, FaCalendarAlt, FaIndustry, 
  FaDollarSign, FaCogs, FaUserTie, FaHandHoldingHeart, FaLeaf, 
  FaShieldAlt, FaArrowRight, FaChevronLeft, FaChevronRight, FaSearch, 
  FaStore, FaMapMarkerAlt, FaEnvelope, FaPhone, FaFacebookF, FaInstagram, 
  FaLinkedinIn, FaTwitter, FaHeadset, FaArrowUp, FaShippingFast, FaPercent,
  FaCreditCard, FaGift, FaTags, FaCheckCircle // Added new icons
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import loaderImg from "../assets/loader.svg";
import kitchenImg from "../assets/kitchen-linen.jpg";
import shoppingBagImg from "../assets/shopping-bags.jpg";
import livingLinenImg from "../assets/living-linen.jpg";
import tableLinenImg from "../assets/table-linen.jpg";
import homeImage from "../assets/home.jpg";
import aboutImage from "../assets/home2.jpg";
import "../css/home.css";

const Home = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [kitchenProducts, setKitchenProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleProductClick = (product) => {
    navigate(`/catlog/${product}`); // Corrected template literal syntax
  };

  useEffect(() => {
    const fetchKitchenProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/api/products", {
          params: { category: "kitchen", limit: 6 }
        });
        setKitchenProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch kitchen products:", error);
        setError("Failed to load products. Please try again later.");
        setLoading(false);
      }
    };
    fetchKitchenProducts();
  }, []);

  const processSteps = [
    { icon: <FaPencilRuler />, title: "Design", description: "Creating unique patterns" },
    { icon: <FaYarn />, title: "Weaving", description: "Quality fabric production" },
    { icon: <FaFillDrip />, title: "Dyeing", description: "Vibrant color infusion" },
    { icon: <FaTshirt />, title: "Printing", description: "Custom patterns and designs" },
    { icon: <FaCut />, title: "Stitching", description: "Precision craftsmanship" },
    { icon: <FaFeatherAlt />, title: "Embroidery", description: "Detailed embellishments" },
  ];

  const stats = [
    { 
      icon: <FaCalendarAlt />, 
      number: "2005", 
      label: "Founded",
      description: "Incorporated and started our journey",
      bgColor: "bg-soft-primary"
    },
    { 
      icon: <FaIndustry />, 
      number: "25,000", 
      label: "Sq.Ft Factory Area",
      description: "State-of-the-art manufacturing facility",
      bgColor: "bg-soft-success"
    },
    { 
      icon: <FaDollarSign />, 
      number: "1.2M", 
      label: "USD Revenue",
      description: "Annual turnover and growing",
      bgColor: "bg-soft-warning"
    },
    { 
      icon: <FaUsers />, 
      number: "100", 
      label: "Employees",
      description: "Skilled and dedicated workforce",
      bgColor: "bg-soft-info"
    },
    { 
      icon: <FaCogs />, 
      number: "100", 
      label: "Sewing Machines",
      description: "Modern equipment for quality production",
      bgColor: "bg-soft-danger"
    }
  ];

  const commitmentPoints = [
    {
      icon: <FaUserTie />,
      title: "Workforce Excellence",
      description: "We provide a safe, positive work environment with competitive benefits and transport facilities for our dedicated team of professionals."
    },
    {
      icon: <FaHandHoldingHeart />,
      title: "Customer Commitment",
      description: "Offering customized solutions, quick response times, and various volume options to meet specific client needs."
    },
    {
      icon: <FaLeaf />,
      title: "Environmental Responsibility",
      description: "Committed to ethical and sustainable practices, using eco-friendly materials and processes."
    },
    {
      icon: <FaShieldAlt />,
      title: "Quality Assurance",
      description: "Rigorous quality control measures ensuring the highest standards in every product."
    }
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Product categories with enhanced descriptions
  const productCategories = [
    { 
      img: kitchenImg, 
      title: "Kitchen Linens", 
      key: "kitchen",
      description: "Functional and stylish kitchen essentials including aprons, oven mitts, and towels"
    },
    { 
      img: shoppingBagImg, 
      title: "Shopping Bags", 
      key: "kitchen",
      description: "Eco-friendly, durable shopping bags in various designs and sizes"
    },
    { 
      img: livingLinenImg, 
      title: "Living Linens", 
      key: "livingLinen",
      description: "Elegant cushion covers, throws, and decorative items for your living space"
    },
    { 
      img: tableLinenImg, 
      title: "Table Linens", 
      key: "tableLinen",
      description: "Beautiful table cloths, runners, and napkins for every occasion"
    },
  ];

  // Marquee announcements for e-commerce
  const announcements = [
    { icon: <FaShippingFast />, text: "Free Shipping on Orders Over ₹999" },
    { icon: <FaPercent />, text: "Season Sale! Up to 40% Off" },
    { icon: <FaCreditCard />, text: "Secure Payment Options Available" },
    { icon: <FaGift />, text: "Free Gift Wrapping on All Orders" },
    { icon: <FaTags />, text: "Bulk Order Discounts for Businesses" },
    { icon: <FaCheckCircle />, text: "100% Quality Assurance" },
  ];

  // Determine video source based on environment
  const videoSrc =
    window.location.hostname === "localhost"
      ? import.meta.env.BASE_URL + "assets/Knit-Fabric.mp4"
      : "https://mukil-durai.github.io/merit/assets/Knit-Fabric.mp4";

  return (
    <>
      {/* Hero Section with Bootstrap Carousel */}
      <div id="heroCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <div className="position-relative text-center text-white d-flex align-items-center justify-content-center" style={{ height: "550px", overflow: "hidden" }}>
              <video
                autoPlay
                loop
                muted
                playsInline
                className="position-absolute w-100 h-100"
                style={{ objectFit: "cover" }}
              >
                <source src={videoSrc} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"></div>
              <div className="position-relative z-1 container">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <h1 className="display-4 fw-bold text-uppercase mb-3">
                    From subtle hues to bold shades, <br /> we can match any color palette
                  </h1>
                  <p className="lead mb-3">Premium textile solutions for home and business</p>
                  <div className="d-flex justify-content-center gap-3">
                    <button 
                      className="btn btn-warning btn-lg px-4 py-2" 
                      onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })}
                    >
                      Explore Products
                    </button>
                    <button 
                      className="btn btn-outline-light btn-lg px-4 py-2"
                      onClick={() => document.getElementById('about').scrollIntoView({ behavior: 'smooth' })}
                    >
                      Learn More
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* E-commerce Marquee Announcements */}
      <div className="bg-dark py-3 position-relative overflow-hidden">
        <div className="marquee-container">
          <div className="marquee-content">
            {[...announcements, ...announcements].map((item, index) => (
              <div key={index} className="d-inline-flex align-items-center mx-4">
                <div className="blinking-icon text-warning me-2">
                  {item.icon}
                </div>
                <span className="text-white">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    

      {/* Updated Featured Kitchen Products - Bootstrap Carousel */}
      <div 
        className="container-fluid px-0 py-6" 
        style={{ 
          background: "linear-gradient(135deg, #fffaf0 0%, #fff2cc 100%)",
          boxShadow: "inset 0 0 50px rgba(255,182,193,0.1)" 
        }}
      >
        <div className="container">
          <div className="text-center mb-5">
            <img src={loaderImg} alt="Cotton Logo" className="mb-2" width="60" height="60" />
            <h5 className="text-warning fw-bold text-uppercase">Featured Products</h5>
            <h2 className="fw-bold text-dark mb-4">Popular Kitchen Items</h2>
          </div>

          {loading ? (
            <div className="d-flex justify-content-center">
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            <div id="productCarousel" className="carousel slide" data-bs-ride="carousel">
              <div className="carousel-indicators">
                <button type="button" data-bs-target="#productCarousel" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                <button type="button" data-bs-target="#productCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
              </div>
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <div className="row g-4">
                    {kitchenProducts.slice(0, 3).map((product, index) => (
                      <div key={product._id || index} className="col-md-4">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="card h-100 border-0 shadow-sm product-card"
                        >
                          <div className="position-relative">
                            <img
                              src={
                                product.image?.startsWith("data:image") 
                                  ? product.image 
                                  : `data:image/jpeg;base64,${product.image}` // Corrected template literal syntax
                              }
                              className="card-img-top"
                              style={{ height: "200px", objectFit: "cover" }}
                              alt={product.name}
                            />
                            {product.discount && (
                              <div className="position-absolute top-0 end-0 bg-danger text-white px-2 py-1 m-2 rounded-pill">
                                -{product.discount}%
                              </div>
                            )}
                          </div>
                          <div className="card-body p-3">
                            <h5 className="card-title fw-bold mb-2">{product.name}</h5>
                            <div className="mb-3">
                              {product.oldPrice && (
                                <div className="text-muted text-decoration-line-through mb-1 fs-6">
                                  ₹{product.oldPrice}
                                </div>
                              )}
                              <div className="fw-bold text-success fs-5">₹{product.price}</div>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="btn btn-warning w-100"
                              onClick={() => handleProductClick("kitchen")}
                            >
                              View Details
                            </motion.button>
                          </div>
                        </motion.div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="carousel-item">
                  <div className="row g-4">
                    {kitchenProducts.slice(3, 6).map((product, index) => (
                      <div key={product._id || index} className="col-md-4">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="card h-100 border-0 shadow-sm product-card"
                        >
                          <div className="position-relative">
                            <img
                              src={
                                product.image?.startsWith("data:image") 
                                  ? product.image 
                                  : `data:image/jpeg;base64,${product.image}` // Corrected template literal syntax
                              }
                              className="card-img-top"
                              style={{ height: "200px", objectFit: "cover" }}
                              alt={product.name}
                            />
                            {product.discount && (
                              <div className="position-absolute top-0 end-0 bg-danger text-white px-2 py-1 m-2 rounded-pill">
                                -{product.discount}%
                              </div>
                            )}
                          </div>
                          <div className="card-body p-3">
                            <h5 className="card-title fw-bold mb-2">{product.name}</h5>
                            <div className="mb-3">
                              {product.oldPrice && (
                                <div className="text-muted text-decoration-line-through mb-1 fs-6">
                                  ₹{product.oldPrice}
                                </div>
                              )}
                              <div className="fw-bold text-success fs-5">₹{product.price}</div>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="btn btn-warning w-100"
                              onClick={() => handleProductClick("kitchen")}
                            >
                              View Details
                            </motion.button>
                          </div>
                        </motion.div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <button className="carousel-control-prev" type="button" data-bs-target="#productCarousel" data-bs-slide="prev">
                <span className="carousel-control-prev-icon bg-success rounded-circle p-3" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button className="carousel-control-next" type="button" data-bs-target="#productCarousel" data-bs-slide="next">
                <span className="carousel-control-next-icon bg-success rounded-circle p-3" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          )}
          
          <div className="text-center mt-4">
            <button 
              className="btn btn-outline-success btn-lg"
              onClick={() => handleProductClick("kitchen")}
            >
              View All Kitchen Products <FaArrowRight className="ms-2" />
            </button>
          </div>
        </div>
      </div>

      {/* About Section */}
      <motion.div
        id="about"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="container py-5"
      >
        <div className="row align-items-center">
          <div className="col-md-6">
            <div className="position-relative">
              <img src={aboutImage} alt="About Us" className="img-fluid rounded-4 shadow-lg" />
              <div className="position-absolute start-0 bottom-0 translate-middle-y bg-success text-white p-4 rounded-end-4">
                <h3 className="h5 mb-1">20+ Years</h3>
                <p className="mb-0">Of Excellence</p>
              </div>
            </div>
          </div>
          <div className="col-md-6 mt-4 mt-md-0">
            <div className="ps-md-4">
              <img src={loaderImg} alt="Cotton Logo" className="mb-2" width="60" height="60" />
              <div className="d-flex align-items-center mb-4">
                <div className="border-start border-4 border-success ps-3">
                  <h5 className="text-warning fw-bold text-uppercase mb-0">Who Are We</h5>
                  <h2 className="fw-bold text-dark">Manufacturers & Exporters <br /> of Home Textiles</h2>
                </div>
              </div>
              <p className="text-muted lead">
                Welcome to Merit Creaters! We are a company dedicated to creating high-quality home textiles that are both stylish and comfortable.
              </p>
              <p className="text-muted">
                Our skilled craftsmen and women use traditional techniques and modern innovations to bring your vision to life. From weaving and dyeing to embroidery and stitching, we have a wide range of expertise that allows us to create a variety of products to suit your needs.
              </p>
              <div className="mt-4">
                <button 
                  className="btn btn-success me-3"
                  onClick={() => window.open("https://youtu.be/yRXuKFy89Mg?si=k98mkhDpFMY8QIAo", "_blank")}
                >
                  Our Story
                </button>
                <button 
                  className="btn btn-outline-success"
                  onClick={() => navigate("/contact")} // Navigate to the contact page
                >
                  Contact Us
                </button>
              </div>
              <div className="row g-4 mt-4">
                <div className="col-sm-6">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <div className="bg-soft-success rounded-circle p-3">
                        <FaHandshake className="text-success fs-4" />
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h5 className="fw-bold mb-1">Trusted Partners</h5>
                      <p className="text-muted mb-0">Building long-term relationships with clients worldwide</p>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6">
                  <div className="d-flex align-items-center">
                    <div className="flex-shrink-0">
                      <div className="bg-soft-success rounded-circle p-3">
                        <FaLeaf className="text-success fs-4" />
                      </div>
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <h5 className="fw-bold mb-1">Eco-Friendly</h5>
                      <p className="text-muted mb-0">Promoting sustainability through responsible practices</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Section with Bootstrap Cards */}
      <div className="py-5 stats-section bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <img src={loaderImg} alt="Cotton Logo" className="mb-2" width="60" height="60" />
            <h5 className="text-warning fw-bold text-uppercase">Our Infrastructure</h5>
            <h2 className="fw-bold text-dark mb-4">Company Overview</h2>
          </div>
          <div className="row g-4">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="col-md-4 col-lg"
              >
                <div className={`card border-0 shadow h-100 ${stat.bgColor}`}> {/* Corrected JSX attribute syntax */}
                  <div className="card-body p-4">
                    <div className="text-center">
                      <div className="stat-icon mb-3">
                        <div className="icon-circle mx-auto">
                          {stat.icon}
                        </div>
                      </div>
                      <div className="stat-content">
                        <h3 className="fw-bold mb-1">{stat.number}</h3>
                        <h5 className="text-uppercase mb-2">{stat.label}</h5>
                        <p className="text-muted mb-0 small">{stat.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Company Values Section with Bootstrap Cards */}
      <motion.div
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="container py-5"
      >
        <div className="text-center mb-5">
          <img src={loaderImg} alt="Cotton Logo" className="mb-2" width="60" height="60" />
          <h5 className="text-warning fw-bold text-uppercase">Our Commitments</h5>
          <h2 className="fw-bold text-dark mb-4">What Sets Us Apart</h2>
        </div>
        <div className="row g-4">
          {commitmentPoints.map((point, index) => (
            <div key={index} className="col-md-6 mb-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="card h-100 border-0 shadow p-4"
              >
                <div className="d-flex align-items-center mb-3">
                  <div className="display-4 text-success me-3">{point.icon}</div>
                  <h3 className="h4 mb-0 text-success">{point.title}</h3>
                </div>
                <p className="text-muted mb-0">{point.description}</p>
              </motion.div>
            </div>
          ))}
        </div>
        <div className="row mt-5">
          <div className="col-12">
            <div className="card border-0 bg-light p-4">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <h3 className="text-success mb-3">Our Responsibility</h3>
                  <p className="text-muted mb-3">
                    At Merit Creaters, we take our responsibility seriously across all aspects of our operations. 
                    We prioritize our employees' well-being by providing safe working conditions and convenient 
                    transport facilities. Our commitment extends to ethical business practices and environmental 
                    sustainability, ensuring we make a positive impact in the textile industry while delivering 
                    exceptional quality to our customers.
                  </p>
                  <p className="text-muted mb-md-0 mb-3">
                    We believe in continuous innovation and development, working closely with our clients to 
                    understand and meet their specific needs.
                  </p>
                </div>
                <div className="col-md-4 text-center">
                  <div className="bg-white p-4 rounded-4 shadow-sm">
                    <div className="display-1 text-success mb-3">
                      <FaHandHoldingHeart />
                    </div>
                    <h4 className="mb-0">Corporate Social<br />Responsibility</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Vision & Mission Section with Bootstrap Cards */}
      <motion.div
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="vision-mission-section py-5 bg-light"
      >
        <div className="container">
          <div className="text-center mb-5">
            <img src={loaderImg} alt="Cotton Logo" className="mb-2" width="60" height="60" />
            <h5 className="text-warning fw-bold text-uppercase">Our Purpose</h5>
            <h2 className="fw-bold text-dark mb-4">Mission & Vision</h2>
          </div>
          <div className="row g-4">
            <div className="col-md-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="card h-100 border-0 shadow-lg p-4 vision-card"
              >
                <div className="vision-icon mb-4 text-center">
                  <div className="icon-circle-lg mx-auto">
                    <FaStar className="vision-icon-inner" />
                  </div>
                </div>
                <h3 className="vision-title mb-3 text-center">Our Vision</h3>
                <p className="vision-text">
                  To be the premier provider of top-quality home textile products in the global market, 
                  consistently delivering exceptional value to our customers and being recognized as a 
                  trusted and reliable partner.
                </p>
                <div className="mt-auto pt-3 text-center">
                  <p className="text-muted fst-italic">"Empowering homes with quality and style."</p>
                </div>
              </motion.div>
            </div>
            <div className="col-md-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="card h-100 border-0 shadow-lg p-4 mission-card"
              >
                <div className="mission-icon mb-4 text-center">
                  <div className="icon-circle-lg mx-auto">
                    <FaHandshake className="mission-icon-inner" />
                  </div>
                </div>
                <h3 className="mission-title mb-3 text-center">Our Mission</h3>
                <p className="mission-text">
                  To consistently deliver top-quality home textile products and exceptional customer 
                  service while being a responsible and sustainable company and a leader in the industry.
                </p>
                <div className="mt-auto pt-3 text-center">
                  <p className="text-muted fst-italic">"Committed to excellence and sustainability."</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Process Section with Enhanced Bootstrap Cards */}
      <div id="process" className="py-5">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="container"
        >
          <motion.div variants={fadeInUp} className="text-center">
            <img src={loaderImg} alt="Cotton Logo" className="mb-2" width="60" height="60" />
            <h5 className="text-warning fw-bold text-uppercase">What We Do</h5>
            <h2 className="fw-bold text-dark mb-4">How We Process Fabrics</h2>
            <p className="text-muted mb-5 mx-auto" style={{ maxWidth: "700px" }}>
              Our comprehensive manufacturing process ensures the highest quality textiles from design to delivery.
              Each step is handled by experts with precision and care.
            </p>
          </motion.div>
          
          <div className="row justify-content-center">
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                variants={{
                  initial: { opacity: 0, scale: 0.8 },
                  animate: { opacity: 1, scale: 1 }
                }}
                className="col-md-4 col-lg-2 mb-4"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="card text-center shadow border-0 h-100 process-card"
                >
                  <div className="card-body p-4">
                    <div className="icon-container d-flex align-items-center justify-content-center mx-auto bg-success text-white rounded-circle mb-3" style={{ width: "80px", height: "80px", fontSize: "2rem" }}>
                      {step.icon}
                    </div>
                    <h5 className="fw-bold text-dark mb-2">{step.title}</h5>
                    <p className="text-muted small mb-0">{step.description}</p>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
          
          <div className="row mt-5">
            <div className="col-12">
              <div className="card border-0 shadow-sm p-4 bg-soft-warning">
                <div className="row align-items-center">
                  <div className="col-md-8">
                    <h4 className="text-dark mb-3">Need custom textile manufacturing?</h4>
                    <p className="text-muted mb-md-0 mb-3">
                      We offer full-service custom manufacturing solutions tailored to your specific requirements. 
                      From initial design to final delivery, our team will work with you every step of the way.
                    </p>
                  </div>
                  <div className="col-md-4 text-md-end text-center">
                    <button
                      className="btn btn-success px-4 py-2"
                      onClick={() => {
                        navigate("/contact"); // Navigate to the contact page
                        setTimeout(() => {
                          document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" });
                        }, 100); // Ensure the page is loaded before scrolling
                      }}
                    >
                      Request a Quote
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Products Section with Bootstrap Cards */}
      <motion.div
        id="products"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={staggerContainer}
        className="container-fluid py-5 bg-light"
      >
        <div className="container">
          <motion.div variants={fadeInUp} className="text-center">
            <img src={loaderImg} alt="Cotton Logo" className="mb-2" width="60" height="60" />
            <h5 className="text-warning fw-bold text-uppercase">Our Line of Products</h5>
            <h2 className="fw-bold text-dark mb-4">Explore Our Categories</h2>
            <p className="text-muted mb-5 mx-auto" style={{ maxWidth: "700px" }}>
              Discover our wide range of high-quality textile products designed for comfort, style, and durability.
              Each category offers a variety of options to suit your specific needs.
            </p>
          </motion.div>
          
          <div className="row g-4">
            {productCategories.map((product, index) => (
              <motion.div
                key={index}
                variants={{
                  initial: { opacity: 0, scale: 0.8 },
                  animate: { opacity: 1, scale: 1 }
                }}
                className="col-md-6 col-lg-3 mb-4"
              >
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="card border-0 shadow h-100 overflow-hidden product-category-card"
                  onClick={() => handleProductClick(product.key)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="position-relative">
                    <img 
                      src={product.img} 
                      alt={product.title} 
                      className="card-img-top" 
                      style={{ height: "220px", objectFit: "cover" }}
                    />
                    <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-25 hover-overlay"></div>
                  </div>
                  <div className="card-body p-4">
                    <h5 className="fw-bold mb-2">{product.title}</h5>
                    <p className="text-muted small mb-3">{product.description}</p>
                    <div className="d-flex align-items-center">
                      <span className="text-success fw-bold me-auto">Browse Collection</span>
                      <FaArrowRight className="text-success" />
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Back to Top Button */}
      <button 
        onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
        className="btn btn-success position-fixed bottom-0 end-0 m-4 rounded-circle shadow"
        style={{ width: "50px", height: "50px", zIndex: 1000 }}
      >
        <FaArrowUp />
      </button>
    </>
  );
};

export default Home;