import React, { useState, useEffect } from 'react';
import './ProductDetails.css';
import { Link, useNavigate } from 'react-router-dom';
import sellerspointlogo from '../assets/images/logo512.png';

const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Get the selected product from sessionStorage
    const selectedProduct = sessionStorage.getItem('selectedProduct');
    
    if (selectedProduct) {
      try {
        const productData = JSON.parse(selectedProduct);
        setProduct(productData);
      } catch (error) {
        console.error('Error parsing product data:', error);
        // If there's an error, redirect back to products page
        navigate('/product');
      }
    } else {
      // If no product is selected, redirect back to products page
      navigate('/product');
    }

    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart:', error);
        setCart([]);
      }
    }

    setLoading(false);
  }, [navigate]);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const getTotalQuantity = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const formatPrice = (product) => {
    if (!product) return '';
    
    // Handle different price formats
    if (product.originalPrice) {
      return product.originalPrice; // For seller products, use original format
    }
    return `${product.currency}${product.price}${product.currency === 'R' ? '.00' : ''}`;
  };

  const addToCart = () => {
    if (!product) return;

    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item.product_id === product.id);
      
      if (existingItemIndex >= 0) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += 1;
        return updatedCart;
      } else {
        return [...prevCart, { product_id: product.id, quantity: 1 }];
      }
    });

    // Show a brief confirmation (optional)
    const button = document.querySelector('.add-to-cart-btn');
    const originalText = button.textContent;
    button.textContent = 'Added to Cart!';
    button.style.backgroundColor = '#28a745';
    
    setTimeout(() => {
      button.textContent = originalText;
      button.style.backgroundColor = '#ff7b47';
    }, 1500);
  };

  if (loading) {
    return (
      <div className="product-details-page">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          fontSize: '18px',
          color: '#666'
        }}>
          Loading product details...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-details-page">
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          fontSize: '18px',
          color: '#666'
        }}>
          <p>Product not found</p>
          <Link to="/product" style={{ color: '#ff7b47', marginTop: '10px' }}>
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="product-details-page">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <img src={sellerspointlogo} alt="SellersPoint Logo" className="logo" />
            <span className="brand-name">SellersPoint</span>
          </div>
          <nav className="nav-section">
            <div className="cart-icon">
              🛒
              <span className="cart-count">{getTotalQuantity()}</span>
            </div>
            <Link to="/home" className="nav-link">HOME</Link>
            <Link to="/product" className="nav-link">SHOP</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="product-container">
          {/* Product Image */}
          <div className="product-image-section">
            <img 
              src={product.image} 
              alt={product.name} 
              className="product-image"
            />
          </div>

          {/* Product Details */}
          <div className="product-info-section">
            <h1 className="product-title">{product.name}</h1>
            
            <p className="product-description">
              {product.description || 'No description available for this product.'}
            </p>

            <div className="price-section">
              <span className="price-label">Price: </span>
              <span className="price-value">{formatPrice(product)}</span>
            </div>

            <div className="button-section">
              <button className="add-to-cart-btn" onClick={addToCart}>
                Add to Cart
              </button>
              <Link to="/product" className="back-to-shop-btn">
                Back to Shop
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p className="footer-text">© 2025 SellersPoint. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ProductDetails;