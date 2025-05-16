import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Add Bootstrap JS
import "bootstrap-icons/font/bootstrap-icons.css";
import logo from "../assets/logo.png";
import { FaHome, FaShoppingCart, FaUserCircle, FaUserPlus, FaPhone } from "react-icons/fa";
import { BsShop, BsBuilding } from "react-icons/bs";
import { MdOutlineWorkOutline } from "react-icons/md";
import { AuthContext } from "../pages/AuthContext";
import { CartContext } from "../components/Cartcontext";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const cartItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const getProfileImage = () => {
    if (user?.profilePic && typeof user.profilePic === "string") {
      return (
        <div className="profile-image-container">
          <img
            src={user.profilePic}
            alt={user.name || "Profile"}
            className="rounded-circle border border-2 border-white shadow-sm"
            style={{
              width: "32px",
              height: "32px",
              objectFit: "cover",
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/32"; // Fallback image
            }}
          />
        </div>
      );
    }
    return <FaUserCircle size={24} />;
  };

  // Add this useEffect to handle mobile navbar closing when links are clicked
  useEffect(() => {
    const handleNavLinkClick = () => {
      // Get the navbar collapse element and navbar toggler
      const navbarCollapse = document.getElementById('navbarNav');
      const navbarToggler = document.querySelector('.navbar-toggler');
      
      // If we're on mobile view and the navbar is expanded
      if (window.innerWidth < 992 && navbarCollapse && 
          navbarCollapse.classList.contains('show') && navbarToggler) {
        navbarToggler.click(); // Programmatically click the toggler to close the menu
      }
    };

    // Add click event listeners to ALL links in the navbar, including auth and cart links
    const allNavLinks = document.querySelectorAll('#navbarNav a, #navbarNav button, .navbar-brand');
    allNavLinks.forEach(link => {
      link.addEventListener('click', handleNavLinkClick);
    });

    // Clean up the event listeners on component unmount
    return () => {
      allNavLinks.forEach(link => {
        link.removeEventListener('click', handleNavLinkClick);
      });
    };
  }, []);

  return (
    <nav className="navbar navbar-expand-lg bg-warning fixed-top">
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img src={logo} alt="Logo" height="50" className="me-2" />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Adjusted nav classes for better mobile layout */}
          <ul className="navbar-nav mx-auto fw-bold gap-lg-4">
            <li className="nav-item me-lg-4 mb-2 mb-lg-0">
              <Link className="nav-link d-flex align-items-center" to="/Home">
                <FaHome className="me-2" /> Home
              </Link>
            </li>
            <li className="nav-item me-lg-4 mb-2 mb-lg-0">
              <Link className="nav-link d-flex align-items-center" to="/process">
                <MdOutlineWorkOutline className="me-2" /> Process
              </Link>
            </li>
            <li className="nav-item me-lg-4 mb-2 mb-lg-0">
              <Link className="nav-link d-flex align-items-center" to="/infrastructure">
                <BsBuilding className="me-2" /> Infrastructure
              </Link>
            </li>

            <li className="nav-item dropdown me-lg-4 mb-2 mb-lg-0">
              <a
                className="nav-link dropdown-toggle d-flex align-items-center"
                href="#"
                id="catlogDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <BsShop className="me-2" /> Shopping
              </a>
              <ul className="dropdown-menu bg-warning border-0">
                <li>
                  <Link className="dropdown-item" to="/catlog/kitchen">
                    Kitchen
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/catlog/living">
                    Living
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/catlog/table">
                    Table
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/catlog/linen">
                    Linen
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/catlog/baby">
                    Baby
                  </Link>
                </li>
              </ul>
            </li>

            <li className="nav-item me-lg-4 mb-2 mb-lg-0">
              <Link className="nav-link d-flex align-items-center" to="/contact">
                <FaPhone className="me-2" /> Contact Us
              </Link>
            </li>
          </ul>

          {/* Improved auth section for mobile */}
          <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center mt-3 mt-lg-0">
            {!isAuthenticated ? (
              <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center w-100">
                <Link className="nav-link d-flex align-items-center mb-2 mb-lg-0" to="/Signin">
                  <FaUserCircle className="me-2" /> Sign In
                </Link>

                <Link
                  to="/Account"
                  className="btn fw-bold text-white ms-0 ms-lg-3 mt-2 mt-lg-0"
                  style={{ backgroundColor: "#6f42c1", borderColor: "#6f42c1" }}
                >
                  <FaUserPlus className="me-2" /> Create an Account
                </Link>
              </div>
            ) : (
              <div className="dropdown mb-3 mb-lg-0 w-100">
                <button
                  className="btn btn-warning dropdown-toggle d-flex align-items-center gap-2"
                  type="button"
                  id="profileDropdown"
                  data-bs-toggle="dropdown"
                >
                  {getProfileImage()}
                  <span className="ms-2">{user?.name || "Profile"}</span>
                </button>
                <ul className="dropdown-menu bg-warning border-0">
                  <li>
                    <Link className="dropdown-item" to="/Profile">
                      My Profile
                    </Link>
                  </li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}

            <Link to="/cart" className="position-relative ms-0 ms-lg-3 mt-2 mt-lg-0 text-decoration-none">
              <FaShoppingCart size={24} />
              {cartItemCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge bg-danger">
                  {cartItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;