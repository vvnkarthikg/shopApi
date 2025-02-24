const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');
const checkAuth = require('../middlewares/check-auth');

const formatDate = (dateString) => {
    return new Date(dateString).toISOString(); // Return the ISO string, which is standard
};


// Get all orders for a user or all orders if admin
router.get('/', checkAuth, async (req, res) => {
    try {
        const userId = req.userData.userId;
        const isAdmin = req.userData.isAdmin; // Check if user is admin

        let orders; // Declare orders variable

        if (isAdmin) {
            // Fetch all orders if the user is an admin
            orders = await Order.find().populate('product');
        } else {
            // Fetch only the user's orders
            orders = await Order.find({ user: userId }).populate('product');
        }

        // Transforming orders to include necessary fields
        const transformedOrders = orders.map(order => {
            return {
                id: order._id,
                product: {
                    id: order.product._id,
                    name: order.product.name,
                    price: order.product.price,
                    productImage: order.product.productImage,
                    quantity: order.product.quantity,
                    category: order.product.category,
                    description: order.product.description,
                },
                quantity: order.quantity,
                orderNumber: order.orderNumber,
                status: order.status,
                createdOn: formatDate(order.createdOn), // Format createdOn date
                deliveredOn: order.deliveredOn ? formatDate(order.deliveredOn) : null // Format deliveredOn date if available
            };
        });

        res.status(200).json({
            count: orders.length,
            orders: transformedOrders
        });
    } catch (err) {
        console.error('Error fetching orders:', err.message);
        res.status(500).json({ message: err.message });
    }
});

// Create a new order
router.post('/', checkAuth, async (req, res) => {
    try {
        const pId = req.body.id;
        const product = await Product.findById(pId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if the requested quantity is available
        if (req.body.quantity > product.quantity) {
            return res.status(400).json({ message: 'Insufficient product quantity' });
        }

        // Update the product's quantity
        product.quantity -= req.body.quantity;
        await product.save();

        // Create the order and associate it with the logged-in user
        const newOrder = new Order({
            quantity: req.body.quantity,
            product: pId,
            user: req.userData.userId // Associate with logged-in user
        });

        // Save the order and populate the product details
        let result = await newOrder.save();
        result = await result.populate('product'); // Populate after saving

        return res.status(201).json({ message: 'Order created', result });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

// Get a specific order by ID
router.get('/:orderId', checkAuth, async (req, res) => {
    try {
        const id = req.params.orderId;
        const order = await Order.findById(id).populate('product');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({
            id: order._id,
            product: {
                id: order.product._id,
                name: order.product.name,
                price: order.product.price,
                productImage: order.product.productImage,
                quantity: order.product.quantity,
                category: order.product.category,
                description: order.product.description,
            },
            quantity: order.quantity,
            orderNumber: order.orderNumber,
            status: order.status,
            createdOn: formatDate(order.createdOn), // Format createdOn date
            deliveredOn: order.deliveredOn ? formatDate(order.deliveredOn) : null // Format deliveredOn date if available
        });
        
    } catch (error) {
        console.error('Error fetching the specific order:', error.message);
        res.status(500).json(error);
    }
});

// Delete an order by ID
router.delete('/:orderId', checkAuth, async (req, res) => {
    try {
        const id = req.params.orderId;

        // Find the order by ID
        const del_Order = await Order.findById(id); 
        if (!del_Order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Find the associated product
        const product = await Product.findById(del_Order.product); 
        if (product) {
            product.quantity += del_Order.quantity; 
            await product.save(); 
        }

        // Delete the order
        await Order.findByIdAndDelete(id); 

        res.status(200).json({
            message: 'Order deleted and product quantity updated',
            order: del_Order
        });
    } catch (error) {
        console.error('Error deleting the order:', error.message);
        res.status(500).send({ message: error.message });
    }
});

module.exports = router;