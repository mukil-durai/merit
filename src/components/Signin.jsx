import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../pages/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const SignIn = () => {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    email: "",
    password: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear validation errors when typing
    setValidationErrors({
      ...validationErrors,
      [name]: ""
    });
    setError("");
  };

  const validateForm = () => {
    const errors = {};
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
      const response = await axios.post("http://localhost:5001/signin", formData);
      try {
        await login({
          token: response.data.token,
          user: response.data.user
        });
        alert("Login successful");
        navigate("/home");
      } catch (e) {
        if (
          e instanceof DOMException &&
          (e.name === "QuotaExceededError" || e.code === 22)
        ) {
          setError("Your browser storage is full. Please clear some space or use a different browser.");
        } else {
          setError("Login failed due to an unknown error.");
        }
        return;
      }
    } catch (error) {
      setError(error.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg p-4 w-50">
        <h2 className="text-center mb-4">Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              name="email" 
              className={`form-control ${validationErrors.email ? 'is-invalid' : ''}`}
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
            {validationErrors.email && <div className="invalid-feedback d-block">{validationErrors.email}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <div className="input-group">
              <input 
                type={showPassword ? "text" : "password"} 
                name="password" 
                className={`form-control ${validationErrors.password ? 'is-invalid' : ''}`}
                value={formData.password} 
                onChange={handleChange} 
                required 
              />
              <button type="button" className="btn btn-outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {validationErrors.password && <div className="invalid-feedback d-block">{validationErrors.password}</div>}
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <button type="submit" className="btn btn-warning w-100" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
