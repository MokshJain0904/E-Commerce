const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/productModel');
const { products: mockProducts } = require('../utils/mockStore');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
  const { category, search } = req.query;

  // Check if MongoDB is connected
  if (mongoose.connection.readyState === 1) {
    try {
      let query = {};
      if (category && category !== 'All') {
        query.category = category;
      }
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
        ];
      }
      const dbProducts = await Product.find(query);
      return res.json(dbProducts);
    } catch (err) {
      console.error('MongoDB query error:', err.message);
    }
  }

  // Fallback to in-memory store
  let filtered = [...mockProducts];
  if (category && category !== 'All') {
    filtered = filtered.filter((p) => p.category === category);
  }
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
  }
  return res.json(filtered);
});

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res) => {
  const prodId = Number(req.params.id);

  if (mongoose.connection.readyState === 1) {
    try {
      const dbProduct = await Product.findOne({ id: prodId });
      if (dbProduct) return res.json(dbProduct);
    } catch (err) {
      console.error(err.message);
    }
  }

  const found = mockProducts.find((p) => p.id === prodId);
  if (found) {
    return res.json(found);
  }
  res.status(404).json({ message: 'Product not found' });
});

module.exports = router;
