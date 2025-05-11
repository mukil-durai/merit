import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../css/infra.css";
// Import all images
import infrastructure1 from '../assets/infra/infrastructure-1.jpg';
import infrastructure2 from '../assets/infra/infrastructure-2.jpg';
import infrastructure3 from '../assets/infra/infrastructure-3.jpg';
import infrastructure4 from '../assets/infra/infrastructure-4.jpg';
import infrastructure5 from '../assets/infra/infrastructure-5.jpg';
import infrastructure6 from '../assets/infra/infrastructure-6.jpg';
import infrastructure7 from '../assets/infra/infrastructure-7.jpg';
import infrastructure8 from '../assets/infra/infrastructure-8.jpg';
import infrastructure9 from '../assets/infra/infrastructure-9.jpg';

// Enhanced data with more details for modal
const infrastructureItems = [
  {
    title: "Manufacturing Unit",
    description: "State-of-the-art manufacturing facility with modern equipment",
    image: infrastructure1,
    category: "Production",
    icon: "bi-gear-fill",
    detailedDescription: "Our manufacturing unit is equipped with the latest machinery to handle all aspects of textile production. From cutting to finishing, every process is optimized for maximum efficiency and quality. The facility operates 24/7 with three shifts to ensure timely delivery of all orders.",
    specifications: [
      "Area: 8,000 sq. ft",
      "Capacity: 5,000 units per day",
      "Equipment: Automatic cutting machines, industrial sewing units",
      "Staff: 50 skilled operators"
    ],
    galleryImages: [infrastructure1, infrastructure4, infrastructure7]
  },
  {
    title: "Sewing Department",
    description: "Advanced sewing machines operated by skilled professionals",
    image: infrastructure2,
    category: "Production",
    icon: "bi-scissors",
    detailedDescription: "The heart of our production lies in our sewing department, where experienced tailors and seamstresses work with precision and care. Using industrial-grade sewing machines, our team can handle a wide variety of fabrics and designs.",
    specifications: [
      "Area: 5,000 sq. ft",
      "Machines: 75 industrial sewing machines",
      "Specialties: Fine stitching, embroidery, overlocking",
      "Staff: 80 professional tailors"
    ],
    galleryImages: [infrastructure2, infrastructure5, infrastructure8]
  },
  {
    title: "Quality Control",
    description: "Dedicated quality testing and inspection area",
    image: infrastructure3,
    category: "Quality",
    icon: "bi-check-circle-fill",
    detailedDescription: "Our quality control department ensures that every product meets our rigorous standards before it leaves our facility. Each item undergoes multiple inspection points throughout the production process, with a final comprehensive check before packaging.",
    specifications: [
      "Area: 1,500 sq. ft",
      "Testing equipment: Fabric strength testers, color fastness analyzers",
      "Process: 4-point inspection system",
      "Staff: 15 quality assurance specialists"
    ],
    galleryImages: [infrastructure3, infrastructure6, infrastructure9]
  },
  {
    title: "Design Studio",
    description: "Creative space for designing and pattern making",
    image: infrastructure4,
    category: "Design",
    icon: "bi-pencil-fill",
    detailedDescription: "Our design studio is where creativity meets craftsmanship. Our team of designers work with the latest software and equipment to create innovative patterns and designs. The studio features digital design tools as well as traditional drafting tables.",
    specifications: [
      "Area: 2,000 sq. ft",
      "Equipment: CAD software, digital pattern makers, 3D visualization tools",
      "Library: Extensive fabric and design reference collection",
      "Staff: 12 designers and pattern makers"
    ],
    galleryImages: [infrastructure4, infrastructure7, infrastructure1]
  },
  {
    title: "Warehouse",
    description: "Spacious storage facility for raw materials and finished goods",
    image: infrastructure5,
    category: "Storage",
    icon: "bi-box-seam-fill",
    detailedDescription: "Our climate-controlled warehouse ensures that all materials and finished products are stored in optimal conditions. With an advanced inventory management system, we can track every item from arrival to dispatch with precision.",
    specifications: [
      "Area: 6,000 sq. ft",
      "Capacity: 10,000 finished units and raw materials for 30 days production",
      "Features: Temperature and humidity control, fire suppression system",
      "Systems: RFID-based inventory tracking"
    ],
    galleryImages: [infrastructure5, infrastructure8, infrastructure2]
  },
  {
    title: "Packaging Unit",
    description: "Modern packaging facility ensuring product safety",
    image: infrastructure6,
    category: "Logistics",
    icon: "bi-box-fill",
    detailedDescription: "The packaging unit is designed to protect our products during transit while presenting them attractively to the end customer. We use eco-friendly packaging materials wherever possible, aligning with our sustainability goals.",
    specifications: [
      "Area: 2,500 sq. ft",
      "Materials: Recyclable cartons, biodegradable plastics",
      "Equipment: Automatic packaging machines, labeling systems",
      "Capacity: 6,000 units per day"
    ],
    galleryImages: [infrastructure6, infrastructure9, infrastructure3]
  },
  {
    title: "Research Lab",
    description: "Innovation center for textile research and development",
    image: infrastructure7,
    category: "R&D",
    icon: "bi-lightbulb-fill",
    detailedDescription: "Our R&D lab is where we explore new materials, techniques, and processes to stay at the forefront of textile innovation. The team works on developing sustainable fabrics, improving production methods, and creating new product lines.",
    specifications: [
      "Area: 1,800 sq. ft",
      "Equipment: Material testing apparatus, fabric analyzers, prototype development tools",
      "Projects: Sustainable fabrics, smart textiles, eco-friendly dyes",
      "Staff: 8 researchers and textile engineers"
    ],
    galleryImages: [infrastructure7, infrastructure1, infrastructure4]
  },
  {
    title: "Training Center",
    description: "Facility for employee skill development and training",
    image: infrastructure8,
    category: "Training",
    icon: "bi-people-fill",
    detailedDescription: "We believe in continuous learning and improvement. Our training center provides regular skill development sessions for all employees, from new techniques to safety protocols. We also run apprenticeship programs for new talent in the industry.",
    specifications: [
      "Area: 1,200 sq. ft",
      "Facilities: Training workshop, classroom, digital learning stations",
      "Programs: New employee orientation, skill enhancement, leadership development",
      "Capacity: 30 trainees simultaneously"
    ],
    galleryImages: [infrastructure8, infrastructure2, infrastructure5]
  },
  {
    title: "Admin Office",
    description: "Modern office space for administrative operations",
    image: infrastructure9,
    category: "Administration",
    icon: "bi-building",
    detailedDescription: "Our administrative office houses departments like finance, HR, marketing, and sales. The modern workspace is designed to foster collaboration while providing comfortable individual workstations for focused tasks.",
    specifications: [
      "Area: 3,000 sq. ft",
      "Facilities: Conference rooms, collaborative spaces, individual workstations",
      "Departments: HR, Finance, Marketing, Customer Service",
      "Staff: 25 administrative professionals"
    ],
    galleryImages: [infrastructure9, infrastructure3, infrastructure6]
  }
];

