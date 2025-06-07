import React, { useState, useEffect } from 'react';
import './BuyerOrder.css';
import sellerspointlogo from '../assets/images/logo512.png';

import { apiFetch } from '../utils/apiFetch'

const BuyerOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // Replace with your actual API endpoint
      const response = await /*fetch*/ apiFetch ('https://sellerspoint.infinityfreeapp.com/api/buyer-orders.php', {
        method: 'GET',
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await /*fetch*/ apiFetch('https://sellerspoint.infinityfreeapp.com/api/cancel-order.php', {
        method: 'POST',
       // headers: {
       //   'Content-Type': 'application/json',
       // },
        body: JSON.stringify({ orderId }),
        credentials: 'include'
      });

      if (response.ok) {
        // Refresh orders after cancellation
        fetchOrders();
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
    }
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'order placed':
        return 'status-placed';
      case 'shipped':
        return 'status-shipped';
      case 'delivered':
        return 'status-delivered';
      default:
        return 'status-placed';
    }
  };

  const canCancelOrder = (status) => {
    return status.toLowerCase() === 'order placed' || status.toLowerCase() === 'shipped';
  };

  if (loading) {
    return <div className="loading">Loading your orders...</div>;
  }

  return (
    <div className="buyer-order-container">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <img src={sellerspointlogo} alt="SellersPoint Logo" className="logo" />
          <span className="brand-name">SellersPoint</span>
        </div>
        <nav className="nav-menu">
          <a href="/home" className="nav-link">Home</a>
          <a href="/buyerorder" className="nav-link active">Orders</a>
          <a href="/product" className="nav-link">Products</a>
        </nav>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <h1 className="page-title">Your Orders</h1>
        
        {orders.length === 0 ? (
          <div className="no-orders">
            <p>You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="orders-grid">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-content">
                  <div className="product-image">
                    <img src={order.product_image} alt={order.product_name} />
                  </div>
                  <div className="order-details">
                    <h3 className="product-name">{order.product_name}</h3>
                    <p className="seller-info">Seller ID: {order.seller_id}</p>
                    <p className="price-info">
                      Price: ${order.price} x Quantity: {order.quantity}
                    </p>
                    <p className="price-info">
                      Total Price: ${order.total_price}
                    </p>
                  </div>
                </div>
                
                <div className="order-footer">
                  <span className={`order-status ${getStatusClass(order.status)}`}>
                    Status: {order.status}
                  </span>
                  {canCancelOrder(order.status) && (
                    <button 
                      className="cancel-btn"
                      onClick={() => handleCancelOrder(order.id)}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-section">
          <h3>About Us</h3>
          <p>Learn more about our journey and mission to provide the best online shopping experience.</p>
        </div>
        <div className="footer-section">
          <h3>Customer Service</h3>
          <ul>
            <li><a href="/contact">Contact Us</a></li>
            <li><a href="/returns">Returns</a></li>
          </ul>
        </div>
      </footer>
    </div>
  );
};

export default BuyerOrder;