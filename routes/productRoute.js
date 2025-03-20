const express = require('express');
//just need to fetch 
const ProductController = require('../controllers/productController');

const app = express.Router();

// Routes using the class methods
app.get('/', ProductController.getAllProducts);          // Get all products
app.get('/:id', ProductController.getProductById);      // Get product by ID
app.post('/', ProductController.createProduct);         // Create a new product
app.delete('/:id', ProductController.deleteProduct);    // Delete product by ID

module.exports = app;