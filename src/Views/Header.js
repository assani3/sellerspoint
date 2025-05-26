import React from 'react';
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
  return (
    <div className="landing-container">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-left">
          <img src={sellerspointlogo} alt="SellersPoint Logo" className="logo" />
          <ul className="nav-links">
            <li><Link to="/home" className="nav-link">HOME</Link></li>            
            <li>CRAFTS</li>
            <li><Link to="/product" className="nav-link">SHOP</Link></li>
            <li>CONTACT</li>
          </ul>
        </div>
        <div className="nav-right">
          <button className="btn sign-in"><Link to="/signin" className="nav-link">Sign in</Link> </button>
          <button className="btn sign-up"><Link to="/signup" className="nav-link">Sign up</Link> </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-left">
          <h1>Discover unique South African craft products all year round</h1>
          <p>Explore by category or find special deals!</p>
          <div className="search-box">
            <input type="text" placeholder="What are you looking for?" />
            <button className="btn search-btn">Search</button>
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
          <div className="category-item"><img src={potteryImg} alt="Pottery" /><p>Pottery</p></div>
          <div className="category-item"><img src={woodworkImg} alt="Woodwork" /><p>Woodwork</p></div>
          <div className="category-item"><img src={metalworkImg} alt="Metalwork" /><p>Metalwork</p></div>
          <div className="category-item"><img src={beadworkImg} alt="Beadwork" /><p>Beadwork</p></div>
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
            <button className="btn sell-btn"><Link to="/signup" className="nav-link">Sell with us</Link></button>
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