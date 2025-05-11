import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { 
  FaMapMarkerAlt, 
  FaPhoneAlt, 
  FaEnvelope, 
  FaClock, 
  FaFacebook, 
  FaTwitter, 
  FaLinkedin, 
  FaInstagram,
  FaArrowRight,
  FaHeadset,
  FaCheckCircle,
  FaExclamationTriangle
} from "react-icons/fa";

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ show: false, success: false, message: '' });
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [activeTab, setActiveTab] = useState('contact');
  const [animateElements, setAnimateElements] = useState(false);

  useEffect(() => {
    setAnimateElements(true);
    
    // Track scroll position to animate elements when they come into view
    const handleScroll = () => {
      const scrollElements = document.querySelectorAll('.scroll-animation');
      scrollElements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (elementPosition < windowHeight - 100) {
          element.classList.add('animate');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger on initial load
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitStatus({ show: false, success: false, message: '' });
    
    // Simulate API call with timeout
    setTimeout(() => {
      try {
        // For demonstration, assume success
        setSubmitStatus({
          show: true,
          success: true,
          message: 'Message sent successfully! We will get back to you soon.'
        });
        setFormData({ fullName: "", email: "", phone: "", subject: "", message: "" });
      } catch (error) {
        setSubmitStatus({
          show: true,
          success: false,
          message: 'Failed to send message. Please try again later.'
        });
      } finally {
        setLoading(false);
      }
    }, 1500);
  };

  const contactInfo = [
    { 
      icon: <FaMapMarkerAlt/>, 
      title: 'Visit Us', 
      text: '240/2 M.G Road, Senthuthaparam Post, Karur - 639002, Tamilnadu, India',
      bgColor: 'rgba(255, 193, 7, 0.15)',
      iconColor: '#ffc107'
    },
    { 
      icon: <FaPhoneAlt/>, 
      title: 'Call Us', 
      text: '+91 9363362299',
      bgColor: 'rgba(25, 135, 84, 0.15)',
      iconColor: '#198754'
    },
    { 
      icon: <FaEnvelope/>, 
      title: 'Email Us', 
      text: 'info@meritcreaters.com',
      bgColor: 'rgba(13, 110, 253, 0.15)',
      iconColor: '#0d6efd'
    },
    { 
      icon: <FaClock/>, 
      title: 'Working Hours', 
      text: 'Mon - Sat: 9:00 - 18:00',
      bgColor: 'rgba(220, 53, 69, 0.15)',
      iconColor: '#dc3545'
    }
  ];

  const socialLinks = [
    { Icon: FaFacebook, color: '#1877f2', link: '#', label: 'Facebook' },
    { Icon: FaTwitter, color: '#1da1f2', link: '#', label: 'Twitter' },
    { Icon: FaLinkedin, color: '#0a66c2', link: '#', label: 'LinkedIn' },
    { Icon: FaInstagram, color: '#e4405f', link: '#', label: 'Instagram' }
  ];

  const faqItems = [
    {
      question: 'How can I track my order?',
      answer: 'You can track your order by logging into your account and navigating to the "My Orders" section. Alternatively, you can use the tracking number provided in your order confirmation email.'
    },
    {
      question: 'What are your shipping rates?',
      answer: 'Our shipping rates vary based on your location and the size of your order. Free shipping is available for orders above ₹5000 within India. International shipping rates are calculated at checkout.'
    },
    {
      question: 'Do you offer bulk discounts?',
      answer: 'Yes, we offer special discounts for bulk orders. Please contact our sales team at sales@meritcreaters.com for custom quotes based on your requirements.'
    },
    {
      question: 'What is your return policy?',
      answer: 'We accept returns within 14 days of delivery. Products must be in original condition with tags attached. Please note that custom-made items cannot be returned unless defective.'
    },
    {
      question: 'How can I become a distributor?',
      answer: 'To become a distributor, please send your business profile and requirements to partnerships@meritcreaters.com. Our team will review your application and get back to you within 3-5 business days.'
    }
  ];

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <div className="position-relative text-white" style={{
        background: 'linear-gradient(135deg, #FFA500, #FF8C00)',
        borderRadius: '0 0 50% 50% / 10%',
        overflow: 'hidden'
      }}>
        <div className="position-absolute w-100 h-100" style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: '0.4',
          zIndex: '-1'
        }}></div>
        <div 
          className={`container py-5 ${animateElements ? 'fade-in-up' : ''}`}
          style={{ animationDelay: '0.2s' }}
        >
          <div className="row justify-content-center text-center py-5">
            <div className="col-lg-8">
              <h1 className="display-3 fw-bold mb-4" style={{textShadow: '0 2px 4px rgba(0,0,0,0.3)'}}>
                Get in Touch
              </h1>
              <p className="lead mb-4" style={{textShadow: '0 1px 2px rgba(0,0,0,0.3)'}}>
                We'd love to hear from you. Drop us a line and we'll get back to you as soon as possible.
              </p>
              <div className="d-flex justify-content-center">
                <button 
                  className="btn btn-light btn-lg px-4 me-2 shadow-sm" 
                  onClick={() => {
                    document.getElementById('contact-form').scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Contact Us <FaArrowRight className="ms-2" />
                </button>
                <a href="tel:+919363362299" className="btn btn-outline-light btn-lg px-4 shadow-sm">
                  <FaHeadset className="me-2" /> Call Now
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave effect at bottom */}
        <div className="position-absolute bottom-0 left-0 w-100" style={{zIndex: '1'}}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" fill="#ffffff">
            <path fillOpacity="1" d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,100L1360,100C1280,100,1120,100,960,100C800,100,640,100,480,100C320,100,160,100,80,100L0,100Z"></path>
          </svg>
        </div>
      </div>

      {/* Contact Info Cards */}
      <div className="container position-relative" style={{ marginTop: '-30px', zIndex: '2' }}>
        <div className="row g-4">
          {contactInfo.map((item, index) => (
            <div key={index} className="col-md-6 col-lg-3">
              <div 
                className={`card border-0 shadow h-100 contact-card scroll-animation ${animateElements ? 'animate' : ''}`} 
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="card-body p-4 d-flex align-items-center">
                  <div 
                    className="rounded-circle me-3 d-flex align-items-center justify-content-center flex-shrink-0" 
                    style={{ 
                      width: '60px', 
                      height: '60px', 
                      backgroundColor: item.bgColor
                    }}
                  >
                    {React.cloneElement(item.icon, { 
                      style: { color: item.iconColor },
                      size: 24 
                    })}
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1">{item.title}</h5>
                    <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>{item.text}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs for Contact/FAQ */}
      <div className="container py-5 mt-4">
        <div className="row justify-content-center mb-4">
          <div className="col-md-8">
            <ul className="nav nav-pills nav-justified mb-4">
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'contact' ? 'active' : ''}`}
                  onClick={() => setActiveTab('contact')}
                  style={{ 
                    backgroundColor: activeTab === 'contact' ? '#ffc107' : 'transparent',
                    color: activeTab === 'contact' ? '#fff' : '#333',
                    fontWeight: 'bold' 
                  }}
                >
                  <FaEnvelope className="me-2" /> Contact Us
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link ${activeTab === 'faq' ? 'active' : ''}`} 
                  onClick={() => setActiveTab('faq')}
                  style={{ 
                    backgroundColor: activeTab === 'faq' ? '#ffc107' : 'transparent',
                    color: activeTab === 'faq' ? '#fff' : '#333',
                    fontWeight: 'bold'
                  }}
                >
                  <FaHeadset className="me-2" /> FAQ
                </button>
              </li>
            </ul>
          </div>
        </div>

        {activeTab === 'contact' && (
          <div className="row g-4">
            <div className="col-lg-6">
              <div 
                id="contact-form" 
                className="p-4 p-md-5 bg-white rounded-3 shadow scroll-animation"
                style={{ borderTop: '5px solid #ffc107' }}
              >
                <h3 className="fw-bold mb-4 position-relative pb-2">
                  Send us a Message
                  <span className="position-absolute" 
                    style={{ 
                      bottom: 0, 
                      left: 0, 
                      width: '50px', 
                      height: '3px', 
                      backgroundColor: '#ffc107' 
                    }}
                  ></span>
                </h3>
                <form onSubmit={handleSubmit}>
                  <div className="row mb-4">
                    <div className="col-md-6 mb-3 mb-md-0">
                      <div className="form-floating">
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          className="form-control"
                          placeholder="Full Name"
                          value={formData.fullName}
                          onChange={handleChange}
                          required
                        />
                        <label htmlFor="fullName">Full Name</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className="form-control"
                          placeholder="Email Address"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                        <label htmlFor="email">Email Address</label>
                      </div>
                    </div>
                  </div>
                  <div className="row mb-4">
                    <div className="col-md-6 mb-3 mb-md-0">
                      <div className="form-floating">
                        <input
                          type="text"
                          id="phone"
                          name="phone"
                          className="form-control"
                          placeholder="Phone Number"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                        <label htmlFor="phone">Phone Number</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating">
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          className="form-control"
                          placeholder="Subject"
                          value={formData.subject}
                          onChange={handleChange}
                        />
                        <label htmlFor="subject">Subject</label>
                      </div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="form-floating">
                      <textarea
                        id="message"
                        name="message"
                        className="form-control"
                        placeholder="Write Message"
                        style={{ height: '150px' }}
                        value={formData.message}
                        onChange={handleChange}
                        required
                      ></textarea>
                      <label htmlFor="message">Your Message</label>
                    </div>
                  </div>
                  <div className="position-relative">
                    <button 
                      type="submit" 
                      className="btn btn-warning btn-lg w-100 py-3 position-relative submit-btn shadow-sm" 
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Sending...
                        </>
                      ) : (
                        <>Send Message <FaArrowRight className="ms-2" /></>
                      )}
                    </button>
                    {submitStatus.show && (
                      <div 
                        className={`alert alert-${submitStatus.success ? 'success' : 'danger'} mt-3 d-flex align-items-center`} 
                        role="alert"
                      >
                        {submitStatus.success ? 
                          <FaCheckCircle className="me-2" size={22} /> : 
                          <FaExclamationTriangle className="me-2" size={22} />
                        }
                        <div>{submitStatus.message}</div>
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </div>
            
            <div className="col-lg-6">
              <div className="map-container rounded-3 shadow overflow-hidden scroll-animation" style={{ height: '300px' }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.749!2d78.0765!3d10.9588!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDU3JzMxLjciTiA3OMKwMDQnMzUuNCJF!5e0!3m2!1sen!2sin!4v1625842159014!5m2!1sen!2sin"
                  className="w-100 h-100 border-0"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              
              <div className="bg-white rounded-3 shadow p-4 mt-4 scroll-animation">
                <h5 className="fw-bold mb-3 position-relative pb-2">
                  Follow Us
                  <span className="position-absolute" 
                    style={{ 
                      bottom: 0, 
                      left: 0, 
                      width: '40px', 
                      height: '3px', 
                      backgroundColor: '#ffc107' 
                    }}
                  ></span>
                </h5>
                <div className="d-flex gap-2">
                  {socialLinks.map(({ Icon, color, link, label }, index) => (
                    <a 
                      key={index} 
                      href={link} 
                      className="social-link"
                      aria-label={label}
                      style={{ 
                        backgroundColor: color,
                        color: '#fff',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 0 0 rgba(0,0,0,0)';
                      }}
                    >
                      <Icon size={18} />
                    </a>
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-3 shadow p-4 mt-4 scroll-animation">
                <h5 className="fw-bold mb-3 position-relative pb-2">
                  Business Hours
                  <span className="position-absolute" 
                    style={{ 
                      bottom: 0, 
                      left: 0, 
                      width: '40px', 
                      height: '3px', 
                      backgroundColor: '#ffc107' 
                    }}
                  ></span>
                </h5>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                    <span><strong>Monday - Friday</strong></span>
                    <span className="badge bg-warning">9:00 AM - 6:00 PM</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                    <span><strong>Saturday</strong></span>
                    <span className="badge bg-warning">9:00 AM - 1:00 PM</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                    <span><strong>Sunday</strong></span>
                    <span className="badge bg-danger">Closed</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="bg-white rounded-3 shadow p-4 p-md-5">
                <h3 className="fw-bold mb-4 position-relative pb-2">
                  Frequently Asked Questions
                  <span className="position-absolute" 
                    style={{ 
                      bottom: 0, 
                      left: 0, 
                      width: '50px', 
                      height: '3px', 
                      backgroundColor: '#ffc107' 
                    }}
                  ></span>
                </h3>
                <div className="accordion" id="faqAccordion">
                  {faqItems.map((faq, index) => (
                    <div key={index} className="accordion-item border mb-3 shadow-sm">
                      <h2 className="accordion-header" id={`heading${index}`}>
                        <button 
                          className="accordion-button collapsed fw-bold" 
                          type="button" 
                          data-bs-toggle="collapse" 
                          data-bs-target={`#collapse${index}`} 
                          aria-expanded="false" 
                          aria-controls={`collapse${index}`}
                        >
                          {faq.question}
                        </button>
                      </h2>
                      <div 
                        id={`collapse${index}`} 
                        className="accordion-collapse collapse" 
                        aria-labelledby={`heading${index}`} 
                        data-bs-parent="#faqAccordion"
                      >
                        <div className="accordion-body text-muted">
                          {faq.answer}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-center mt-4">
                  <p className="mb-3">Can't find the answer you're looking for?</p>
                  <button 
                    className="btn btn-warning px-4 py-2" 
                    onClick={() => setActiveTab('contact')}
                  >
                    Contact Our Support Team
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="bg-light py-5 mt-5">
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h2 className="fw-bold mb-3">Ready to get started?</h2>
              <p className="text-muted mb-4">
                Join thousands of satisfied customers who trust Merit Creaters for quality textile products.
              </p>
              <div className="d-flex justify-content-center gap-3">
                <a href="#" className="btn btn-warning px-4 py-2">
                  Get a Quote
                </a>
                <a href="tel:+919363362299" className="btn btn-outline-secondary px-4 py-2">
                  <FaPhoneAlt className="me-2" /> Call Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        
        
        .contact-page {
          font-family: 'Poppins', sans-serif;
        }
        
        .contact-card {
          transition: all 0.3s ease;
          border-radius: 10px;
          overflow: hidden;
        }
        
        .contact-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important;
        }
        
        .submit-btn {
          transition: all 0.3s ease;
          border-radius: 30px;
          overflow: hidden;
          font-weight: 600;
        }
        
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 10px 20px rgba(255, 193, 7, 0.3) !important;
        }
        
        .form-control {
          border-radius: 8px;
          border: 1px solid #e0e0e0;
          padding: 12px 15px;
          transition: all 0.3s ease;
        }
        
        .form-control:focus {
          border-color: #ffc107;
          box-shadow: 0 0 0 0.25rem rgba(255, 193, 7, 0.25);
        }
        
        /* Animations */
        .fade-in-up {
          animation: fadeInUp 0.8s ease forwards;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .scroll-animation {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s ease;
        }
        
        .scroll-animation.animate {
          opacity: 1;
          transform: translateY(0);
        }
        
        /* Accordion custom styling */
        .accordion-button:not(.collapsed) {
          background-color: rgba(255, 193, 7, 0.1);
          color: rgba(0, 0, 0, 0.9);
          border-color: rgba(255, 193, 7, 0.5);
          box-shadow: none;
        }
        
        .accordion-button:focus {
          box-shadow: none;
          border-color: rgba(255, 193, 7, 0.5);
        }
        
        /* Nav pills custom styling */
        .nav-pills .nav-link {
          border-radius: 30px;
          padding: 10px 20px;
          transition: all 0.3s ease;
        }
        
        .nav-pills .nav-link:not(.active):hover {
          background-color: rgba(255, 193, 7, 0.1);
        }
      `}</style>
    </div>
  );
};

export default Contact;