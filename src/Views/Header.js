// Header.js
import React from 'react';
import './Header.css';
import sellerspointlogo from '../assets/images/logo512.png';

// Images
import step1Img from '../assets/images/step1.png';
import step2Img from '../assets/images/step2.png';
import step3Img from '../assets/images/step3.png';

import illustrationleft from '../assets/images/illustrationleft.png';
import illustrationright from '../assets/images/illustrationright.png';

import sellerillustration from '../assets/images/sellerillustration.png';
import buyerillustration from '../assets/images/buyerillustration.png';

const Header = () => {
  return (
    <header className="header">
      {/* ======= NAVBAR SECTION ======= */}
      <div className="navbar">
        <div className="logo">
          <img src={sellerspointlogo} alt="SellersPoint Logo" />
          <span>SellersPoint</span>
        </div>
        <div className="auth-buttons">
          <button className="btn login-btn">Log in</button>
          <button className="btn register-btn">Register</button>
        </div>
      </div>

      {/* ======= HERO SECTION (UPDATED) ======= */}
      <div className="hero centered-hero">
        <img src={illustrationleft} alt="Left Illustration" className="side-img" />
        <div className="hero-text">
          <h1>Discover the easiest<br />way to buy and sell</h1>
          <div className="search-bar">
            <input type="text" placeholder="Product search" />
            <button>Search</button>
          </div>
        </div>
        <img src={illustrationright} alt="Right Illustration" className="side-img" />
      </div>

      {/* ======= HOW TO USE SECTION ======= */}
      <section className="how-to-use">
        <h2>How to use SellersPoint</h2>
        <div className="steps">
          <div className="step">
            <img src={step1Img} alt="Step 1" />
            <h3>Step 1</h3>
            <p>Enter product details. Add to cart or enable location for pickup.</p>
          </div>
          <div className="step">
            <img src={step2Img} alt="Step 2" />
            <h3>Step 2</h3>
            <p>Select a product and proceed to checkout for a seamless transaction.</p>
          </div>
          <div className="step">
            <img src={step3Img} alt="Step 3" />
            <h3>Step 3</h3>
            <p>Complete your purchase and wait for the seller's confirmation.</p>
          </div>
        </div>
      </section>

      {/* ======= JOIN COMMUNITY SECTION ======= */}
      <section className="join-community">
        <h2>Join the SellersPoint community</h2>

        <div className="community-card bordered">
          <img src={sellerillustration} alt="Seller Illustration" />
          <div className="community-text">
            <h3>As a seller</h3>
            <p>Sell products easily and earn money with EasyTrade.</p>
            <button className="btn community-btn">Sell now</button>
          </div>
        </div>

        <div className="community-card bordered">
          <img src={buyerillustration} alt="Buyer Illustration" />
          <div className="community-text">
            <h3>As a buyer</h3>
            <p>Explore a variety of products and enjoy secure transactions.</p>
            <button className="btn community-btn">Buy now</button>
          </div>
        </div>
      </section>

      {/* ======= FOOTER SECTION ======= */}
      <footer className="footer">
        <div className="footer-content">
          <span>SellersPoint</span>
          <span>© Assani co. 2025</span>
        </div>
      </footer>
    </header>
  );
};

export default Header;
