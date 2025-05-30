import React from 'react';
import './SellersDashboard.css';
import sellerspointlogo from '../assets/images/logo512.png';
import zuluMaskImage from '../assets/images/zulu-mask.jpeg';
import beadsImage from '../assets/images/beads.jpeg';
import statueImage from '../assets/images/statue.jpeg';

const SellersDashboard = () => {
  const products = [
    {
      id: 1,
      name: 'Zulu Mask',
      price: 'R500.00',
      image: zuluMaskImage,
      alt: 'Traditional Zulu Mask'
    },
    {
      id: 2,
      name: 'Beads',
      price: 'R350.00',
      image: beadsImage,
      alt: 'Colorful African Beads'
    },
    {
      id: 3,
      name: 'Statue',
      price: 'R700.00',
      image: statueImage,
      alt: 'African Sculpture Statue'
    }
  ];

  const handleEdit = (productId) => {
    console.log(`Edit product ${productId}`);
    // Add edit functionality here
  };

  const handleDelete = (productId) => {
    console.log(`Delete product ${productId}`);
    // Add delete functionality here
  };

  const handleAddNewProduct = () => {
    console.log('Add new product');
    // Add new product functionality here
  };

  return (
    <div className="sellers-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <img src={sellerspointlogo} alt="SellerPoint Logo" className="logo" />
          <h1 className="dashboard-title">Seller Dashboard</h1>
        </div>
        <nav className="header-nav">
          <a href="#home" className="nav-link">Home</a>
          <a href="#orders" className="nav-link">Orders</a>
        </nav>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="products-section">
          <div className="section-header">
            <h2 className="section-title">Manage Products</h2>
            <button className="add-product-btn" onClick={handleAddNewProduct}>
              Add New Product
            </button>
          </div>

          <div className="products-grid">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image-container">
                  <img 
                    src={product.image} 
                    alt={product.alt}
                    className="product-image"
                  />
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-price">{product.price}</p>
                </div>
                <div className="product-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => handleEdit(product.id)}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SellersDashboard;