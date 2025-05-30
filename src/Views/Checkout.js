import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Checkout.css';
import sellerspointlogo from '../assets/images/logo512.png';
import zuluBasketImage from '../assets/images/zulubasket.png';
import beadedNecklaceImage from '../assets/images/beadednecklace.png';
import shweshweFabricImage from '../assets/images/shweshwefabric.png';

const Checkout = () => {
  // Product data (same as in Product.js for consistency)
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

  const [additionalProducts, setAdditionalProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    country: 'South Africa'
  });

  // Load cart and additional products on component mount
  useEffect(() => {
    // Load additional products
    fetch('/ProductCart.json')
      .then(response => response.json())
      .then(data => {
        const formattedData = data.map(product => ({
          ...product,
          currency: "$"
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

  // Combine all products
  const allProducts = [...originalProducts, ...additionalProducts];

  // Get product info by ID
  const getProductInfo = (productId) => {
    return allProducts.find(product => product.id === productId);
  };

  // Calculate totals
  const getTotalQuantity = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const product = getProductInfo(item.product_id);
      return product ? total + (product.price * item.quantity) : total;
    }, 0);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    const requiredFields = ['fullName', 'email', 'phone', 'address', 'city'];
    const missingFields = requiredFields.filter(field => !formData[field].trim());
    
    if (missingFields.length > 0) {
      alert(`Please fill in the following fields: ${missingFields.join(', ')}`);
      return;
    }

    if (cart.length === 0) {
      alert('Your cart is empty. Please add items before checkout.');
      return;
    }

    // Here you would typically process the order
    // For now, we'll just show a success message
    const orderData = {
      customer: formData,
      items: cart.map(item => ({
        ...item,
        product: getProductInfo(item.product_id)
      })),
      totals: {
        quantity: getTotalQuantity(),
        price: getTotalPrice()
      }
    };

    console.log('Order submitted:', orderData);
    alert('Order placed successfully! Thank you for your purchase.');
    
    // Clear cart after successful order
    localStorage.removeItem('cart');
    setCart([]);
  };

  return (
    <div className="checkout-page">
      {/* Header */}
      <header className="checkout-header">
        <div className="logo-container">
          <img src={sellerspointlogo} alt="SellersPoint Logo" className="logo" />
          <span className="brand-name">SellersPoint</span>
        </div>
        <nav className="checkout-nav">
          <Link to="/product" className="nav-link">Back to Products</Link>
        </nav>
      </header>

      <div className="checkout-container">
        <div className="checkout-layout">
          
          {/* Left Side - Cart Summary */}
          <div className="cart-summary">
            <Link to="/product" className="continue-shopping">← Continue Shopping</Link>
            <h1>Order Summary</h1>

            
            
            <div className="cart-items-list">
              {cart.length === 0 ? (
                <div className="empty-cart">
                  <p>Your cart is empty</p>
                  <Link to="/product" className="shop-now-btn">Shop Now</Link>
                </div>
              ) : (
                cart.map(item => {
                  const product = getProductInfo(item.product_id);
                  return product ? (
                    <div key={item.product_id} className="checkout-item">
                      <img src={product.image} alt={product.name} />
                      <div class="item-info">
                        <div className="item-name">{product.name}</div>
                        <div className="item-price">{product.currency}{product.price} / 1 product</div>
                      </div>
                      <div className="item-quantity">{item.quantity}</div>
                      <div className="item-total">{product.currency}{product.price * item.quantity}</div>
                    </div>
                  ) : null;
                })
              )}
            </div>

            {cart.length > 0 && (
              <div className="order-totals">
                <div className="total-row">
                  <span>Total Items:</span>
                  <span className="total-quantity">{getTotalQuantity()}</span>
                </div>
                <div className="total-row total-price-row">
                  <span>Total Price:</span>
                  <span className="total-price">R{getTotalPrice()}</span>
                </div>
              </div>
            )}
          </div>

          {/* Right Side - Checkout Form */}
          <div className="checkout-form-section">
            <h1>Checkout</h1>
            
            <form onSubmit={handleSubmit} className="checkout-form">
              
              <div className="form-group full-width">
                <label htmlFor="fullName">Full Name *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="address">Street Address *</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="city">City *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="province">Province</label>
                <select
                  id="province"
                  name="province"
                  value={formData.province}
                  onChange={handleInputChange}
                >
                  <option value="">Select Province</option>
                  <option value="Eastern Cape">Eastern Cape</option>
                  <option value="Free State">Free State</option>
                  <option value="Gauteng">Gauteng</option>
                  <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                  <option value="Limpopo">Limpopo</option>
                  <option value="Mpumalanga">Mpumalanga</option>
                  <option value="Northern Cape">Northern Cape</option>
                  <option value="North West">North West</option>
                  <option value="Western Cape">Western Cape</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="postalCode">Postal Code</label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="country">Country</label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                >
                  <option value="South Africa">South Africa</option>
                  <option value="Botswana">Botswana</option>
                  <option value="Namibia">Namibia</option>
                  <option value="Zimbabwe">Zimbabwe</option>
                </select>
              </div>

              <button 
                type="submit" 
                className="checkout-button"
                disabled={cart.length === 0}
              >
                Place Order - R{getTotalPrice()}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="checkout-footer">
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

export default Checkout;