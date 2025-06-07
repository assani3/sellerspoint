import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Checkout.css';
import sellerspointlogo from '../assets/images/logo512.png';
import zuluBasketImage from '../assets/images/zulubasket.png';
import beadedNecklaceImage from '../assets/images/beadednecklace.png';
import shweshweFabricImage from '../assets/images/shweshwefabric.png';

import { apiFetch } from '../utils/apiFetch'

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Product data (must match exactly with Product component)
  const originalProducts = [
    {
      id: 'original-1',
      name: "Zulu Basket",
      price: 700,
      image: zuluBasketImage,
      currency: "R"
    },
    {
      id: 'original-2',
      name: "Beaded Necklace",
      price: 300,
      image: beadedNecklaceImage,
      currency: "R"
    },
    {
      id: 'original-3',
      name: "Shweshwe Fabric",
      price: 500,
      image: shweshweFabricImage,
      currency: "R"
    }
  ];

  const [additionalProducts, setAdditionalProducts] = useState([]);
  const [sellerProducts, setSellerProducts] = useState([]);
  const [apiProducts, setApiProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [checkoutData, setCheckoutData] = useState(null);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  // Load all products first, then cart data
  useEffect(() => {
    const loadAllData = async () => {
      console.log('Loading checkout data...');
      
      // Load all product sources (same as Product component)
      await loadAdditionalProducts();
      
      // Then load cart data
      loadCartData();
      
      setProductsLoaded(true);
    };

    loadAllData();
  }, [location.state]);

  const loadAdditionalProducts = async () => {
    try {
      // Load seller products from localStorage (exactly like Product component)
      const savedProducts = JSON.parse(localStorage.getItem('sellerProducts') || '[]');
      const formattedSellerProducts = savedProducts.map(product => ({
        ...product,
        id: `seller-${product.id}`,
        currency: "R",
        price: parseFloat(product.price.replace('R', '')) || 0,
        originalPrice: product.price
      }));
      setSellerProducts(formattedSellerProducts);
      console.log('Loaded seller products:', formattedSellerProducts);
    } catch (error) {
      console.error('Error loading seller products:', error);
    }

    try {
      // Load API products (exactly like Product component)
      const response = await /*fetch*/ apiFetch ('https://sellerspoint.infinityfreeapp.com/api/getProducts.php');
      const data = await response.json();
      if (data.success) {
        const formatted = data.products.map(p => ({
          id: `api-${p.id}`,
          name: p.title,
          price: parseFloat(p.price),
          currency: "R",
          image: p.image_path || sellerspointlogo,
          description: p.description,
          originalProductId: p.id // Keep original product ID for database
        }));
        setApiProducts(formatted);
        console.log('Loaded API products:', formatted);
      }
    } catch (error) {
      console.error('Error loading API products:', error);
    }

    try {
      // Load JSON products if they exist
      const response = await fetch('/ProductCart.json');
      const data = await response.json();
      const formattedData = data.map(product => ({
        ...product,
        id: `json-${product.id}`,
        currency: "$"
      }));
      setAdditionalProducts(formattedData);
      console.log('Loaded JSON products:', formattedData);
    } catch (error) {
      console.log('No additional products JSON file found:', error);
    }
  };

  const loadCartData = () => {
    // Try to get checkout data from React Router state first
    if (location.state && location.state.cartItems) {
      console.log('Using checkout data from navigation:', location.state);
      setCheckoutData(location.state);
      setCart(location.state.cartItems);
    } else {
      // Fallback: load from localStorage
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        console.log('Loaded cart from localStorage:', parsedCart);
        setCart(parsedCart);
      } else {
        console.log('No cart data found');
        setCart([]);
      }
    }
  };

  // Combine all products (must match Product component exactly)
  const allProducts = [...originalProducts, ...additionalProducts, ...sellerProducts, ...apiProducts];

  // Get product info by ID
  const getProductInfo = (productId) => {
    const product = allProducts.find(product => product.id === productId);
    if (!product) {
      console.warn(`Product not found for ID: ${productId}`);
      return null;
    }
    return product;
  };

  // Get the original product ID for database storage
  const getOriginalProductId = (productId) => {
    const product = getProductInfo(productId);
    if (!product) return null;
    
    // For API products, use the original product ID
    if (product.originalProductId) {
      return product.originalProductId;
    }
    
    // For other products, extract the numeric ID
    if (productId.includes('-')) {
      return productId.split('-')[1];
    }
    
    return productId;
  };

  // Update quantity in cart
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const updatedCart = cart.map(item => 
      item.product_id === productId 
        ? { ...item, quantity: newQuantity }
        : item
    );
    
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    const updatedCart = cart.filter(item => item.product_id !== productId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
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

  // Format price helper
  const formatPrice = (product, quantity = 1) => {
    if (!product) return 'R0.00';
    
    const price = product.price || 0;
    const total = price * quantity;
    const currency = product.currency || 'R';
    
    if (product.originalPrice && quantity === 1) {
      return product.originalPrice;
    }
    
    return `${currency}${total.toFixed(2)}`;
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };



  // Submit order to database
 const submitOrderToDatabase = async (orderData) => {
  try {
    const response = await /*fetch*/ apiFetch ('https://sellerspoint.infinityfreeapp.com/api/place-order.php', {
      method: 'POST',
      credentials: 'include', // Use cookies for session authentication
     // headers: {
     //   'Content-Type': 'application/json'
     // },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Order failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Order Error:', error);
    throw error;
  }
};



  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent double submission
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
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

      // Prepare order data for database
      const orderData = {
        customer: formData,
        items: cart.map(item => {
          const product = getProductInfo(item.product_id);
          const originalProductId = getOriginalProductId(item.product_id);
          
          return {
            product_id: originalProductId,
            quantity: item.quantity,
            price: product ? product.price : 0,
            product_name: product ? product.name : 'Unknown Product'
          };
        }),
        totals: {
          total_amount: getTotalPrice(),
          total_quantity: getTotalQuantity()
        }
      };

      console.log('Submitting order:', orderData);
      
      // Submit order to database
      const result = await submitOrderToDatabase(orderData);
      
      if (result.success) {
        // Show success message
        alert(`Order placed successfully! 
        
Order Details:
- Order ID: ${result.orderId}
- Total Items: ${getTotalQuantity()}
- Total Amount: R${getTotalPrice().toFixed(2)}
- Customer: ${formData.fullName}

Thank you for your purchase!`);
        
        // Clear cart after successful order
        localStorage.removeItem('cart');
        setCart([]);
        
        // Redirect to orders page
        navigate('/buyerorder');
      } else {
        throw new Error('Failed to place order');
      }
      
    } catch (error) {
      console.error('Order submission failed:', error);
      alert(`Failed to place order: ${error.message}\n\nPlease try again or contact support.`);
    } finally {
      setIsSubmitting(false);
    }
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

            {/* Loading state */}
            {!productsLoaded && (
              <div style={{ padding: '1rem', textAlign: 'center' }}>
                Loading products...
              </div>
            )}
            
            <div className="cart-items-list">
              {cart.length === 0 ? (
                <div className="empty-cart">
                  <p>Your cart is empty</p>
                  <Link to="/product" className="shop-now-btn">Shop Now</Link>
                </div>
              ) : (
                cart.map(item => {
                  const product = getProductInfo(item.product_id);
                  return (
                    <div key={item.product_id} className="order-summary-item">
                      <div className="item-image">
                        <img 
                          src={product?.image || sellerspointlogo} 
                          alt={product?.name || 'Product'} 
                        />
                      </div>
                      <div className="item-details">
                        <div className="item-name">
                          {product?.name || `Unknown Product (${item.product_id})`}
                        </div>
                        <div className="item-quantity">Qty: {item.quantity}</div>
                        <div className="item-price">
                          {product ? formatPrice(product, item.quantity) : 'Price unavailable'}
                        </div>
                        <div className="quantity-controls">
                          <button 
                            onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button 
                        className="remove-item-btn"
                        onClick={() => removeFromCart(item.product_id)}
                        title="Remove item"
                      >
                        ×
                      </button>
                    </div>
                  );
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
                  <span className="total-price">R{getTotalPrice().toFixed(2)}</span>
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="province">Province</label>
                <select
                  id="province"
                  name="province"
                  value={formData.province}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label htmlFor="country">Country</label>
                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
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
                disabled={cart.length === 0 || isSubmitting}
              >
                {isSubmitting ? 'Processing...' : `Place Order - R${getTotalPrice().toFixed(2)}`}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="checkout-footer">
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
      </div>
    </div>
  );
};

export default Checkout;