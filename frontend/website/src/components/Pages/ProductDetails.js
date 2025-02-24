import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import QuantityModal from './QuantityModal';
import './ProductDetails.css';
import no from '../images/no.jpg';

const ProductDetails = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [quantityInputValue, setQuantityInputValue] = useState(1);
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState('');
    const [editedPrice, setEditedPrice] = useState('');
    const [editedQuantity, setEditedQuantity] = useState(0);
    const [editedCategory, setEditedCategory] = useState('');
    const [editedDescription, setEditedDescription] = useState('');
    const navigate = useNavigate();

    const fetchProduct = useCallback(async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/products/${productId}`);
            setProduct(response.data);
            setEditedName(response.data.name);
            setEditedPrice(response.data.price);
            setEditedQuantity(response.data.quantity);
            setEditedCategory(response.data.category);
            setEditedDescription(response.data.description);
        } catch (err) {
            setError('Product not found');
        } finally {
            setLoading(false);
        }
    }, [productId]);

    useEffect(() => {
        fetchProduct();
    }, [fetchProduct]);

    const handleOrderNow = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please log in to place an order.');
            navigate('/auth');
        } else {
            setShowModal(true);
        }
    };

    const handleQuantityConfirm = async (quantity) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${process.env.REACT_APP_API_URL}/orders/`, { quantity, id: product._id }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert('Order placed successfully!');
            navigate('/orders');
        } catch (err) {
            alert('Failed to place order. Please try again.');
        }
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleSaveChanges = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`${process.env.REACT_APP_API_URL}/products/${productId}`, {
                name: editedName,
                price: editedPrice,
                quantity: editedQuantity,
                category: editedCategory,
                description: editedDescription,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert('Product updated successfully!');
            setIsEditing(false);
            await fetchProduct();
        } catch (err) {
            alert('Failed to update product. Please try again.');
        }
    };

    const handleDelete = async () => {
        const confirmation = window.confirm('Are you sure you want to delete this product?');
        if (confirmation) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`${process.env.REACT_APP_API_URL}/products/${productId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                alert('Product deleted successfully!');
                navigate('/products');
            } catch (err) {
                alert('Failed to delete product. Please try again.');
            }
        }
    };

    if (loading) return <p className="loading">Loading...</p>;
    if (error) return <p className="error">{error}</p>;

    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const discountedPrice = (product.price * 0.9).toFixed(2);

    return (
        <div className="product-details-container">
            {product ? (
                <div className="product-layout">
                    <img
                        src={product.productImage ? `${process.env.REACT_APP_API_URL}/${product.productImage}` : no}
                        alt={product.name}
                        className="product-image"
                    />
                    <div className="product-info">
                        <p className="product-category">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editedCategory}
                                    onChange={(e) => setEditedCategory(e.target.value)}
                                />
                            ) : (
                                ` ${product.category}`
                            )}
                        </p>
                        <h3 className="product-name">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editedName}
                                    onChange={(e) => setEditedName(e.target.value)}
                                />
                            ) : (
                                product.name
                            )}
                        </h3>
                        <p className="product-price">
                            ₹{isEditing ? (
                                <input
                                    type="number"
                                    value={editedPrice}
                                    onChange={(e) => setEditedPrice(e.target.value)}
                                    min="0"
                                />
                            ) : (
                                product.price
                            )}
                        </p>
                        <p className="product-quantity">
                            {isEditing ? (
                                <input
                                    type="number"
                                    value={editedQuantity}
                                    onChange={(e) => setEditedQuantity(e.target.value)}
                                    min="0"
                                />
                            ) : (
                                product.quantity
                            ) } left
                        </p>
                        <div className="product-description">
                            <h4>About this item</h4>
                            {isEditing ? (
                                <textarea
                                    value={editedDescription}
                                    onChange={(e) => setEditedDescription(e.target.value)}
                                />
                            ) : (
                                <p>{product.description}</p>
                            )}
                        </div>
                        {!isAdmin && (
                            <button className="buy-now" onClick={handleOrderNow}>Order Now</button>
                        )}
                        {isAdmin && (
                            isEditing ? (
                                <div className="button-container">
                                    <button onClick={handleSaveChanges} className="save-changes">Save Changes</button>
                                    <button onClick={handleEditToggle} className="cancel-edit">Cancel</button>
                                </div>
                            ) : (
                                <div className="button-container">
                                    <button onClick={handleEditToggle} className="edit-button">Edit</button>
                                    <button onClick={handleDelete} className="delete-button">Delete</button>
                                </div>
                            )
                        )}
                    </div>
                </div>
            ) : (
                <p>No product details available.</p>
            )}
            <QuantityModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={handleQuantityConfirm}
                quantityInputValue={quantityInputValue}
                setQuantityInputValue={setQuantityInputValue}
            />
        </div>
    );
};

export default ProductDetails;
