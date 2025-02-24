import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './UserOrders.css';
import noImage from '../images/no.jpg'; // Placeholder image for products

const UserOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    const confirmLogin = window.confirm("Please log in to view your orders.");
                    if (confirmLogin) {
                        navigate('/auth');
                    }
                    return;
                }

                const response = await axios.get(`${process.env.REACT_APP_API_URL}/orders`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setOrders(response.data.orders);
            } catch (err) {
                if (err.response?.status === 401 && err.response.data.message === "Invalid token") {
                    setError("Session timed out, please log in again.");
                } else {
                    setError(err.response?.data?.message || 'Failed to fetch orders');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [navigate]);

    if (loading) return <p className="order-loading">Loading...</p>;
    if (error) return <p className="order-error">{error}</p>;

    return (
        <div className="user-orders">
            <h1 className="orders-title">Your Orders</h1>
            <div className="order-container">
                {orders.length === 0 ? (
                    <p>No orders found.</p>
                ) : (
                    <ul className="order-list">
                        {orders.map(order => (
                            <li key={order.id} className="order-item">
                                <img 
                                    src={order.product.productImage && order.product.productImage !== "" 
                                        ? `${process.env.REACT_APP_API_URL}/${order.product.productImage}` 
                                        : noImage} 
                                    alt={order.product.name} 
                                    className="order-item-image" 
                                />
                                <div className="order-item-details">
                                    <span className="order-item-name">{order.product.name}</span>
                                    <span className="order-item-quantity">Quantity: {order.quantity}</span>
                                    {/* Status with conditional styling */}
                                    <span className="order-item-status">
                                        Status: <span className={getStatusClass(order.status)}>{order.status || 'Processing'}</span>
                                    </span>
                                    {/* Container for Order Number and Date */}
                                    <div className="order-meta">
                                        {/* Conditional rendering for createdOn and deliveredOn */}
                                        <span className="order-item-date">
                                            {order.status === 'Delivered' 
                                                ? `Delivered On: ${formatDate(order.deliveredOn)}`
                                                : `Created On: ${formatDate(order.createdOn)}`}
                                        </span>
                                        <span className="order-item-number">Order Number: {order.orderNumber}</span>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

// Function to determine the status class based on status
const getStatusClass = (status) => {
    switch (status) {
        case 'Delivered':
            return 'status-delivered'; // Green
        case 'Failed':
            return 'status-failed'; // Red
        case 'Processing':
        default:
            return 'status-processing'; // Default color
    }
};

// Function to format date into a human-readable format
const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
};

export default UserOrders;