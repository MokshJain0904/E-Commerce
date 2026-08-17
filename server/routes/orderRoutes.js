const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/orderModel');
const { orders: mockOrders } = require('../utils/mockStore');

// @desc    Fetch all orders or filter by user/email
// @route   GET /api/orders
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { email, userId } = req.query;

    if (mongoose.connection.readyState === 1) {
      let query = {};
      if (userId && mongoose.Types.ObjectId.isValid(userId)) {
        query.user = userId;
      } else if (email && email.trim() !== '') {
        query.guestEmail = { $regex: email.trim(), $options: 'i' };
      }

      const orders = await Order.find(query).sort({ createdAt: -1 });
      return res.json(orders);
    }

    // Fallback store
    let filtered = [...mockOrders];
    if (email && email.trim() !== '') {
      const target = email.trim().toLowerCase();
      filtered = filtered.filter(
        (o) => o.guestEmail && o.guestEmail.toLowerCase().includes(target)
      );
    }
    return res.json(filtered.reverse());
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @desc    Create new order (with payment payload)
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

    // Ensure user ID is a valid ObjectId or null to prevent CastErrors
    const validUserId = user && mongoose.Types.ObjectId.isValid(user) ? user : null;
    const finalEmail = (guestEmail && guestEmail.trim()) || 'customer@swiftcart.com';

    const orderData = {
      user: validUserId,
      guestEmail: finalEmail,
      orderItems: orderItems.map((item) => ({
        id: Number(item.id),
        name: String(item.name),
        quantity: Number(item.quantity),
        price: Number(item.price),
        image: String(item.image || ''),
      })),
      shippingAddress: shippingAddress || {},
      paymentMethod: paymentMethod || 'Mock UPI / Card Gateway',
      totalPrice: Number(totalPrice),
      isPaid: true,
      isCancelled: false,
      paymentResult: paymentResult || {
        transactionId: `TXN_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'SUCCESS',
        paidAt: new Date(),
      },
    };

    if (mongoose.connection.readyState === 1) {
      const order = new Order(orderData);
      const createdOrder = await order.save();
      console.log('✅ Order saved to MongoDB:', createdOrder._id, 'for email:', finalEmail);
      return res.status(201).json(createdOrder);
    }

    // Fallback store
    const createdMockOrder = {
      _id: `ord_${Date.now()}`,
      ...orderData,
      createdAt: new Date(),
    };
    mockOrders.push(createdMockOrder);
    console.log('⚠️ Order saved to in-memory store:', createdMockOrder._id);

    return res.status(201).json(createdMockOrder);
  } catch (error) {
    console.error('❌ Error saving order to MongoDB:', error.message);
    res.status(500).json({ message: 'Server Error saving order', error: error.message });
  }
});

// @desc    Cancel an order
// @route   PUT /api/orders/:id/cancel
// @access  Public
router.put('/:id/cancel', async (req, res) => {
  try {
    const orderId = req.params.id;

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(orderId)) {
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      if (order.isCancelled) {
        return res.status(400).json({ message: 'Order is already cancelled' });
      }

      order.isCancelled = true;
      order.cancelledAt = new Date();

      const updatedOrder = await order.save();
      console.log(`🚫 Order ${orderId} cancelled in MongoDB`);
      return res.json(updatedOrder);
    }

    // Fallback in-memory store cancel
    const mockOrder = mockOrders.find((o) => o._id === orderId);
    if (!mockOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    mockOrder.isCancelled = true;
    mockOrder.cancelledAt = new Date();
    console.log(`🚫 Order ${orderId} cancelled in fallback store`);

    return res.json(mockOrder);
  } catch (error) {
    console.error('Error cancelling order:', error.message);
    res.status(500).json({ message: 'Server Error cancelling order', error: error.message });
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(req.params.id)) {
      const order = await Order.findById(req.params.id);
      if (order) return res.json(order);
    }
    const found = mockOrders.find((o) => o._id === req.params.id);
    if (found) return res.json(found);

    res.status(404).json({ message: 'Order not found' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
