import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../pages/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const Account = () => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [validationErrors, setValidationErrors] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear validation errors when typing
    setValidationErrors({
      ...validationErrors,
      [name]: ""
    });
    if (name === "email") setEmailError("");
    setError("");
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Please enter your name";
    if (!formData.email.trim()) errors.email = "Please enter your email";
    if (!formData.password.trim()) errors.password = "Please enter your password";
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:5001/account", formData);
      const { token, user } = response.data;

      // Store in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      login({ token, user }); // Pass both token and user data to context

      alert("User registered successfully");
      navigate("/home"); // Redirect after sign-up
    } catch (error) {
      if (error.response) {
        if (error.response.status === 409) {
          setEmailError("Email already exists. Please use a new email.");
        } else {
          setError("Error registering user. Please try again.");
        }
      } else {
        setError("Network error. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg p-4 w-50">
        <h2 className="text-center mb-4">Sign Up</h2>
        <form onSubmit={handleSubmit}>
          {/* Name Field */}
          <div className="mb-3">
            <label className="form-label">Name</label>
            <div className="input-group">
              <span className="input-group-text"><FaUser /></span>
              <input
                type="text"
                name="name"
                className={`form-control ${validationErrors.name ? 'is-invalid' : ''}`}
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            {validationErrors.name && <div className="invalid-feedback d-block">{validationErrors.name}</div>}
          </div>

          {/* Email Field */}
          <div className="mb-3">
            <label className="form-label">Email</label>
            <div className="input-group">
              <span className="input-group-text"><FaEnvelope /></span>
              <input
                type="email"
                name="email"
                className={`form-control ${validationErrors.email ? 'is-invalid' : ''}`}
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            {validationErrors.email && <div className="invalid-feedback d-block">{validationErrors.email}</div>}
            {emailError && <div className="text-danger mt-1">{emailError}</div>}
          </div>

          {/* Password Field */}
          <div className="mb-3">
            <label className="form-label">Password</label>
            <div className="input-group">
              <span className="input-group-text"><FaLock /></span>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className={`form-control ${validationErrors.password ? 'is-invalid' : ''}`}
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {validationErrors.password && <div className="invalid-feedback d-block">{validationErrors.password}</div>}
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <button type="submit" className="btn btn-warning w-100" disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center mt-3">
          Already have an account? <a href="/Signin" className="text-primary">Sign In</a>
        </p>
      </div>
    </div>
  );
};

export default Account;
