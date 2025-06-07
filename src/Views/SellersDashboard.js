import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SellersDashboard.css';
import sellerspointlogo from '../assets/images/logo512.png';
import zuluMaskImage from '../assets/images/zulu-mask.jpeg';
import beadsImage from '../assets/images/beads.jpeg';
import statueImage from '../assets/images/statue.jpeg';
import { isSeller } from '../utils/auth';

import { apiFetch } from '../utils/apiFetch'

const SellersDashboard = () => {
  const navigate = useNavigate();
  const sellerId = localStorage.getItem('seller_id');
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);

  const defaultProducts = [
    {
      id: 'default-1',
      name: 'Zulu Mask',
      price: 'R500.00',
      image: zuluMaskImage,
      alt: 'Traditional Zulu Mask',
      isDefault: false,
    },
    {
      id: 'default-2',
      name: 'Beads',
      price: 'R350.00',
      image: beadsImage,
      alt: 'Colorful African Beads',
      isDefault: false,
    },
    {
      id: 'default-3',
      name: 'Statue',
      price: 'R700.00',
      image: statueImage,
      alt: 'African Sculpture Statue',
      isDefault: false,
    },
  ];

  useEffect(() => {
    if (!isSeller()) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const loadProducts = () => {
      try {
        const savedProducts = JSON.parse(localStorage.getItem('sellerProducts') || '[]');
        setProducts([...defaultProducts, ...savedProducts]);
      } catch (error) {
        console.error('Error loading products from localStorage:', error);
        setProducts(defaultProducts);
      }
    };

    loadProducts();

    const handleStorageChange = (e) => {
      if (e.key === 'sellerProducts') {
        loadProducts();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    if (!sellerId) return;

    /*fetch*/ apiFetch (`https://sellerspoint.infinityfreeapp.com/api/getProducts.php?seller_id=${sellerId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.products)) {
          const apiProducts = data.products.map((p) => ({
            id: p.id.toString(),
            name: p.title,
            price: `R${p.price}`,
            image: p.image_path.startsWith('https') 
  ? p.image_path 
  : `https://sellerspoint.infinityfreeapp.com/${p.image_path.replace(/\\/g, '')}`,

            alt: p.title,
            description: p.description || '',
            isDefault: false,
          }));

          const combined = new Map();
          [...defaultProducts, ...products, ...apiProducts].forEach((prod) => {
            combined.set(prod.id, prod);
          });
          setProducts(Array.from(combined.values()));
        }
      })
      .catch((error) => {
        console.error('Failed to fetch products:', error);
      });
  }, [sellerId]);

  const startEdit = (product) => {
    setEditingProduct(product);
    setImagePreview(product.image);
    setSelectedImageFile(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditSave = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = editingProduct.image;

      // If a new image was selected, upload it first
      if (selectedImageFile) {
        const formData = new FormData();
        formData.append('image', selectedImageFile);
        formData.append('product_id', editingProduct.id);

        const imageResponse = await /*fetch*/ apiFetch ('https://sellerspoint.infinityfreeapp.com/api/uploadImage.php', {
          method: 'POST',
          body: formData,
        });

        const imageData = await imageResponse.json();
        if (imageData.success) {
          imageUrl = `https://sellerspoint.infinityfreeapp.com/uploads/${imageData.image_path}`;


        } else {
          alert('Failed to upload image');
          return;
        }
      }

      // Update product details
      const response = await /*fetch*/ apiFetch ('https://sellerspoint.infinityfreeapp.com/api/updateProduct.php', {
        method: 'POST',
        //headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingProduct.id,
          name: editingProduct.name,
          price: editingProduct.price.replace(/^R/, ''),
          description: editingProduct.description,
          image: imageUrl,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setProducts((prev) =>
          prev.map((p) => 
            p.id === editingProduct.id 
              ? { ...editingProduct, image: imageUrl }
              : p
          )
        );
        setEditingProduct(null);
        setImagePreview(null);
        setSelectedImageFile(null);
      } else {
        alert('Failed to update product.');
      }
    } catch (err) {
      console.error('Error updating product:', err);
      alert('Something went wrong.');
    }
  };

  const handleModalClose = () => {
    setEditingProduct(null);
    setImagePreview(null);
    setSelectedImageFile(null);
  };

  const deleteProduct = (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    /*fetch*/ apiFetch ('https://sellerspoint.infinityfreeapp.com/api/deleteProduct.php', {
      method: 'POST',
      //headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProducts(prev => prev.filter(p => p.id !== id));
          console.log(`Deleted product ${id}`);
        } else {
          alert('Delete failed');
        }
      })
      .catch((error) => {
        console.error('Error deleting product:', error);
        alert('An error occurred. Please try again.');
      });
  };

  const handleAddNewProduct = () => {
    navigate('/addproduct');
  };

  return (
    <div className="sellers-dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <img src={sellerspointlogo} alt="SellerPoint Logo" className="logo" />
          <h1 className="dashboard-title">Seller Dashboard</h1>
        </div>
        <nav className="header-nav">
          <a href="/home" className="nav-link">Home</a>
          <a href="/orders" className="nav-link">Orders</a>
        </nav>
      </header>

      <main className="dashboard-main">
        <div className="products-section">
          <div className="section-header">
            <h2 className="section-title">Manage Products ({products.length})</h2>
            <button className="add-product-btn" onClick={handleAddNewProduct}>
              Add New Product
            </button>
          </div>

          {products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#6c757d' }}>
              <p>No products found. Add your first product to get started!</p>
            </div>
          ) : (
            <div className="products-grid">
              {products.map((product) => (
                <div key={product.id} className="product-card">
                  <div className="product-image-container">
                    <img
                      src={product.image}
                      alt={product.alt || `${product.name} image`}
                      className="product-image"
                    />
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-price">{product.price}</p>
                    {product.description && (
                      <p className="product-description">
                        {product.description.substring(0, 100)}...
                      </p>
                    )}
                  </div>
                  <div className="product-actions">
                    <button onClick={() => startEdit(product)} className="edit-btn" title="Edit product">
                      Edit
                    </button>
                    <button onClick={() => deleteProduct(product.id)} className="delete-btn" title="Delete product">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {editingProduct && (
        <div className="modal-overlay" onClick={handleModalClose}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Edit Product</h2>
              <button className="modal-close-btn" onClick={handleModalClose}>
                ×
              </button>
            </div>
            
            <form onSubmit={handleEditSave} className="modal-form">
              <div className="form-group">
                <label htmlFor="product-name">Product Name</label>
                <input
                  id="product-name"
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, name: e.target.value })
                  }
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="product-price">Price (R)</label>
                <input
                  id="product-price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={editingProduct.price.replace(/^R/, '')}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, price: `R${e.target.value}` })
                  }
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="product-description">Description</label>
                <textarea
                  id="product-description"
                  value={editingProduct.description || ''}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, description: e.target.value })
                  }
                  placeholder="Enter product description"
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label htmlFor="product-image">Product Image</label>
                <div className="image-upload-container">
                  {imagePreview && (
                    <div className="image-preview">
                      <img src={imagePreview} alt="Product preview" />
                    </div>
                  )}
                  <div className="image-upload-section">
                    <input
                      id="product-image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="image-input"
                    />
                    <label htmlFor="product-image" className="image-upload-btn">
                      {selectedImageFile ? 'Change Image' : 'Upload New Image'}
                    </label>
                    <p className="image-help-text">
                      {selectedImageFile ? `Selected: ${selectedImageFile.name}` : 'Choose a new image to replace the current one'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={handleModalClose} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellersDashboard;