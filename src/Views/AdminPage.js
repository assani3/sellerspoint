import React, { useState, useEffect } from 'react';
import './AdminPage.css';
import sellerspointlogo from '../assets/images/logo512.png';


import { apiFetch } from '../utils/apiFetch'

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [userProducts, setUserProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Replace with your actual backend URL
 const API_BASE_URL = 'https://sellerspoint.infinityfreeapp.com/api'; // Update this!

  // Fetch all users from database
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await /*fetch*/ apiFetch (`${API_BASE_URL}/getAllUsers.php`);
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.users);
      } else {
        setError(data.error || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProducts = async (userId) => {
    setLoading(true);
    setError('');
    try {
      const response = await /*fetch*/ apiFetch (`${API_BASE_URL}/getUserProducts.php?seller_id=${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setUserProducts(data.products);
      } else {
        setError(data.error || 'Failed to fetch products');
        setUserProducts([]);
      }
    } catch (error) {
      console.error('Error fetching user products:', error);
      setError('Failed to connect to server');
      setUserProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This will also delete all their products.')) {
      return;
    }

    setLoading(true);
    try {
      const response = await /*fetch*/ apiFetch (`${API_BASE_URL}/deleteUser.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId })
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Remove user from local state
        setUsers(users.filter(user => user.id !== userId));
        
        // Show success message
        alert(`User "${data.deleted_user}" and ${data.deleted_products_count} products deleted successfully`);
        
        // Close modal if it's open for this user
        if (selectedUser && selectedUser.id === userId) {
          closeModal();
        }
      } else {
        alert(data.error || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const handleShowProducts = async (user) => {
    setSelectedUser(user);
    setShowProductModal(true);
    await fetchUserProducts(user.id);
  };

  const handleDeleteProduct = async (productId) => {
  if (!window.confirm('Are you sure you want to delete this product?')) {
    return;
  }

  setLoading(true);
  try {
    const response = await /*fetch*/ apiFetch (`${API_BASE_URL}/deleteProductAdmin.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ product_id: productId })
    });

    const data = await response.json();

    if (data.success) {
      // Remove product from local state
      setUserProducts(userProducts.filter(product => product.id !== productId));
      alert('Product deleted successfully');

      // Update user's product count in users list
      setUsers(users.map(user =>
        user.id === selectedUser.id
          ? { ...user, product_count: Math.max(0, user.product_count - 1) }
          : user
      ));
    } else {
      alert(data.error || 'Failed to delete product');
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    alert('Failed to connect to server');
  } finally {
    setLoading(false);
  }
};



  const closeModal = () => {
    setShowProductModal(false);
    setSelectedUser(null);
    setUserProducts([]);
    setError('');
  };

  return (
    <div className="admin-page">
      {/* Header */}
      <header className="admin-header">
        <div className="header-left">
          <img src={sellerspointlogo} alt="SellersPoint" className="logo" />
          <span className="site-title">SellersPoint Admin</span>
        </div>
        <nav className="header-nav">
          <a href="/home" className="nav-link">Home</a>
          <a href="/product" className="nav-link">Products</a>
          <a href="AnalyticsPage" className="nav-link">Analytics</a>
        </nav>
      </header>

      {/* Main Content */}
      <main className="admin-main">
        <h1 className="page-title">User Management</h1>
        
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <div className="users-section">
          <div className="section-header">
            <h2 className="section-title">Registered Users</h2>
            <button 
              className="refresh-btn"
              onClick={fetchUsers}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
          
          {loading && users.length === 0 ? (
            <div className="loading-message">Loading users...</div>
          ) : (
            <div className="users-list">
              {users.length === 0 ? (
                <div className="no-users">No users found</div>
              ) : (
                users.map(user => (
                  <div key={user.id} className="user-row">
                    <div className="user-info">
                      <div className="user-details">
                        <span className="user-name">{user.name}</span>
                        <span className="user-email">{user.email}</span>
                        <span className="user-products-count">
                          {user.product_count} products
                        </span>
                      </div>
                      <button 
                        className="products-dropdown"
                        onClick={() => handleShowProducts(user)}
                        disabled={loading}
                      >
                        Products <span className="dropdown-arrow">▼</span>
                      </button>
                    </div>
                    <button 
                      className="delete-user-btn"
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={loading}
                    >
                      {loading ? 'Deleting...' : 'Delete User'}
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="admin-footer">
        <div className="footer-left">
          <a href="#" className="footer-link">Terms of Service</a>
          <a href="#" className="footer-link">Privacy Policy</a>
        </div>
        <div className="footer-right">
          <a href="#" className="footer-link">Contact Us</a>
          <a href="#" className="footer-link">Help</a>
        </div>
      </footer>

      {/* Products Modal */}
      {showProductModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Products for {selectedUser?.name}</h3>
              <button className="close-modal" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              {loading ? (
                <div className="loading-message">Loading products...</div>
              ) : error ? (
                <div className="error-message">{error}</div>
              ) : userProducts.length === 0 ? (
                <p className="no-products">No products found for this user.</p>
              ) : (
                <div className="products-list">
                  {userProducts.map(product => (
                    <div key={product.id} className="product-item">
                      <img 
                        src={product.image_path} 
                        alt={product.title} 
                        className="product-image"
                        onError={(e) => {
                          e.target.src = 'httpss://via.placeholder.com/50';
                        }}
                      />
                      <div className="product-details">
                        <h4 className="product-name">{product.title}</h4>
                        <p className="product-price">${product.price}</p>
                        {product.description && (
                          <p className="product-description">
                            {product.description.substring(0, 100)}
                            {product.description.length > 100 ? '...' : ''}
                          </p>
                        )}
                      </div>
                      <button 
                        className="delete-product-btn"
                        onClick={() => handleDeleteProduct(product.id)}
                        disabled={loading}
                      >
                        {loading ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;