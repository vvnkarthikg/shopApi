const express = require('express');
const router = express.Router();

const Product = require('../models/product');


// Define routes
router.get('/', async(req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

module.exports = router;