const Infrastructure = () => {
  const [filter, setFilter] = useState('All');
  const [filteredItems, setFilteredItems] = useState(infrastructureItems);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const categories = ['All', ...new Set(infrastructureItems.map(item => item.category))];
  
  // Simulate loading effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Filter items when filter changes
  useEffect(() => {
    setFilteredItems(
      filter === 'All' 
        ? infrastructureItems 
        : infrastructureItems.filter(item => item.category === filter)
    );
  }, [filter]);
  
  const openModal = (item) => {
    setSelectedItem(item);
    setActiveImageIndex(0);
    // Use vanilla JS to open Bootstrap modal
    const modalElement = document.getElementById('infrastructureModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  };
  
  const changeImage = (direction) => {
    if (!selectedItem) return;
    
    const imageCount = selectedItem.galleryImages.length;
    if (direction === 'next') {
      setActiveImageIndex((activeImageIndex + 1) % imageCount);
    } else {
      setActiveImageIndex((activeImageIndex - 1 + imageCount) % imageCount);
    }
  };

  return (
    <div className="container-fluid py-5 bg-light mt-5">
      <div className="container">
        <div className="text-center mb-5" data-aos="fade-up">
          <h2 className="display-5 fw-bold position-relative d-inline-block mb-4">
            <span className="position-relative z-1">OUR INFRASTRUCTURE</span>
            <span className="position-absolute bg-warning w-100" style={{ height: '8px', bottom: '0', left: '0', zIndex: '0', opacity: '0.4' }}></span>
          </h2>
          <p className="text-secondary col-lg-8 mx-auto lead">
            Our state-of-the-art facility spans 25,000 square feet, featuring advanced machinery
            and specialized departments dedicated to creating premium textile products.
            Each section is optimized for efficiency and quality assurance.
          </p>
        </div>
        
        {/* Category Filter Buttons */}
        <div className="d-flex justify-content-center flex-wrap mb-5 gap-2" data-aos="fade-up">
          {categories.map(category => (
            <button 
              key={category} 
              className={`btn ${filter === category ? 'btn-warning' : 'btn-outline-dark'} rounded-pill px-4 py-2 shadow-sm`}
              onClick={() => setFilter(category)}
            >
              {category === 'All' && <i className="bi bi-grid-3x3-gap-fill me-2"></i>}
              {category === 'Production' && <i className="bi bi-gear-fill me-2"></i>}
              {category === 'Quality' && <i className="bi bi-check-circle-fill me-2"></i>}
              {category === 'Design' && <i className="bi bi-pencil-fill me-2"></i>}
              {category === 'Storage' && <i className="bi bi-box-seam-fill me-2"></i>}
              {category === 'Logistics' && <i className="bi bi-box-fill me-2"></i>}
              {category === 'R&D' && <i className="bi bi-lightbulb-fill me-2"></i>}
              {category === 'Training' && <i className="bi bi-people-fill me-2"></i>}
              {category === 'Administration' && <i className="bi bi-building me-2"></i>}
              {category}
            </button>
          ))}
        </div>

        {/* Loading Spinner */}
        {isLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading infrastructure facilities...</p>
          </div>
        ) : (
          <div className="row g-4 justify-content-center">
            {filteredItems.map((item, index) => (
              <div 
                key={index} 
                className="col-12 col-sm-6 col-lg-4"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="card h-100 infra-card shadow border-0 hover-shadow">
                  <div className="position-relative overflow-hidden">
                    <div className="position-absolute top-0 start-0 bg-warning text-dark m-3 py-1 px-3 rounded-pill fw-bold z-1">
                      <i className={`bi ${item.icon} me-2`}></i>
                      {item.category}
                    </div>
                    <img
                      src={item.image}
                      alt={item.title}
                      className="card-img-top img-fluid"
                      style={{ height: '250px', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                    />
                    <div className="card-img-overlay d-flex align-items-end p-0">
                      <div className="bg-dark bg-opacity-75 p-3 w-100 text-white">
                        <h5 className="card-title fw-bold mb-0">{item.title}</h5>
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-3">
                      <div className="rounded-circle bg-warning text-white d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px' }}>
                        <i className={`bi ${item.icon} fs-4`}></i>
                      </div>
                      <h5 className="card-title fw-bold text-dark mb-0">{item.title}</h5>
                    </div>
                    <p className="card-text text-secondary">{item.description}</p>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <button 
                        className="btn btn-warning rounded-pill"
                        onClick={() => openModal(item)}
                      >
                        View Details <i className="bi bi-arrow-right ms-1"></i>
                      </button>
                      <span className="badge bg-light text-dark rounded-pill">
                        <i className="bi bi-geo-alt me-1"></i> Facility {index + 1}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results Message */}
        {filteredItems.length === 0 && !isLoading && (
          <div className="text-center py-5">
            <i className="bi bi-exclamation-circle text-warning" style={{ fontSize: '3rem' }}></i>
            <h4 className="mt-3">No facilities found in this category</h4>
            <p className="text-muted">Try selecting a different category filter</p>
            <button className="btn btn-outline-warning mt-3" onClick={() => setFilter('All')}>
              View All Facilities
            </button>
          </div>
        )}

        {/* Call-to-Action Section */}
        <div className="row mt-5 pt-5" data-aos="fade-up">
          <div className="col-12">
            <div className="bg-primary text-white p-5 rounded-4 shadow position-relative overflow-hidden">
              <div className="row align-items-center">
                <div className="col-lg-8">
                  <h3 className="fw-bold mb-3">Want to see our infrastructure in person?</h3>
                  <p className="mb-4">
                    Schedule a guided tour of our facilities and see our advanced machinery and processes in action.
                    Our experts will be happy to show you around and answer any questions.
                  </p>
                  <div className="d-flex flex-wrap gap-2">
                    <button className="btn btn-warning btn-lg rounded-pill">
                      <i className="bi bi-calendar-check me-2"></i> Schedule a Tour
                    </button>
                    <button className="btn btn-outline-light btn-lg rounded-pill">
                      <i className="bi bi-telephone me-2"></i> Contact Us
                    </button>
                  </div>
                </div>
                <div className="col-lg-4 d-none d-lg-block text-end">
                  <i className="bi bi-building-check text-white opacity-25" style={{ fontSize: '180px' }}></i>
                </div>
              </div>
              <div className="position-absolute top-0 end-0 mt-3 me-3">
                <span className="badge bg-warning text-dark rounded-pill px-3 py-2">
                  <i className="bi bi-stars me-1"></i> Virtual Tours Available
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Modal for Item Details */}
      <div className="modal fade" id="infrastructureModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content border-0 shadow">
            {selectedItem && (
              <>
                <div className="modal-header bg-primary text-white">
                  <h5 className="modal-title fw-bold">
                    <i className={`bi ${selectedItem.icon} me-2`}></i>
                    {selectedItem.title} Details
                  </h5>
                  <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body p-0">
                  <div className="row g-0">
                    <div className="col-lg-7 position-relative">
                      {/* Image Carousel */}
                      <div id="facilityImageCarousel" className="carousel slide h-100" data-bs-ride="carousel">
                        <div className="carousel-indicators">
                          {selectedItem.galleryImages.map((_, idx) => (
                            <button 
                              key={idx}
                              type="button" 
                              data-bs-target="#facilityImageCarousel" 
                              data-bs-slide-to={idx} 
                              className={idx === activeImageIndex ? "active" : ""}
                              aria-current={idx === activeImageIndex ? "true" : "false"}
                              aria-label={`Slide ${idx + 1}`}
                              onClick={() => setActiveImageIndex(idx)}
                            ></button>
                          ))}
                        </div>
                        <div className="carousel-inner h-100">
                          {selectedItem.galleryImages.map((img, idx) => (
                            <div 
                              key={idx} 
                              className={`carousel-item ${idx === activeImageIndex ? "active" : ""} h-100`}
                            >
                              <img 
                                src={img} 
                                className="d-block w-100 h-100" 
                                style={{ objectFit: 'cover' }} 
                                alt={`${selectedItem.title} view ${idx + 1}`} 
                              />
                            </div>
                          ))}
                        </div>
                        <button className="carousel-control-prev" type="button" onClick={() => changeImage('prev')}>
                          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                          <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button" onClick={() => changeImage('next')}>
                          <span className="carousel-control-next-icon" aria-hidden="true"></span>
                          <span className="visually-hidden">Next</span>
                        </button>
                      </div>
                      
                      {/* Image Navigation Thumbnails */}
                      <div className="position-absolute bottom-0 start-0 end-0 p-3 bg-dark bg-opacity-50">
                        <div className="d-flex justify-content-center gap-2">
                          {selectedItem.galleryImages.map((img, idx) => (
                            <div 
                              key={idx} 
                              className={`thumbnail-container ${idx === activeImageIndex ? "active-thumbnail" : ""}`}
                              onClick={() => setActiveImageIndex(idx)}
                              style={{
                                width: '60px',
                                height: '40px',
                                cursor: 'pointer',
                                border: idx === activeImageIndex ? '2px solid white' : '1px solid rgba(255,255,255,0.5)',
                                overflow: 'hidden'
                              }}
                            >
                              <img 
                                src={img} 
                                className="w-100 h-100" 
                                style={{ objectFit: 'cover' }} 
                                alt={`Thumbnail ${idx + 1}`} 
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-5 p-4">
                      <div className="mb-4">
                        <div className="d-flex align-items-center mb-3">
                          <div className="rounded-circle bg-warning text-white d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                            <i className={`bi ${selectedItem.icon}`}></i>
                          </div>
                          <h4 className="fw-bold mb-0">{selectedItem.title}</h4>
                        </div>
                        <span className="badge bg-warning text-dark mb-3">
                          {selectedItem.category}
                        </span>
                        <p className="mb-4">{selectedItem.detailedDescription}</p>
                      </div>
                      
                      <div className="mb-4">
                        <h5 className="border-bottom pb-2 mb-3">Specifications</h5>
                        <ul className="list-group list-group-flush">
                          {selectedItem.specifications.map((spec, idx) => (
                            <li key={idx} className="list-group-item px-0 d-flex">
                              <i className="bi bi-check-circle-fill text-success me-2 mt-1"></i>
                              <span>{spec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="mb-4">
                        <h5 className="border-bottom pb-2 mb-3">Key Features</h5>
                        <div className="row g-2">
                          <div className="col-6">
                            <div className="d-flex align-items-center p-2 bg-light rounded">
                              <i className="bi bi-stars text-warning me-2"></i>
                              <span>Modern Equipment</span>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="d-flex align-items-center p-2 bg-light rounded">
                              <i className="bi bi-people-fill text-warning me-2"></i>
                              <span>Skilled Staff</span>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="d-flex align-items-center p-2 bg-light rounded">
                              <i className="bi bi-shield-check text-warning me-2"></i>
                              <span>Safety Protocols</span>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="d-flex align-items-center p-2 bg-light rounded">
                              <i className="bi bi-graph-up text-warning me-2"></i>
                              <span>High Efficiency</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="d-grid gap-2">
                        <button className="btn btn-primary">
                          <i className="bi bi-calendar-check me-2"></i> Schedule a Visit
                        </button>
                        <button className="btn btn-outline-primary">
                          <i className="bi bi-download me-2"></i> Download Specifications
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer bg-light">
                  <div className="d-flex justify-content-between w-100 align-items-center">
                    <div>
                      <span className="text-muted">
                        <i className="bi bi-geo-alt me-1"></i> Main Facility
                      </span>
                    </div>
                    <div>
                      <a href="#" className="btn btn-sm btn-outline-primary me-2">
                        <i className="bi bi-share me-1"></i> Share
                      </a>
                      <button type="button" className="btn btn-sm btn-warning" data-bs-dismiss="modal">
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Add this to your CSS file (infra.css)
/*
.hover-shadow:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
  transition: all 0.3s ease;
}

.hover-shadow:hover img {
  transform: scale(1.05);
}

.hover-shadow {
  transition: all 0.3s ease;
}

.carousel-item {
  height: 500px;
}

.active-thumbnail {
  transform: scale(1.1);
  box-shadow: 0 0 10px rgba(255,255,255,0.8);
}
*/

export default Infrastructure;