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
    
    // Validate fields on change
    const newErrors = { ...validationErrors };
    
    if (name === "name") {
      if (!value.trim()) {
        newErrors.name = "Please enter your name";
      } else if (value.length < 2) {
        newErrors.name = "Name must be at least 2 characters long";
      } else if (!/^[a-zA-Z\s]+$/.test(value)) {
        newErrors.name = "Name should only contain letters and spaces";
      } else {
        newErrors.name = "";
      }
    }
    
    if (name === "email") {
      if (!value.trim()) {
        newErrors.email = "Please enter your email";
      } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
        newErrors.email = "Please enter a valid email address";
      } else {
        newErrors.email = "";
      }
      setEmailError("");
    }
    
    if (name === "password") {
      if (!value.trim()) {
        newErrors.password = "Please enter your password";
      } else if (value.length < 8) {
        newErrors.password = "Password must be at least 8 characters long";
      } else if (!/(?=.*[a-z])(?=.*[A-Z])/.test(value)) {
        newErrors.password = "Password must contain both uppercase and lowercase letters";
      } else if (!/(?=.*\d)/.test(value)) {
        newErrors.password = "Password must contain at least one number";
      } else if (!/(?=.*[@$!%*?&])/.test(value)) {
        newErrors.password = "Password must contain at least one special character (@$!%*?&)";
      } else {
        newErrors.password = "";
      }
    }
    
    setValidationErrors(newErrors);
    setError("");
  };

  const validateForm = () => {
    const errors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      errors.name = "Please enter your name";
    } else if (formData.name.length < 2) {
      errors.name = "Name must be at least 2 characters long";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      errors.name = "Name should only contain letters and spaces";
    }
    
    // Email validation
    if (!formData.email.trim()) {
      errors.email = "Please enter your email";
    } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    // Password validation
    if (!formData.password.trim()) {
      errors.password = "Please enter your password";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters long";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])/.test(formData.password)) {
      errors.password = "Password must contain both uppercase and lowercase letters";
    } else if (!/(?=.*\d)/.test(formData.password)) {
      errors.password = "Password must contain at least one number";
    } else if (!/(?=.*[@$!%*?&])/.test(formData.password)) {
      errors.password = "Password must contain at least one special character (@$!%*?&)";
    }
    
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
    <div className="container d-flex justify-content-center align-items-center min-vh-100 py-5">
      <div className="card shadow-lg p-3 p-md-4 w-100 mx-3" style={{ maxWidth: "500px" }}>
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

          <button type="submit" className="btn btn-warning w-100 py-2 fs-5" disabled={loading}>
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
