import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Linkedin, ArrowUp } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

const Footer = () => {
  const navigate = useNavigate();
  const [emailSubscription, setEmailSubscription] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  
  const handleServiceClick = (service) => {
    navigate('/process', { state: { scrollTo: service } });
  };
  
  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleSubscription = (e) => {
    e.preventDefault();
    // Simulate subscription process
    if (emailSubscription && emailSubscription.includes('@')) {
      setSubscriptionStatus("success");
      setEmailSubscription("");
      setTimeout(() => setSubscriptionStatus(null), 3000);
    } else {
      setSubscriptionStatus("error");
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };
  
  return (
    <footer style={{ backgroundColor: "#1c4532", color: "white" }}>
      {/* Main Footer */}
      <div className="container py-5">
        <div className="row">
          {/* Company Info */}
          <div className="col-lg-4 mb-4">
            <div className="mb-4">
              <img src="src/assets/logog.png" alt="Merit Creaters Logo" className="img-fluid mb-3" style={{ maxHeight: "80px" }} />
              <p className="text-light">
                Merit Creaters is a home textile manufacturer producing a wide range
                of products for the home, including bedding, towels, curtains, and
                more.
              </p>
            </div>
            
            {/* Social Media */}
            <div className="mt-4">
              <h6 className="fw-bold text-white mb-3">FOLLOW US</h6>
              <div className="d-flex gap-3">
                <a href="#" className="text-white btn btn-sm btn-outline-light rounded-circle p-2">
                  <Facebook size={18} />
                </a>
                <a href="#" className="text-white btn btn-sm btn-outline-light rounded-circle p-2">
                  <Instagram size={18} />
                </a>
                <a href="#" className="text-white btn btn-sm btn-outline-light rounded-circle p-2">
                  <Twitter size={18} />
                </a>
                <a href="#" className="text-white btn btn-sm btn-outline-light rounded-circle p-2">
                  <Linkedin size={18} />
                </a>
              </div>
            </div>
          </div>
          
          {/* Services */}
          <div className="col-md-3 col-6 mb-4">
            <h5 className="text-white mb-4 fw-bold position-relative">
              SERVICES
              <span className="position-absolute" style={{ height: "2px", width: "40px", backgroundColor: "#8dc63f", bottom: "-10px", left: "0" }}></span>
            </h5>
            <ul className="list-unstyled">
              {['DESIGN', 'WEAVE', 'DYEING', 'PRINTING', 'STITCHING', 'EMBROIDERY'].map((service, index) => (
                <li key={index} className="mb-3">
                  <a 
                    onClick={() => handleServiceClick(service)} 
                    className="text-light text-decoration-none d-block position-relative ps-3" 
                    style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                    onMouseOver={(e) => {
                      e.target.style.color = '#8dc63f';
                      e.target.style.paddingLeft = '15px';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.color = 'white';
                      e.target.style.paddingLeft = '12px';
                    }}
                  >
                    <span className="position-absolute" style={{ left: "0", top: "8px", height: "5px", width: "5px", backgroundColor: "#8dc63f", borderRadius: "50%" }}></span>
                    {service.charAt(0) + service.slice(1).toLowerCase()}
                    {service === 'STITCHING' && ' (Cutting & Stitching)'}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Links */}
          <div className="col-md-2 col-6 mb-4">
            <h5 className="text-white mb-4 fw-bold position-relative">
              QUICK LINKS
              <span className="position-absolute" style={{ height: "2px", width: "40px", backgroundColor: "#8dc63f", bottom: "-10px", left: "0" }}></span>
            </h5>
            <ul className="list-unstyled">
              {[
                { path: '/', name: 'Home' },
                { path: '/process', name: 'About us' },
                { path: '/process', name: 'Process' },
                { path: '/infrastructure', name: 'Infrastructure' },
                { path: '/catlog/kitchen', name: 'Catalog' },
                { path: '/contact', name: 'Contact Us' }
              ].map((link, index) => (
                <li key={index} className="mb-3">
                  <a 
                    onClick={() => handleNavigation(link.path)} 
                    className="text-light text-decoration-none d-block position-relative ps-3" 
                    style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                    onMouseOver={(e) => {
                      e.target.style.color = '#8dc63f';
                      e.target.style.paddingLeft = '15px';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.color = 'white';
                      e.target.style.paddingLeft = '12px';
                    }}
                  >
                    <span className="position-absolute" style={{ left: "0", top: "8px", height: "5px", width: "5px", backgroundColor: "#8dc63f", borderRadius: "50%" }}></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Info */}
          <div className="col-md-3 mb-4">
            <h5 className="text-white mb-4 fw-bold position-relative">
              CONTACT US
              <span className="position-absolute" style={{ height: "2px", width: "40px", backgroundColor: "#8dc63f", bottom: "-10px", left: "0" }}></span>
            </h5>
            <ul className="list-unstyled">
              <li className="d-flex align-items-center mb-3">
                <div className="me-3 d-flex justify-content-center align-items-center" style={{ backgroundColor: "rgba(141, 198, 63, 0.2)", width: "36px", height: "36px", borderRadius: "50%" }}>
                  <Phone size={18} className="text-light" />
                </div>
                <a href="tel:+919363362299" className="text-light text-decoration-none" style={{ transition: '0.3s' }} onMouseOver={(e) => e.target.style.color = '#8dc63f'} onMouseOut={(e) => e.target.style.color = 'white'}>+91 9363362299</a>
              </li>
              <li className="d-flex align-items-center mb-3">
                <div className="me-3 d-flex justify-content-center align-items-center" style={{ backgroundColor: "rgba(141, 198, 63, 0.2)", width: "36px", height: "36px", borderRadius: "50%" }}>
                  <Mail size={18} className="text-light" />
                </div>
                <a href="mailto:info@meritcreaters.com" className="text-light text-decoration-none" style={{ transition: '0.3s' }} onMouseOver={(e) => e.target.style.color = '#8dc63f'} onMouseOut={(e) => e.target.style.color = 'white'}>info@meritcreaters.com</a>
              </li>
              <li className="d-flex mb-3">
                <div className="me-3 mt-1 d-flex justify-content-center align-items-center" style={{ backgroundColor: "rgba(141, 198, 63, 0.2)", width: "36px", height: "36px", borderRadius: "50%" }}>
                  <MapPin size={18} className="text-light" />
                </div>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=240/2+M.G+Road,Senthuthapuram+Post,Karur+639002,Tamilnadu,India"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-light text-decoration-none"
                  style={{ transition: '0.3s' }}
                  onMouseOver={(e) => e.target.style.color = '#8dc63f'}
                  onMouseOut={(e) => e.target.style.color = 'white'}
                >
                  240/2 M.G Road, <br />
                  Senthuthapuram Post, <br />
                  Karur - 639002, <br />
                  Tamilnadu, India
                </a>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-4">
              <h6 className="fw-bold text-white mb-3">NEWSLETTER</h6>
              <form onSubmit={handleSubscription}>
                <div className="input-group">
                  <input 
                    type="email" 
                    className="form-control" 
                    placeholder="Your email" 
                    value={emailSubscription}
                    onChange={(e) => setEmailSubscription(e.target.value)}
                  />
                  <button className="btn" type="submit" style={{ backgroundColor: "#8dc63f", color: "white" }}>
                    Subscribe
                  </button>
                </div>
                {subscriptionStatus === "success" && (
                  <div className="text-success mt-2 small">Thank you for subscribing!</div>
                )}
                {subscriptionStatus === "error" && (
                  <div className="text-warning mt-2 small">Please enter a valid email.</div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Bottom */}
      <div style={{ backgroundColor: "#163926" }}>
        <div className="container py-3">
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start mb-2 mb-md-0">
              <p className="small text-light mb-0">© Copyright 2025 by MeritCreaters.com | All Rights Reserved</p>
            </div>
            <div className="col-md-6 text-center text-md-end">
              <a href="#" className="text-light text-decoration-none small me-3" style={{ transition: '0.3s' }} onMouseOver={(e) => e.target.style.color = '#8dc63f'} onMouseOut={(e) => e.target.style.color = 'white'}>Terms & Conditions</a>
              <span className="text-light mx-2">|</span>
              <a href="#" className="text-light text-decoration-none small" style={{ transition: '0.3s' }} onMouseOver={(e) => e.target.style.color = '#8dc63f'} onMouseOut={(e) => e.target.style.color = 'white'}>Privacy Policy</a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll to top button */}
      <button 
        onClick={scrollToTop} 
        className="btn position-fixed"
        style={{ 
          bottom: "30px", 
          right: "30px", 
          backgroundColor: "#8dc63f",
          color: "white",
          width: "45px",
          height: "45px",
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
          zIndex: 1000,
          opacity: 0.8,
          transition: "opacity 0.3s ease"
        }}
        onMouseOver={(e) => e.target.style.opacity = 1}
        onMouseOut={(e) => e.target.style.opacity = 0.8}
      >
        <ArrowUp size={20} />
      </button>
    </footer>
  );
};

export default Footer;