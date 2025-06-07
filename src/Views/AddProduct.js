import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddProduct.css';
import sellerspointlogo from '../assets/images/logo512.png';
import { apiFetch } from '../utils/apiFetch';

const AddProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          image: 'Please select a valid image file (JPEG, PNG, GIF)'
        }));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          image: 'Image size should be less than 5MB'
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        image: file
      }));

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);

      if (errors.image) {
        setErrors(prev => ({
          ...prev,
          image: ''
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Product description is required';
    }

    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Please enter a valid price';
    }

    if (!formData.image) {
      newErrors.image = 'Product image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const user = JSON.parse(sessionStorage.getItem('sellerspoint_user'));
    const formPayload = new FormData();
    formPayload.append('title', formData.name.trim());
    formPayload.append('description', formData.description.trim());
    formPayload.append('price', parseFloat(formData.price).toFixed(2));
    formPayload.append('image', formData.image);
    formPayload.append('seller_id', user.userId);
    formPayload.append('seller_name', user.fullname);

    try {
      const res = await /*fetch*/ apiFetch('https://sellerspoint.infinityfreeapp.com/api/AddProduct.php', {
        method: 'POST',
        body: formPayload
      });

      const data = await res.json();
      if (data.success) {
        alert("Product added successfully!");

        setFormData({
          name: '',
          description: '',
          price: '',
          image: null
        });
        setImagePreview(null);
        setErrors({});

        navigate('/sellersdashboard');
      } else {
        alert("Failed to add product. Please try again.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Server error. Please check your connection or contact support.");
    }
  };

  const handleCancel = () => {
    navigate('/sellersdashboard');
  };

  return (
    <div className="add-product-page">
      <header className="add-product-header">
        <div className="header-left">
          <img src={sellerspointlogo} alt="SellerPoint Logo" className="logo" />
          <h1 className="site-title">SellersPoint</h1>
        </div>
        <nav className="header-nav">
          <a href="/sellersdashboard" className="nav-link">Dashboard</a>
          <a href="/orders" className="nav-link">Orders</a>
        </nav>
      </header>

      <main className="add-product-main">
        <div className="page-container">
          <h1 className="page-title">Add New Product</h1>

          <div className="content-grid">
            <div className="form-section">
              <form onSubmit={handleSubmit} className="product-form">
                <div className="form-group">
                  <label className="form-label">Product Image</label>
                  <div className="image-upload-container">
                    <input
                      type="file"
                      id="product-image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="image-input"
                    />
                    <label htmlFor="product-image" className="image-upload-area">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="image-preview" />
                      ) : (
                        <div className="upload-placeholder">
                          <span className="upload-icon">📷</span>
                          <span className="upload-text">Click to upload image</span>
                        </div>
                      )}
                    </label>
                  </div>
                  {errors.image && <span className="error-message">{errors.image}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="name" className="form-label">Product Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`form-input ${errors.name ? 'error' : ''}`}
                    placeholder="Enter product name"
                  />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="description" className="form-label">Product Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className={`form-textarea ${errors.description ? 'error' : ''}`}
                    placeholder="Enter product description"
                    rows="6"
                  />
                  {errors.description && <span className="error-message">{errors.description}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="price" className="form-label">Price</label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className={`form-input ${errors.price ? 'error' : ''}`}
                    placeholder="R0.00"
                    step="0.01"
                    min="0"
                  />
                  {errors.price && <span className="error-message">{errors.price}</span>}
                </div>

                <div className="form-actions">
                  <button type="button" onClick={handleCancel} className="cancel-btn">
                    Cancel
                  </button>
                  <button type="submit" className="save-btn">
                    Save Product
                  </button>
                </div>
              </form>
            </div>

            <div className="preview-section">
              <h3 className="preview-title">Product Preview</h3>
              <div className="product-preview-card">
                <div className="preview-image-container">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Product preview" className="preview-image" />
                  ) : (
                    <div className="preview-placeholder">
                      <span className="placeholder-icon">🖼️</span>
                      <span className="placeholder-text">No image selected</span>
                    </div>
                  )}
                </div>
                <div className="preview-info">
                  <h4 className="preview-name">
                    {formData.name || 'Product Name'}
                  </h4>
                  <p className="preview-price">
                    {formData.price ? `R${parseFloat(formData.price || 0).toFixed(2)}` : 'R0.00'}
                  </p>
                  <p className="preview-description">
                    {formData.description || 'Product description will appear here...'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="add-product-footer">
        <div className="footer-content">
          <div className="contact-info">
            <h4>Contact Us</h4>
            <p>Email: support@shopbase.com</p>
            <p>Phone: +1 800 123 456</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AddProduct;
