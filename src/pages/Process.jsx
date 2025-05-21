import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaIndustry, FaPalette, FaPrint, FaTshirt, FaSpinner, FaPen, FaTools, FaEdit, FaFillDrip } from "react-icons/fa";
import { MdDesignServices, MdOutlineColorLens, MdPrecisionManufacturing } from "react-icons/md";
import { BsScissors, BsThreads } from "react-icons/bs";
import AOS from 'aos';
import 'aos/dist/aos.css';

const processes = [
  {
    title: "WEAVE",
    description: "Weaving is the process of interlacing two sets of yarns or threads at right angles to create a fabric, and it is an important part of home textile manufacturing as it transforms the yarns produced through spinning into a usable fabric.",
    color: "#FF6B6B",
    icon: <FaSpinner className="process-icon-spin" size={30} />,
    tag: "Foundation",
    illustration: (color) => (
      <div className="process-illustration weave-illustration">
        <div className="threads-container">
          {[...Array(5)].map((_, i) => (
            <div key={`v-${i}`} className="thread vertical" style={{left: `${i * 20}%`, backgroundColor: color}}></div>
          ))}
          {[...Array(5)].map((_, i) => (
            <div key={`h-${i}`} className="thread horizontal" style={{top: `${i * 20}%`, backgroundColor: color}}></div>
          ))}
        </div>
      </div>
    )
  },
  {
    title: "DYEING",
    description: "Dyeing is the process of adding color to textiles through the use of dyes, and it is an important part of home textile manufacturing as it allows for the creation of a wide range of colors and patterns in the finished products.",
    color: "#4ECDC4",
    icon: <FaPalette size={30} />,
    tag: "Coloration",
    illustration: (color) => (
      <div className="process-illustration dyeing-illustration">
        <div className="dye-container">
          <div className="dye-liquid" style={{backgroundColor: color}}></div>
          <div className="dye-bubbles">
            {[...Array(8)].map((_, i) => (
              <div 
                key={`bubble-${i}`} 
                className="bubble" 
                style={{
                  left: `${Math.random() * 90}%`,
                  top: `${Math.random() * 90}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  backgroundColor: color
                }}
              ></div>
            ))}
          </div>
          <div className="fabric-piece"></div>
        </div>
      </div>
    )
  },
  {
    title: "DESIGN",
    description: "Designing is the process of creating a concept or plan for a product, and it is an important part of home textile manufacturing as it helps to determine the aesthetic and functional characteristics of the finished products.",
    color: "#FF9F1C",
    icon: <FaPen size={30} />,
    tag: "Creativity",
    illustration: (color) => (
      <div className="process-illustration design-illustration">
        <div className="design-board">
          <div className="design-elements">
            {[...Array(3)].map((_, i) => (
              <div key={`line-${i}`} className="design-line" style={{
                width: `${40 + Math.random() * 50}%`,
                left: `${Math.random() * 30}%`,
                top: `${20 + i * 30}%`,
                backgroundColor: color
              }}></div>
            ))}
            <div className="design-circle" style={{borderColor: color}}></div>
            <div className="design-square" style={{borderColor: color}}></div>
          </div>
          <div className="design-pen" style={{backgroundColor: color}}></div>
        </div>
      </div>
    )
  },
  {
    title: "PRINTING",
    description: "Printing is the process of transferring a design or pattern onto a textile using a printing medium such as ink or dye, and it is often used in home textile manufacturing to add visual interest and variety to the finished products.",
    color: "#6A0572",
    icon: <FaPrint size={30} />,
    tag: "Patterning",
    illustration: (color) => (
      <div className="process-illustration printing-illustration">
        <div className="printer">
          <div className="printer-head" style={{backgroundColor: color}}>
            <div className="printer-light"></div>
          </div>
          <div className="printer-base">
            <div className="printer-pattern">
              {[...Array(4)].map((_, i) => (
                <div key={`pattern-${i}`} className="pattern-row">
                  {[...Array(8)].map((_, j) => (
                    <div 
                      key={`dot-${i}-${j}`} 
                      className="pattern-dot" 
                      style={{
                        opacity: Math.random() > 0.5 ? 0.8 : 0.2,
                        backgroundColor: color
                      }}
                    ></div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "STITCHING",
    description: "Stitching is the process of assembling fabric pieces together to create a final product, ensuring durability and a neat finish in textile manufacturing.",
    color: "#1A535C",
    icon: <FaTshirt size={30} />,
    tag: "Assembly",
    illustration: (color) => (
      <div className="process-illustration stitching-illustration">
        <div className="stitch-container">
          <div className="fabric-pieces">
            <div className="fabric top-piece"></div>
            <div className="fabric bottom-piece"></div>
          </div>
          <div className="stitch-line">
            {[...Array(12)].map((_, i) => (
              <div 
                key={`stitch-${i}`} 
                className="stitch" 
                style={{backgroundColor: color}}
              ></div>
            ))}
          </div>
          <div className="needle" style={{borderColor: color}}>
            <div className="needle-eye" style={{borderColor: color}}></div>
          </div>
        </div>
      </div>
    )
  },
  {
    title: "EMBROIDERY",
    description: "Embroidery is the process of decorating a fabric with needle and thread by creating a design or pattern on the surface of the fabric, and it is often used in home textile manufacturing to add visual interest and variety to the finished products.",
    color: "#F46036",
    icon: <FaIndustry size={30} />,
    tag: "Detailing",
    illustration: (color) => (
      <div className="process-illustration embroidery-illustration">
        <div className="embroidery-hoop">
          <div className="hoop-ring"></div>
          <div className="embroidery-design">
            <div className="flower-center" style={{backgroundColor: color}}></div>
            {[...Array(8)].map((_, i) => (
              <div 
                key={`petal-${i}`}
                className="flower-petal" 
                style={{
                  transform: `rotate(${i * 45}deg)`,
                  backgroundColor: color
                }}
              ></div>
            ))}
            <div className="embroidery-stitch horizontal" style={{backgroundColor: color}}></div>
            <div className="embroidery-stitch vertical" style={{backgroundColor: color}}></div>
          </div>
        </div>
      </div>
    )
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
                      {/* Replace image with SVG illustration */}
                      {process.illustration(process.color)}
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

        /* Process Illustrations */
        .process-illustration {
          height: 180px;
          width: 100%;
          background-color: #f8f9fa;
          border-radius: 12px;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
          box-shadow: inset 0 0 10px rgba(0,0,0,0.05);
        }

        /* Weave Illustration */
        .weave-illustration .threads-container {
          position: relative;
          width: 90%;
          height: 80%;
          overflow: hidden;
        }

        .thread {
          position: absolute;
          border-radius: 2px;
        }

        .thread.vertical {
          width: 6px;
          height: 100%;
          animation: weaveVertical 3s infinite ease-in-out;
        }

        .thread.horizontal {
          width: 100%;
          height: 6px;
          animation: weaveHorizontal 3s infinite ease-in-out;
        }

        @keyframes weaveVertical {
          0%, 100% { transform: translateY(-5px); }
          50% { transform: translateY(5px); }
        }

        @keyframes weaveHorizontal {
          0%, 100% { transform: translateX(-5px); }
          50% { transform: translateX(5px); }
        }

        /* Dyeing Illustration */
        .dye-container {
          width: 90%;
          height: 80%;
          position: relative;
          overflow: hidden;
          border-radius: 8px;
          border: 2px solid #ddd;
        }

        .dye-liquid {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 70%;
          opacity: 0.7;
          animation: boil 2s infinite ease-in-out;
        }

        .bubble {
          position: absolute;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          opacity: 0.6;
          animation: bubbleRise 3s infinite ease-out;
        }

        .fabric-piece {
          position: absolute;
          width: 80%;
          height: 20px;
          top: 40%;
          left: 10%;
          background-color: #fff;
          border-radius: 3px;
          animation: dip 2s infinite ease-in-out;
        }

        @keyframes boil {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }

        @keyframes bubbleRise {
          0% { transform: translateY(0) scale(1); opacity: 0.6; }
          100% { transform: translateY(-60px) scale(0); opacity: 0; }
        }

        @keyframes dip {
          0%, 100% { transform: translateY(0) rotate(1deg); }
          50% { transform: translateY(5px) rotate(-1deg); }
        }

        /* Design Illustration */
        .design-board {
          width: 90%;
          height: 80%;
          background-color: white;
          position: relative;
          border-radius: 4px;
          box-shadow: 0 3px 10px rgba(0,0,0,0.1);
        }

        .design-elements {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .design-line {
          position: absolute;
          height: 3px;
          border-radius: 4px;
        }

        .design-circle {
          position: absolute;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 2px solid;
          top: 35%;
          right: 20%;
          animation: pulse 2s infinite ease-in-out;
        }

        .design-square {
          position: absolute;
          width: 25px;
          height: 25px;
          border: 2px solid;
          bottom: 25%;
          right: 30%;
          animation: rotate 4s infinite linear;
        }

        .design-pen {
          position: absolute;
          width: 4px;
          height: 20px;
          bottom: 10%;
          right: 10%;
          border-radius: 1px;
          transform: rotate(-45deg);
          animation: draw 3s infinite ease-in-out;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes draw {
          0%, 100% { transform: translate(0, 0) rotate(-45deg); }
          50% { transform: translate(-20px, -20px) rotate(-45deg); }
        }

        /* Printing Illustration */
        .printer {
          width: 90%;
          height: 80%;
          position: relative;
        }

        .printer-head {
          position: absolute;
          top: 0;
          left: 10%;
          width: 80%;
          height: 15px;
          border-radius: 4px;
          animation: printHead 3s infinite ease-in-out;
        }

        .printer-light {
          position: absolute;
          bottom: 5px;
          left: 10px;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background-color: rgba(255,255,255,0.8);
          animation: blink 1s infinite;
        }

        .printer-base {
          position: absolute;
          top: 20px;
          left: 0;
          width: 100%;
          height: calc(100% - 20px);
          background-color: #f0f0f0;
          border-radius: 4px;
          overflow: hidden;
        }

        .printer-pattern {
          position: absolute;
          top: 10px;
          left: 10px;
          width: calc(100% - 20px);
          height: calc(100% - 20px);
          display: flex;
          flex-direction: column;
          justify-content: space-around;
        }

        .pattern-row {
          display: flex;
          justify-content: space-around;
        }

        .pattern-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        @keyframes printHead {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(calc(100% - 15px)); }
        }

        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }

        /* Stitching Illustration */
        .stitch-container {
          width: 90%;
          height: 80%;
          position: relative;
        }

        .fabric-pieces {
          position: absolute;
          width: 100%;
          height: 100%;
        }

        .fabric {
          position: absolute;
          height: 40%;
          width: 80%;
          left: 10%;
          background-color: #f5f5f5;
          border-radius: 3px;
        }

        .top-piece {
          top: 10%;
        }

        .bottom-piece {
          bottom: 10%;
        }

        .stitch-line {
          position: absolute;
          top: 50%;
          left: 10%;
          width: 80%;
          height: 2px;
          transform: translateY(-50%);
          display: flex;
          justify-content: space-between;
        }

        .stitch {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          animation: stitchPulse 2s infinite;
        }

        .needle {
          position: absolute;
          top: 50%;
          right: 20%;
          width: 2px;
          height: 20px;
          border-left: 2px solid;
          transform: translateY(-50%);
          animation: needleMove 1.5s infinite ease-in-out;
        }

        .needle-eye {
          position: absolute;
          top: 5px;
          left: -4px;
          width: 6px;
          height: 3px;
          border: 1px solid;
          border-radius: 3px;
        }

        @keyframes stitchPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @keyframes needleMove {
          0%, 100% { transform: translateY(-50%); }
          50% { transform: translateY(-20px); }
        }

        /* Embroidery Illustration */
        .embroidery-hoop {
          width: 80%;
          height: 80%;
          position: relative;
          border: 8px solid #ddbea9;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hoop-ring {
          position: absolute;
          width: 88%;
          height: 88%;
          border: 3px solid #b38b6d;
          border-radius: 50%;
        }

        .embroidery-design {
          width: 70%;
          height: 70%;
          position: relative;
        }

        .flower-center {
          position: absolute;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .flower-petal {
          position: absolute;
          width: 8px;
          height: 30px;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform-origin: center bottom;
          animation: sway 4s infinite ease-in-out;
        }

        .embroidery-stitch {
          position: absolute;
          background-color: #ff6b6b;
        }

        .embroidery-stitch.horizontal {
          width: 50%;
          height: 2px;
          top: 30%;
          left: 25%;
        }

        .embroidery-stitch.vertical {
          width: 2px;
          height: 40%;
          top: 40%;
          left: 50%;
          transform: translateX(-50%);
        }

        @keyframes sway {
          0%, 100% { transform-origin: center bottom; transform: rotate(var(--rotation)) translateY(0); }
          50% { transform-origin: center bottom; transform: rotate(var(--rotation)) translateY(-2px); }
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