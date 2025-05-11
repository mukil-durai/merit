import React from "react";
import { motion } from "framer-motion";
import { FaUsers, FaHandshake, FaStar, FaGlobe } from "react-icons/fa";
import aboutImage from "../assets/about.jpg";
import teamImage from "../assets/home2.jpg";
import loaderImg from "../assets/loader.svg";
import "../css/about.css";

const AboutUs = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const stats = [
    { icon: <FaUsers />, number: "100+", label: "Employees" },
    { icon: <FaHandshake />, number: "500+", label: "Happy Clients" },
    { icon: <FaStar />, number: "15+", label: "Years Experience" },
    { icon: <FaGlobe />, number: "20+", label: "Countries Served" }
  ];

  return (
    <>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="position-relative text-center text-white d-flex align-items-center justify-content-center mt-5"
        style={{ backgroundImage: `url(${aboutImage})`, height: "400px", backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"></div>
        <div className="position-relative z-1">
          <h1 className="fw-bold display-4">About Us</h1>
          <p className="lead">Creating Quality Home Textiles Since 2005</p>
        </div>
      </motion.div>

      {/* Mission & Vision Section */}
      <motion.div
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="container py-5"
      >
        <div className="text-center mb-5">
          <img src={loaderImg} alt="Cotton Logo" className="mb-2" width="60" height="60" />
          <h5 className="text-warning fw-bold text-uppercase">Our Purpose</h5>
          <h2 className="fw-bold text-dark mb-4">Mission & Vision</h2>
        </div>

        <div className="row g-4">
          <div className="col-md-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="card h-100 border-0 shadow-sm p-4"
            >
              <h3 className="text-success mb-3">Our Vision</h3>
              <p className="text-muted">
                To be the premier provider of top-quality home textile products in the global market, 
                consistently delivering exceptional value to our customers and being recognized as a 
                trusted and reliable partner.
              </p>
            </motion.div>
          </div>
          <div className="col-md-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="card h-100 border-0 shadow-sm p-4"
            >
              <h3 className="text-success mb-3">Our Mission</h3>
              <p className="text-muted">
                To consistently deliver top-quality home textile products and exceptional customer 
                service while being a responsible and sustainable company and a leader in the industry.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Stats Section */}
      <div className="bg-light py-5">
        <div className="container">
          <div className="row g-4">
            {stats.map((stat, index) => (
              <div key={index} className="col-md-3 col-sm-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="display-4 text-success mb-2">{stat.icon}</div>
                  <h2 className="fw-bold">{stat.number}</h2>
                  <p className="text-muted">{stat.label}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Company Story Section */}
      <motion.div
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        variants={fadeInUp}
        className="container py-5"
      >
        <div className="row align-items-center">
          <div className="col-md-6">
            <img src={teamImage} alt="Our Team" className="img-fluid rounded shadow-lg" />
          </div>
          <div className="col-md-6">
            <img src={loaderImg} alt="Cotton Logo" className="mb-2" width="60" height="60" />
            <h5 className="text-warning fw-bold text-uppercase">Our Story</h5>
            <h2 className="fw-bold text-dark">A Legacy of Excellence</h2>
            <p className="text-muted">
              Founded in 2005, Merit Creaters has grown from a small local business to a 
              renowned name in the home textile industry. With a yearly revenue of 1.2 million USD 
              and a dedicated team of 100 employees, we've built our reputation on quality, 
              innovation, and customer satisfaction.
            </p>
            <p className="text-muted">
              Our commitment to excellence, sustainable practices, and continuous improvement 
              has helped us establish strong relationships with clients across the globe. We 
              take pride in our craftsmanship and our ability to meet the diverse needs of our 
              customers.
            </p>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default AboutUs;
