// models/order.js
const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

// Define the order schema
const orderSchema = new mongoose.Schema({
    product: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true 
    }, // to get product details populated into here
    quantity: {
        type: Number,
        default: 1
    },
    orderNumber: { 
        type: Number, 
        unique: true 
    },
    user: { // Add user reference to associate orders with users
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming you have a User model
        required: true
    },
    status: {
        type: String,
        enum: ['Processing', 'Delivered', 'Failed'], // Define possible statuses
        default: 'Processing' // Default status when an order is created
    },
    createdOn: {
        type: Date,
        default: Date.now // Automatically set to current date/time when created
    },
    deliveredOn: {
        type: Date,
        default: null // Initially set to null, can be updated when the order is delivered
    }
});

// Apply the auto-increment plugin to orderSchema
orderSchema.plugin(AutoIncrement, { inc_field: 'orderNumber' });

module.exports = mongoose.model('Order', orderSchema);