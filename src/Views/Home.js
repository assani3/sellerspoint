import React from 'react';
import './Home.css';
import sellerspointlogo from '../assets/images/logo512.png';
import colorfulBaskets from '../assets/images/colorfulbasketshero.png';
import zuluNecklace from '../assets/images/zulubeadworknecklace.png';
import handwovenBasket from '../assets/images/handwovenbasket.png';
import ceramicVase from '../assets/images/ceramicvase.png';

const Home = () => {
  return (
    <div className="home">
      {/* Header */}
      <header className="header">
        <div className="nav-container">
          <div className="logo-section">
            <img src={sellerspointlogo} alt="SellersPoint Logo" className="logo" />
            <span className="brand-name">SellersPoint</span>
          </div>
          <nav className="navigation">
            <a href="#products" className="nav-link">Products</a>
            <a href="#about" className="nav-link">About Us</a>
            <a href="#contact" className="nav-link">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-image">
          <img src={colorfulBaskets} alt="Colorful handwoven South African baskets display" />
        </div>
      </section>





      

      {/* Mission Section */}
      <section className="mission">
        <div className="container">
          <h2>Our Mission</h2>
          <p>
            At SellersPoint, we are dedicated to supporting local craftsmen all year round by providing a platform to showcase their unique creations. Our mission is to celebrate and preserve the rich cultural heritage of South Africa through handcrafted products that tell a story.
          </p>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-products">
        <div className="container">
          <h2>Featured Products</h2>
          <div className="products-grid">
            <div className="product-card">
              <div className="product-image">
                <img src={zuluNecklace} alt="Traditional Zulu beadwork necklace in vibrant colors" />
              </div>
              <div className="product-info">
                <h3>Zulu Beadwork Necklace</h3>
                <p>A stunning handcrafted necklace featuring traditional Zulu beadwork in vibrant colors.</p>
              </div>
            </div>
            <div className="product-card">
              <div className="product-image">
                <img src={handwovenBasket} alt="Intricately patterned handwoven basket by skilled local artisans" />
              </div>
              <div className="product-info">
                <h3>Handwoven Basket</h3>
                <p>An intricately patterned basket handwoven by skilled local artisans.</p>
              </div>
            </div>
            <div className="product-card">
              <div className="product-image">
                <img src={ceramicVase} alt="Beautiful ceramic vase adorned with traditional African motifs" />
              </div>
              <div className="product-info">
                <h3>Ceramic Vase</h3>
                <p>A beautiful ceramic vase adorned with traditional African motifs.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>About SellersPoint</h3>
              <p>
                SellersPoint is your gateway to discovering and supporting South African craftsmen. Explore our curated selection of unique handcrafted products.
              </p>
            </div>
            <div className="footer-section">
              <h3>Contact Us</h3>
              <p>Email: <a href="mailto:support@sellerspoint.co.za">support@sellerspoint.co.za</a></p>
              <p>Phone: +27 21 123 4567</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;