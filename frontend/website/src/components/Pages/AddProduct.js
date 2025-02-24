import React, { useState } from 'react';
import axios from 'axios';
import './AddProduct.css'; // Import the CSS file
import ImageUpload from './ImageUpload';
import no from '../images/no.jpg' ;

const AddProduct = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [category, setCategory] = useState('');
  const [productImage, setProductImage] = useState(no);
  const [description, setDescription] = useState(''); // New state for description
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // Added loading state

  const handleImageChange = (file) => {
    setProductImage(file); // Update product image state when a new file is selected
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state

    // Create a FormData object to send the image along with other data
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    if (quantity) formData.append('quantity', quantity); // Only append if quantity is provided
    if (category) formData.append('category', category); // Only append if category is provided
    if (description) formData.append('description', description); // Append description
    if (productImage) {
      formData.append('productImage', productImage);
    }

    try {
      const token = localStorage.getItem('token'); // Assuming token is stored in local storage
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/products`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage(response.data.message || 'Product added successfully!');
      // Reset the form fields
      setName('');
      setPrice('');
      setQuantity(0);
      setCategory('');
      setDescription('');
      setProductImage(null);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to add product.');
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="addproduct-container">
      <h2>Add Product</h2>
      <div className="form-layout">
        <div className="upload-section">
          <ImageUpload onImageChange={handleImageChange} />
        </div>
        <form onSubmit={handleSubmit} className="details-section">
          <div>
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Price:</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              min="0"
            />
          </div>
          <div>
            <label>Quantity:</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="0"
              className="quantity-input"
            />
          </div>
          <div>
            <label>Category:</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <div>
            <label>Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add Product'}
          </button>
        </form>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AddProduct;
