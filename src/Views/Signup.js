import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import sellerspointlogo from '../assets/images/logo512.png';
import signupIllustration from '../assets/images/signupillustration.png';
import './Signup.css';

import { apiFetch } from '../utils/apiFetch';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (formData.password !== formData.confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
    const response = await /*fetch*/ apiFetch ('https://sellerspoint.infinityfreeapp.com/api/signup.php', {
      method: 'POST',
      //headers: {
        //'Content-Type': 'application/json',
        //'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/113 Safari/537.36'
      //},
      body: JSON.stringify({
        username: formData.username, // ✅ correct key
        email: formData.email,
        password: formData.password
      })
    });

    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      const result = await response.json();

      if (response.ok) {
        alert("Account created successfully");
        window.location.href = "/signin";
      } else {
        alert(result.error || "Signup failed");
      }
    } else {
      const text = await response.text();
      console.error("Non-JSON response:", text);
      alert("Server error - please check if the PHP script is returning valid JSON");
    }

  } catch (error) {
    console.error("Signup error:", error);
    alert("Error connecting to server");
  }
};




  return (
    <div className="signup-container">
      {/* Header */}
      <header className="signup-header">
        <div className="header-content">
          <div className="logo-section">
            <img src={sellerspointlogo} alt="SellerPoint Logo" className="logo" />
            <span className="brand-name">SellersPoint</span>
          </div>
          <Link to="/signin" className="login-link">Login</Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="signup-main">
        <div className="signup-content">
          {/* Left Side - Form */}
          <div className="form-section">
            <h1 className="signup-title">Sign Up</h1>
            
            <form onSubmit={handleSubmit} className="signup-form">
              <div className="form-group">
                <label htmlFor="name" className="form-label">Name</label>
                <input
                  type="text"
                  id="name"
                  name="username"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="form-input"
                  required
                />
              </div>

              <button type="submit" className="create-account-btn">
                Create Account
              </button>
            </form>
          </div>

          {/* Right Side - Illustration */}
          <div className="illustration-section">
            <img 
              src={signupIllustration} 
              alt="People shopping illustration" 
              className="signup-illustration"
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="signup-footer">
        <div className="footer-links">
          <Link to="/terms" className="footer-link">Terms of Service</Link>
          <Link to="/privacy" className="footer-link">Privacy Policy</Link>
          <Link to="/contact" className="footer-link">Contact Us</Link>
        </div>
      </footer>
    </div>
  );
};

export default Signup;