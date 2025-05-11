import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaIndustry, FaPalette, FaPrint, FaTshirt, FaSpinner, FaPen } from "react-icons/fa";
import AOS from 'aos';
import 'aos/dist/aos.css';

const processes = [
  {
    title: "WEAVE",
    description: "Weaving is the process of interlacing two sets of yarns or threads at right angles to create a fabric, and it is an important part of home textile manufacturing as it transforms the yarns produced through spinning into a usable fabric.",
    color: "#FF6B6B",
    icon: <FaSpinner className="process-icon-spin" size={30} />,
    imageUrl: "/api/placeholder/600/400",
    tag: "Foundation"
  },
  {
    title: "DYEING",
    description: "Dyeing is the process of adding color to textiles through the use of dyes, and it is an important part of home textile manufacturing as it allows for the creation of a wide range of colors and patterns in the finished products.",
    color: "#4ECDC4",
    icon: <FaPalette size={30} />,
    imageUrl: "/api/placeholder/600/400",
    tag: "Coloration"
  },
  {
    title: "DESIGN",
    description: "Designing is the process of creating a concept or plan for a product, and it is an important part of home textile manufacturing as it helps to determine the aesthetic and functional characteristics of the finished products.",
    color: "#FF9F1C",
    icon: <FaPen size={30} />,
    imageUrl: "/api/placeholder/600/400",
    tag: "Creativity"
  },
  {
    title: "PRINTING",
    description: "Printing is the process of transferring a design or pattern onto a textile using a printing medium such as ink or dye, and it is often used in home textile manufacturing to add visual interest and variety to the finished products.",
    color: "#6A0572",
    icon: <FaPrint size={30} />,
    imageUrl: "/api/placeholder/600/400",
    tag: "Patterning"
  },
  {
    title: "STITCHING",
    description: "Stitching is the process of assembling fabric pieces together to create a final product, ensuring durability and a neat finish in textile manufacturing.",
    color: "#1A535C",
    icon: <FaTshirt size={30} />,
    imageUrl: "/api/placeholder/600/400",
    tag: "Assembly"
  },
  {
    title: "EMBROIDERY",
    description: "Embroidery is the process of decorating a fabric with needle and thread by creating a design or pattern on the surface of the fabric, and it is often used in home textile manufacturing to add visual interest and variety to the finished products.",
    color: "#F46036",
    icon: <FaIndustry size={30} />,
    imageUrl: "/api/placeholder/600/400",
    tag: "Detailing"
  },
];

