import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import sellerspointlogo from '../assets/images/logo512.png'; // top left & footer
import heroMask from '../assets/images/heromask.png';
import step1Img from '../assets/images/step1.png';
import step2Img from '../assets/images/step2.png';
import step3Img from '../assets/images/step3.png';
import potteryImg from '../assets/images/pottery.png';
import woodworkImg from '../assets/images/woodwork.png';
import metalworkImg from '../assets/images/metalwork.png';
import beadworkImg from '../assets/images/beadwork.png';
import sellerJoinImg from '../assets/images/sellerjoin.png';

const Header = () => {
  // State for mobile menu toggle
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close mobile menu when clicking on backdrop
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Handle search functionality
  const handleSearch = () => {
    const searchInput = document.querySelector('.search-box input');
    const searchTerm = searchInput.value.trim();
    if (searchTerm) {
      // Add your search logic here
      console.log('Searching for:', searchTerm);
    }
  };

  // Handle Enter key press in search input
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="landing-container">
      {/* NAVBAR */}
      <nav className="navbar">
        {/* Hamburger Menu Button (Mobile Only) */}
        <div 
          className={`hamburger-menu ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
        >
          <div className="hamburger-line"></div>
          <div className="hamburger-line"></div>
          <div className="hamburger-line"></div>
        </div>

        {/* Centered Logo */}
        <div className="nav-left">
          <img src={sellerspointlogo} alt="SellersPoint Logo" className="logo" />
          {/* Desktop Navigation Links */}
          <ul className="nav-links">
            <li><Link to="/home" className="nav-link">HOME</Link></li>            
            <li>CRAFT</li>
            <li><Link to="/product" className="nav-link">SHOP</Link></li>
            <li>CONTACT</li>
          </ul>
        </div>

        {/* Right Side Buttons */}
        <div className="nav-right">
          <Link to="/signin" className="nav-link">
            <button className="btn sign-in">Sign in</button>
          </Link>
          <Link to="/signup" className="nav-link">
            <button className="btn sign-up">Sign up</button>
          </Link>
        </div>

        {/* Mobile Navigation Overlay */}
        <div className={`mobile-nav-overlay ${isMobileMenuOpen ? 'active' : ''}`}>
          <ul className="mobile-nav-links">
            <li>
              <Link to="/home" className="nav-link" onClick={closeMobileMenu}>
                HOME
              </Link>
            </li>
            <li onClick={closeMobileMenu}>CRAFTS</li>
            <li>
              <Link to="/product" className="nav-link" onClick={closeMobileMenu}>
                SHOP
              </Link>
            </li>
            <li onClick={closeMobileMenu}>CONTACT</li>
          </ul>
        </div>

        {/* Mobile Navigation Backdrop */}
        <div 
          className={`mobile-nav-backdrop ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={closeMobileMenu}
        ></div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-left">
          <h1>Discover unique South African craft products all year round</h1>
          <p>Explore by category or find special deals!</p>
          <div className="search-box">
            <input 
              type="text" 
              placeholder="What are you looking for?" 
              onKeyPress={handleSearchKeyPress}
            />
            <button className="btn search-btn" onClick={handleSearch}>Search</button>
          </div>
        </div>
        <div className="hero-right">
          <img src={heroMask} alt="African mask" />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-it-works">
        <h2>How it works</h2>
        <div className="steps">
          <div className="step">
            <img src={step1Img} alt="Browse products" />
            <h3>Step 1</h3>
            <p>Browse through products. Search or explore categories to find your favorite crafts.</p>
          </div>
          <div className="step">
            <img src={step2Img} alt="Add to cart" />
            <h3>Step 2</h3>
            <p>Add items to your cart. Get ready to experience the best of South African craftsmanship.</p>
          </div>
          <div className="step">
            <img src={step3Img} alt="Track order" />
            <h3>Step 3</h3>
            <p>Track your order. Sit back and relax while we deliver your handpicked crafts!</p>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="categories">
        <h2>Categories</h2>
        <div className="category-list">
          <div className="category-item">
            <img src={potteryImg} alt="Pottery" />
            <p>Pottery</p>
          </div>
          <div className="category-item">
            <img src={woodworkImg} alt="Woodwork" />
            <p>Woodwork</p>
          </div>
          <div className="category-item">
            <img src={metalworkImg} alt="Metalwork" />
            <p>Metalwork</p>
          </div>
          <div className="category-item">
            <img src={beadworkImg} alt="Beadwork" />
            <p>Beadwork</p>
          </div>
        </div>
      </section>

      {/* JOIN SELLERS */}
      <section className="join-sellers">
        <h2>Join SellersPoint</h2>
        <div className="join-content">
          <img src={sellerJoinImg} alt="Seller joining" />
          <div className="join-text">
            <h3>As a seller</h3>
            <p>Showcase and sell your crafts online. Start reaching customers beyond borders.</p>
            {/* Fixed: Move Link outside of button for better mobile experience */}
            <Link to="/signup" className="nav-link">
              <button className="btn sell-btn">Sell with us</button>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-left">
          <img src={sellerspointlogo} alt="SellersPoint logo footer" />
          <span className="footer-brand-name">SellersPoint</span>
          <p>Shop now for authentic crafts!</p>
        </div>
        <div className="footer-right">
          <p>Need assistance?<br />Contact our 24/7 support team</p>
          <p><strong>📞 Contact us:</strong> (+123) 000</p>
          <p><strong>📧</strong> info@sellerspoint.com</p>
        </div>
      </footer>
    </div>
  );
};

export default Header;