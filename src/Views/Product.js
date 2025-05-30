import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Product.css';
import sellerspointlogo from '../assets/images/logo512.png';
import zuluBasketImage from '../assets/images/zulubasket.png';
import beadedNecklaceImage from '../assets/images/beadednecklace.png';
import shweshweFabricImage from '../assets/images/shweshwefabric.png';

const Product = () => {
  // Original products from your existing component
  const originalProducts = [
    {
      id: 1,
      name: "Zulu Basket",
      price: 700,
      image: zuluBasketImage,
      currency: "R"
    },
    {
      id: 2,
      name: "Beaded Necklace",
      price: 300,
      image: beadedNecklaceImage,
      currency: "R"
    },
    {
      id: 3,
      name: "Shweshwe Fabric",
      price: 500,
      image: shweshweFabricImage,
      currency: "R"
    }
  ];

  // Additional products from JSON (you can remove this section if not needed)
  const [additionalProducts, setAdditionalProducts] = useState([]);
  
  // Cart state
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  // Load additional products and cart on component mount
  useEffect(() => {
    // Fetch additional products from public folder (optional)
    fetch('/ProductCart.json')
      .then(response => response.json())
      .then(data => {
        // Convert price format to match your existing products
        const formattedData = data.map(product => ({
          ...product,
          currency: "$" // Keep original currency from JSON
        }));
        setAdditionalProducts(formattedData);
      })
      .catch(error => console.error('Error loading additional products:', error));

    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Combine all products
  const allProducts = [...originalProducts, ...additionalProducts];

  const toggleCart = () => {
    setShowCart(!showCart);
  };

  const addToCart = (productId) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item.product_id === productId);
      
      if (existingItemIndex >= 0) {
        // Item exists, increase quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += 1;
        return updatedCart;
      } else {
        // New item, add to cart
        return [...prevCart, { product_id: productId, quantity: 1 }];
      }
    });
  };

  const changeQuantity = (productId, type) => {
    setCart(prevCart => {
      const itemIndex = prevCart.findIndex(item => item.product_id === productId);
      
      if (itemIndex >= 0) {
        const updatedCart = [...prevCart];
        
        if (type === 'plus') {
          updatedCart[itemIndex].quantity += 1;
        } else {
          const newQuantity = updatedCart[itemIndex].quantity - 1;
          if (newQuantity > 0) {
            updatedCart[itemIndex].quantity = newQuantity;
          } else {
            // Remove item if quantity becomes 0
            updatedCart.splice(itemIndex, 1);
          }
        }
        
        return updatedCart;
      }
      
      return prevCart;
    });
  };

  const getTotalQuantity = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartItemInfo = (productId) => {
    return allProducts.find(product => product.id === productId);
  };

  return (
    <div className={`product-page ${showCart ? 'showCart' : ''}`}>
      {/* Header */}
      <header className="header">
        <div className="logo-container">
          <img src={sellerspointlogo} alt="SellersPoint Logo" className="logo" />
          <span className="brand-name">SellersPoint</span>
        </div>
        <nav className="nav">
          <Link to="/home" className="nav-link">HOME</Link>
          {/* Cart Icon */}
          <div className="icon-cart" onClick={toggleCart}>
            <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 15a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0h8m-8 0-1-4m9 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-9-4h10l2-7H3m2 7L3 4m0 0-.792-3H1"/>
            </svg>
            <span>{getTotalQuantity()}</span>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <h1 className="page-title">South African Craft Products</h1>
        
        <div className="products-grid">
          {/* Original South African Craft Products */}
          {originalProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image-container">
                <img src={product.image} alt={product.name} className="product-image" />
              </div>
              <div className="product-info">
                <h3 className="product-title">{product.name}</h3>
                <p className="product-price">{product.currency}{product.price}.00</p>
                <div className="product-actions">
                  <button className="view-details-btn">View Details</button>
                  <button 
                    className="add-to-cart-btn"
                    onClick={() => addToCart(product.id)}
                  >
                    Add To Cart
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Additional Products from JSON */}
          {additionalProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image-container">
                <img src={product.image} alt={product.name} className="product-image" />
              </div>
              <div className="product-info">
                <h3 className="product-title">{product.name}</h3>
                <p className="product-price">{product.currency}{product.price}</p>
                <div className="product-actions">
                  <button className="view-details-btn">View Details</button>
                  <button 
                    className="add-to-cart-btn"
                    onClick={() => addToCart(product.id)}
                  >
                    Add To Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Shopping Cart Sidebar */}
      <div className="cartTab">
        <h1>Shopping Cart</h1>
        <div className="listCart">
          {cart.map(item => {
            const productInfo = getCartItemInfo(item.product_id);
            return productInfo ? (
              <div key={item.product_id} className="cart-item" data-id={item.product_id}>
                <div className="cart-image">
                  <img src={productInfo.image} alt={productInfo.name} />
                </div>
                <div className="cart-name">
                  {productInfo.name}
                </div>
                <div className="cart-totalPrice">
                  {productInfo.currency}{productInfo.price * item.quantity}
                </div>
                <div className="cart-quantity">
                  <span 
                    className="minus"
                    onClick={() => changeQuantity(item.product_id, 'minus')}
                  >
                    &lt;
                  </span>
                  <span>{item.quantity}</span>
                  <span 
                    className="plus"
                    onClick={() => changeQuantity(item.product_id, 'plus')}
                  >
                    &gt;
                  </span>
                </div>
              </div>
            ) : null;
          })}
        </div>
        <div className="cart-buttons">
          <button className="close-cart" onClick={toggleCart}>CLOSE</button>
          <button className="checkout"><Link to="/checkout" className="CheckOut">Check Out</Link></button>
        </div>
      </div>

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