//we install mongoose-sequence to auto-increment order id

const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number, // Changed to Number for price, it should not be a string
        required: true,
        default: 0
    },
    productImage: {
        type: String,
        default: ""
    },
    productId: { // Auto-incrementing field
        type: Number,
        unique: true
    },
    quantity:{
        type:Number,
        default:0
    },
    category:{
        type:String,
        required : true,
        default:""
    },
    description:{
        type:String,
        default : "Indulge in the delicious taste of this premium-quality food product, made from the finest ingredients to ensure a fresh and flavorful experience. Perfect for a quick snack or to complement your meals, it offers a delightful balance of taste and nutrition. Carefully crafted to meet high standards of quality, this product is a great choice for health-conscious consumers. Ideal for sharing with family and friends or enjoying on your own."
    }
}, {
    timestamps: true
});

// Apply the auto-increment plugin to productSchema
productSchema.plugin(AutoIncrement, { inc_field: 'productId' });

module.exports = mongoose.model('Product', productSchema);