const Process = () => {
  const location = useLocation();
  const [activeProcess, setActiveProcess] = useState(null);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
      anchorPlacement: 'center-bottom'
    });

    // Scroll to specific section if provided in state
    if (location.state?.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setActiveProcess(location.state.scrollTo);
        }, 500);
      }
    }
  }, [location]);

  return (
    <section className="process-section py-5">
      <div className="process-gradient-bg"></div>
      <div className="process-pattern-overlay"></div>
      
      <div className="container position-relative">
        <div className="text-center mb-5" data-aos="fade-down">
          <span className="badge rounded-pill text-uppercase mb-2" style={{ background: "linear-gradient(90deg, #FF6B6B, #4ECDC4)", color: "white" }}>
            Our Expertise
          </span>
          <h1 className="display-4 fw-bold section-title">Manufacturing Excellence</h1>
          <p className="lead">Crafting premium textiles through precision and innovation</p>
          <div className="title-underline mx-auto"></div>
        </div>
        
        {/* Process Navigation */}
        <div className="process-navigation mb-5" data-aos="fade-up">
          <div className="process-nav-container">
            {processes.map((process, index) => (
              <div 
                key={`nav-${index}`}
                className={`process-nav-item ${activeProcess === process.title ? 'active' : ''}`}
                onClick={() => {
                  setActiveProcess(process.title);
                  document.getElementById(process.title).scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                style={activeProcess === process.title ? { borderColor: process.color, color: process.color } : {}}
              >
                <span className="process-nav-icon" style={activeProcess === process.title ? { color: process.color } : {}}>
                  {process.icon}
                </span>
                <span className="process-nav-title">{process.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline content */}
        <div className="timeline-container">
          <div className="timeline-line"></div>
          
          {processes.map((process, index) => (
            <div 
              id={process.title}
              className="process-card"
              key={index}
              data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}
              data-aos-delay={(index * 100).toString()}
            >
              <div className={`process-node ${activeProcess === process.title ? 'active' : ''}`} style={{ backgroundColor: process.color }}>
                <span className="process-number">{index + 1}</span>
              </div>
              
              <div className={`process-content-wrapper ${index % 2 === 0 ? 'left' : 'right'}`}>
                <div 
                  className="process-content"
                  onMouseEnter={() => setActiveProcess(process.title)}
                  style={activeProcess === process.title ? { borderColor: process.color, boxShadow: `0 10px 30px ${process.color}30` } : {}}
                >
                  <div className="process-tag" style={{ backgroundColor: process.color }}>{process.tag}</div>
                  <div className="process-header">
                    <span className="process-icon" style={{ color: process.color }}>
                      {process.icon}
                    </span>
                    <h2 className="process-title" style={{ color: process.color }}>{process.title}</h2>
                  </div>
                  
                  <div className="row align-items-center">
                    <div className="col-md-5">
                      <div className="process-image-container">
                        <img src={process.imageUrl} alt={process.title} className="process-image" />
                      </div>
                    </div>
                    <div className="col-md-7">
                      <p className="process-description">{process.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row justify-content-center mt-5" data-aos="zoom-in">
          <div className="col-md-8">
            <div className="info-card">
              <div className="info-icon">
                <FaIndustry size={30} />
              </div>
              <h3 className="info-title">Innovation in Manufacturing</h3>
              <p className="info-text">
                In addition to traditional techniques, our manufacturing incorporates advanced
                technologies like computer-aided design (CAD) and computer-aided manufacturing (CAM)
                to streamline production processes and enhance efficiency and precision.
              </p>
              <div className="info-stats">
                <div className="stat-item">
                  <span className="stat-number">25+</span>
                  <span className="stat-label">Years Experience</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">98%</span>
                  <span className="stat-label">Quality Rate</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">24/7</span>
                  <span className="stat-label">Production</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .process-section {
          background-color: #f8f9fa;
          position: relative;
          overflow: hidden;
          padding: 6rem 0;
        }
        
        .process-gradient-bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
          z-index: -2;
        }
        
        .process-pattern-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: radial-gradient(#4ECDC4 1px, transparent 1px), 
                            radial-gradient(#FF6B6B 1px, transparent 1px);
          background-size: 40px 40px;
          background-position: 0 0, 20px 20px;
          opacity: 0.05;
          z-index: -1;
        }

        .section-title {
          font-size: 2.8rem;
          margin-bottom: 1rem;
          color: #333;
          position: relative;
        }
        
        .lead {
          font-size: 1.2rem;
          color: #666;
          margin-bottom: 1.5rem;
        }
        
        .title-underline {
          height: 4px;
          width: 70px;
          background: linear-gradient(90deg, #FF6B6B, #4ECDC4);
          margin-bottom: 2rem;
          border-radius: 2px;
        }

        /* Process Navigation */
        .process-navigation {
          position: sticky;
          top: 20px;
          z-index: 10;
          margin-bottom: 3rem;
          border-radius: 100px;
          background: rgba(255, 255, 255, 0.9);
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
          backdrop-filter: blur(10px);
          overflow-x: auto;
          padding: 0.5rem;
        }
        
        .process-nav-container {
          display: flex;
          min-width: max-content;
        }
        
        .process-nav-item {
          display: flex;
          align-items: center;
          padding: 0.75rem 1.25rem;
          border-radius: 100px;
          margin: 0 0.25rem;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid transparent;
          color: #555;
        }
        
        .process-nav-item:hover {
          background: rgba(0, 0, 0, 0.03);
          transform: translateY(-2px);
        }
        
        .process-nav-item.active {
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
          transform: translateY(-2px);
        }
        
        .process-nav-icon {
          margin-right: 0.5rem;
          opacity: 0.8;
        }
        
        .process-nav-title {
          font-weight: 600;
          font-size: 0.9rem;
          letter-spacing: 0.5px;
        }

        /* Timeline */
        .timeline-container {
          position: relative;
          padding: 2rem 0;
        }
        
        .timeline-line {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 50%;
          width: 4px;
          background: linear-gradient(180deg, #FF6B6B, #4ECDC4);
          transform: translateX(-50%);
          opacity: 0.2;
          border-radius: 4px;
        }
        
        .process-card {
          position: relative;
          margin-bottom: 6rem;
          min-height: 120px;
        }
        
        .process-node {
          position: absolute;
          left: 50%;
          top: 50px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          transition: all 0.3s ease;
          box-shadow: 0 0 0 6px rgba(255, 255, 255, 0.9);
        }
        
        .process-node.active {
          transform: translateX(-50%) scale(1.2);
          box-shadow: 0 0 0 10px rgba(255, 255, 255, 0.9), 0 0 30px rgba(0, 0, 0, 0.2);
        }
        
        .process-number {
          color: white;
          font-weight: bold;
          font-size: 1.2rem;
        }
        
        .process-content-wrapper {
          position: relative;
          width: 50%;
        }
        
        .process-content-wrapper.left {
          padding-right: 60px;
          margin-left: auto;
          transform: translateX(-50%);
        }
        
        .process-content-wrapper.right {
          padding-left: 60px;
          margin-right: auto;
          transform: translateX(50%);
        }
        
        .process-content {
          position: relative;
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          border: 3px solid transparent;
          transition: all 0.4s ease;
          overflow: hidden;
        }
        
        .process-content:hover {
          transform: translateY(-5px);
        }
        
        .process-tag {
          position: absolute;
          top: 0;
          right: 0;
          padding: 0.3rem 1rem;
          color: white;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          border-radius: 0 12px 0 12px;
        }
        
        .process-header {
          display: flex;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        
        .process-icon {
          margin-right: 1rem;
        }
        
        .process-title {
          font-size: 1.6rem;
          font-weight: 700;
          margin: 0;
        }
        
        .process-image-container {
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 1rem;
        }
        
        .process-image {
          width: 100%;
          height: auto;
          transition: transform 0.5s ease;
          border-radius: 8px;
        }
        
        .process-content:hover .process-image {
          transform: scale(1.05);
        }
        
        .process-description {
          margin: 0;
          color: #666;
          line-height: 1.6;
        }
        
        .process-icon-spin {
          animation: spin 10s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Info Card */
        .info-card {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08);
          text-align: center;
          position: relative;
          overflow: hidden;
          border-top: 4px solid #4ECDC4;
        }
        
        .info-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 100%;
          background: linear-gradient(135deg, rgba(255, 107, 107, 0.03), rgba(78, 205, 196, 0.03));
          z-index: 0;
        }
        
        .info-icon {
          width: 70px;
          height: 70px;
          margin: 0 auto 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: linear-gradient(135deg, #FF6B6B, #4ECDC4);
          color: white;
        }
        
        .info-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #333;
        }
        
        .info-text {
          color: #666;
          margin-bottom: 1.5rem;
          position: relative;
          z-index: 1;
        }
        
        .info-stats {
          display: flex;
          justify-content: space-around;
          margin-top: 2rem;
          border-top: 1px solid rgba(0, 0, 0, 0.05);
          padding-top: 1.5rem;
        }
        
        .stat-item {
          text-align: center;
        }
        
        .stat-number {
          display: block;
          font-size: 2rem;
          font-weight: 700;
          color: #333;
          margin-bottom: 0.25rem;
        }
        
        .stat-label {
          font-size: 0.85rem;
          color: #777;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        /* Responsive Styles */
        @media (max-width: 991px) {
          .process-section {
            padding: 4rem 0;
          }
          
          .timeline-line {
            left: 40px;
          }
          
          .process-node {
            left: 40px;
          }
          
          .process-content-wrapper {
            width: 100%;
            padding-left: 70px !important;
            transform: none !important;
          }

          .process-content-wrapper.left,
          .process-content-wrapper.right {
            padding-right: 0;
            margin-left: 0;
            margin-right: 0;
          }
        }
        
        @media (max-width: 767px) {
          .section-title {
            font-size: 2.2rem;
          }
          
          .process-navigation {
            margin-bottom: 2rem;
          }
          
          .process-nav-item {
            padding: 0.5rem 1rem;
          }
          
          .process-content {
            padding: 1.2rem;
          }
          
          .process-title {
            font-size: 1.4rem;
          }
          
          .info-stats {
            flex-direction: column;
          }
          
          .stat-item {
            margin-bottom: 1.5rem;
          }
          
          .stat-item:last-child {
            margin-bottom: 0;
          }
        }
      `}</style>
    </section>
  );
};

export default Process;