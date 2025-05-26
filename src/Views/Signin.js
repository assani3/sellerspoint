import React, { useState } from 'react';
import './Signin.css';
import sellerspointlogo from '../assets/images/logo512.png';

const Signin = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle sign in logic here
    console.log('Sign in attempted with:', formData);
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