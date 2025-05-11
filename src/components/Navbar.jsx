import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
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
    if (user?.profilePic) {
      return (
        <div className="profile-image-container">
          <img
            src={user.profilePic}
            alt={user.name}
            className="rounded-circle border border-2 border-white shadow-sm"
            style={{
              width: "32px",
              height: "32px",
              objectFit: "cover",
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://via.placeholder.com/32";
            }}
          />
        </div>
      );
    }
    return <FaUserCircle size={24} />;
  };

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
          <ul className="navbar-nav mx-auto fw-bold gap-4">
            <li className="nav-item me-4">
              <Link className="nav-link d-flex align-items-center" to="/Home">
                <FaHome className="me-2" /> Home
              </Link>
            </li>
            <li className="nav-item me-4">
              <Link className="nav-link d-flex align-items-center" to="/process">
                <MdOutlineWorkOutline className="me-2" /> Process
              </Link>
            </li>
            <li className="nav-item me-4">
              <Link className="nav-link d-flex align-items-center" to="/infrastructure">
                <BsBuilding className="me-2" /> Infrastructure
              </Link>
            </li>

            <li className="nav-item dropdown me-4">
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

            <li className="nav-item me-4">
              <Link className="nav-link d-flex align-items-center" to="/contact">
                <FaPhone className="me-2" /> Contact Us
              </Link>
            </li>
          </ul>

          <div className="d-flex align-items-center">
            {!isAuthenticated ? (
              <>
                <Link className="nav-link d-flex align-items-center" to="/Signin">
                  <FaUserCircle className="me-2" /> Sign In
                </Link>

                <Link
                  to="/Account"
                  className="btn fw-bold text-white ms-3"
                  style={{ backgroundColor: "#6f42c1", borderColor: "#6f42c1" }}
                >
                  <FaUserPlus className="me-2" /> Create an Account
                </Link>
              </>
            ) : (
              <div className="dropdown">
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

            <Link to="/cart" className="position-relative ms-3 text-decoration-none">
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