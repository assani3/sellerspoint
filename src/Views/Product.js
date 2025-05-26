import React from 'react';
import { Link } from 'react-router-dom';
import './Product.css';
import sellerspointlogo from '../assets/images/logo512.png';
import zuluBasketImage from '../assets/images/zulubasket.png';
import beadedNecklaceImage from '../assets/images/beadednecklace.png';
import shweshweFabricImage from '../assets/images/shweshwefabric.png';

const Product = () => {
  return (
    <div className="product-page">
      {/* Header */}
      <header className="header">
        <div className="logo-container">
          <img src={sellerspointlogo} alt="SellersPoint Logo" className="logo" />
          <span className="brand-name">SellersPoint</span>
        </div>
        <nav className="nav">
          <Link to="/home" className="nav-link">HOME</Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <h1 className="page-title">South African Craft Products</h1>
        
        <div className="products-grid">
          {/* Zulu Basket */}
          <div className="product-card">
            <div className="product-image-container">
              <img src={zuluBasketImage} alt="Zulu Basket" className="product-image" />
            </div>
            <div className="product-info">
              <h3 className="product-title">Zulu Basket</h3>
              <p className="product-price">R700.00</p>
              <button className="view-details-btn">View Details</button>
            </div>
          </div>

          {/* Beaded Necklace */}
          <div className="product-card">
            <div className="product-image-container">
              <img src={beadedNecklaceImage} alt="Beaded Necklace" className="product-image" />
            </div>
            <div className="product-info">
              <h3 className="product-title">Beaded Necklace</h3>
              <p className="product-price">R300.00</p>
              <button className="view-details-btn">View Details</button>
            </div>
          </div>

          {/* Shweshwe Fabric */}
          <div className="product-card">
            <div className="product-image-container">
              <img src={shweshweFabricImage} alt="Shweshwe Fabric" className="product-image" />
            </div>
            <div className="product-info">
              <h3 className="product-title">Shweshwe Fabric</h3>
              <p className="product-price">R500.00</p>
              <button className="view-details-btn">View Details</button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">About Us</h3>
            <p className="footer-text">
              SellersPoint is your go-to platform for authentic South African crafts, 
              connecting artisans with the global market.
            </p>
          </div>
          <div className="footer-section">
            <h3 className="footer-title">Contact</h3>
            <div className="contact-info">
              <p className="contact-item">Email: support@sellerspoint.com</p>
              <p className="contact-item">Phone: +27 21 123 4567</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Product;