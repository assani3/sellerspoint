import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Product.css';
import sellerspointlogo from '../assets/images/logo512.png';
import zuluBasketImage from '../assets/images/zulubasket.png';
import beadedNecklaceImage from '../assets/images/beadednecklace.png';
import shweshweFabricImage from '../assets/images/shweshwefabric.png';
import logout from '../utils/logout';
import '../utils/logout.css';

import { apiFetch } from '../utils/apiFetch'

const Product = () => {
  // Original South African craft products
  const originalProducts = [
    {
      id: 'original-1',
      name: "Zulu Basket",
      price: 700,
      image: zuluBasketImage,
      currency: "R",
      description: "Traditional handwoven Zulu basket made from natural materials."
    },
    {
      id: 'original-2',
      name: "Beaded Necklace",
      price: 300,
      image: beadedNecklaceImage,
      currency: "R",
      description: "Beautiful handcrafted beaded necklace with traditional patterns."
    },
    {
      id: 'original-3',
      name: "Shweshwe Fabric",
      price: 500,
      image: shweshweFabricImage,
      currency: "R",
      description: "Authentic Shweshwe fabric with traditional African prints."
    }
  ];

  // State management
  const [additionalProducts, setAdditionalProducts] = useState([]);
  const [sellerProducts, setSellerProducts] = useState([]);
  const [apiProducts, setApiProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  // Load all product sources and cart on component mount
  useEffect(() => {
    // Load additional products from JSON file
    

    // Load seller products from localStorage
    const loadSellerProducts = () => {
      try {
        const savedProducts = JSON.parse(localStorage.getItem('sellerProducts') || '[]');
        const formattedSellerProducts = savedProducts.map(product => ({
          ...product,
          id: `seller-${product.id}`,
          currency: "R",
          price: parseFloat(product.price.replace('R', '')) || 0,
          originalPrice: product.price
        }));
        setSellerProducts(formattedSellerProducts);
      } catch (error) {
        console.error('Error loading seller products:', error);
      }
    };

    loadSellerProducts();

    // Listen for localStorage changes
    const handleStorageChange = (e) => {
      if (e.key === 'sellerProducts') {
        loadSellerProducts();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    // Load products from API
    /*fetch*/ apiFetch ('https://sellerspoint.infinityfreeapp.com/api/getProducts.php')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const formatted = data.products.map(p => ({
            id: `api-${p.id}`,
            name: p.title,
            price: parseFloat(p.price),
            currency: "R",
            image: p.image_path || sellerspointlogo,
            description: p.description
          }));
          setApiProducts(formatted);
        }
      })
      .catch(error => console.error('Error loading API products:', error));

    // Cleanup event listener
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Combine all product sources
  const allProducts = [...originalProducts, ...additionalProducts, ...sellerProducts, ...apiProducts];

  // Cart functionality
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

  // Utility functions
  const formatPrice = (product) => {
    if (product.originalPrice) return product.originalPrice;
    return `${product.currency}${product.price}${product.currency === 'R' ? '.00' : ''}`;
  };

  const calculateTotalPrice = (product, quantity) => {
    const price = product.price || 0;
    const total = price * quantity;
    return `${product.currency}${total}${product.currency === 'R' ? '.00' : ''}`;
  };

  const handleViewDetails = (product) => {
    sessionStorage.setItem('selectedProduct', JSON.stringify(product));
  };

  const getTotalCartValue = () => {
    return cart.reduce((total, item) => {
      const product = getCartItemInfo(item.product_id);
      if (product) {
        return total + (product.price * item.quantity);
      }
      return total;
    }, 0);
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
          <button onClick={logout} className="logout-btn">Logout</button>
          <Link to="/home" className="nav-link">HOME</Link>
          {/* Cart Icon */}
          <div className="icon-cart" onClick={toggleCart}>
            <svg aria-hidden="true" xmlns="https://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
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
          {allProducts.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image-container">
                <img 
                  src={product.image} 
                  alt={product.alt || `${product.name} image`} 
                  className="product-image" 
                />
              </div>
              <div className="product-info">
                <h3 className="product-title">{product.name}</h3>
                <p className="product-price">{formatPrice(product)}</p>
                {product.description && (
                  <p className="product-description">{product.description}</p>
                )}
                <div className="product-actions">
                  <Link 
                    to="/productdetails" 
                    className="view-details-btn"
                    onClick={() => handleViewDetails(product)}
                  >
                    View Details
                  </Link>
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

        {/* Empty state */}
        {allProducts.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem', 
            color: '#666',
            fontSize: '1.2rem' 
          }}>
            <p>No products available at the moment.</p>
            <p>Check back later for new arrivals!</p>
          </div>
        )}
      </main>

      {/* Shopping Cart Sidebar */}
      <div className="cartTab">
        <h1>Shopping Cart</h1>
        <div className="listCart">
          {cart.length === 0 && (
            <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
              Your cart is empty
            </p>
          )}
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
                  {calculateTotalPrice(productInfo, item.quantity)}
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
        
        {/* Cart Total */}
        {cart.length > 0 && (
          <div className="cart-total">
            <h3>Total: R{getTotalCartValue().toFixed(2)}</h3>
          </div>
        )}
        
        <div className="cart-buttons">
          <button className="close-cart" onClick={toggleCart}>CLOSE</button>
          <button className="checkout">
            <Link 
              to="/checkout" 
              state={{ 
                cartItems: cart,
                products: allProducts,
                totalAmount: getTotalCartValue(),
                totalQuantity: getTotalQuantity()
              }}
              className="CheckOut"
            >
              Check Out
            </Link>
          </button>
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