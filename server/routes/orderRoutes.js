const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/orderModel');
const { orders: mockOrders } = require('../utils/mockStore');

// @desc    Create new order (with mock payment payload)
// @route   POST /api/orders
// @access  Public
router.post('/', async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      user,
      guestEmail,
      paymentResult,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items in cart' });
    }

    const orderData = {
      user: user || null,
      guestEmail: guestEmail || 'guest@example.com',
      orderItems,
      shippingAddress: shippingAddress || {},
      paymentMethod: paymentMethod || 'Mock UPI / Card Gateway',
      totalPrice,
      isPaid: true,
      paymentResult: paymentResult || {
        transactionId: `TXN_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'SUCCESS',
        paidAt: new Date(),
      },
    };

    if (mongoose.connection.readyState === 1) {
      const order = new Order(orderData);
      const createdOrder = await order.save();
      return res.status(201).json(createdOrder);
    }

    // Fallback store
    const createdMockOrder = {
      _id: `ord_${Date.now()}`,
      ...orderData,
      createdAt: new Date(),
    };
    mockOrders.push(createdMockOrder);

    return res.status(201).json(createdMockOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;
