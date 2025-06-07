import React, { useState, useEffect } from 'react';
import './Signin.css';
import sellerspointlogo from '../assets/images/logo512.png';
import { apiFetch } from '../utils/apiFetch';


const Signin = () => {

  //this lil MF keeps the user logged in even if the page reloads
  //notice how I called it in the import above real nigga shit
  useEffect(() => {
  const savedUser = JSON.parse(localStorage.getItem('sellerspoint_user'));
  if (savedUser) {
    sessionStorage.setItem('sellerspoint_user', JSON.stringify(savedUser));
    window.location.href = '/products'; // make sure this matches your route
  }
}, []);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await /*fetch*/ apiFetch ('https://sellerspoint.infinityfreeapp.com/api/signin.php', {
      method: 'POST',
      credentials: 'include', // ✅ Crucial for sessions
      //headers: {
       // 'Content-Type': 'application/json'
      //},
      body: JSON.stringify({
        email: formData.email,
        password: formData.password
      })
    });

    const contentType = response.headers.get("content-type");

    if (contentType && contentType.indexOf("application/json") !== -1) {
      const result = await response.json();

      if (response.ok && result.success) {
        const userData = {
          userId: result.user_id,
          username: result.username,
          role: result.role
        };

        if (formData.remember) {
          localStorage.setItem('sellerspoint_user', JSON.stringify(userData));
        } else {
          sessionStorage.setItem('sellerspoint_user', JSON.stringify(userData));
        }

        alert("Signed in successfully");
        console.log("User info:", result);

        localStorage.setItem('seller_id', response.seller_id); // Still here ✅

        if (result.role === 'admin') {
          window.location.href = '/adminpage';
        } else if (result.role === 'seller') {
          window.location.href = '/sellersdashboard';
        } else {
          window.location.href = '/product';
        }

      } else {
        alert(result.error || "Signin failed");
      }
    } else {
      const text = await response.text();
      console.error("Expected JSON, got:", text);
      alert("Server error - check PHP script output");
    }

  } catch (error) {
    console.error("Signin error:", error);
    alert("Could not connect to server");
  }
};



  const handleForgotPassword = () => {
    // Handle forgot password logic here
    console.log('Forgot password clicked');
  };

  return (
    <div className="signin-container">
      <div className="signin-header">
        <img src={sellerspointlogo} alt="SellersPoint Logo" className="signin-logo" />
        <span className="signin-header-text">Sign In</span>
      </div>

      <div className="signin-content">
        <div className="signin-card">
          <h1 className="signin-title">Welcome Back</h1>
          
          <form onSubmit={handleSubmit} className="signin-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
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
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="form-input"
                required
              />
            </div>

            <div className="form-options">
              <div className="remember-section">
                <input
                  type="checkbox"
                  id="remember"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleInputChange}
                  className="remember-checkbox"
                />
                <label htmlFor="remember" className="remember-label">Remember</label>
              </div>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="forgot-password-link"
              >
                Forgot Password
              </button>
            </div>

            <button type="submit" className="signin-button">
              Sign In
            </button>
          </form>
        </div>
      </div>

      <footer className="signin-footer">
        <p>&copy; 2025 SellersPoint</p>
      </footer>
    </div>
  );
};

export default Signin;