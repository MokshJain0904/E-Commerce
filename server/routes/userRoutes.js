const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const generateToken = require('../utils/generateToken');
const { protect } = require('../middleware/authMiddleware');
const { users: mockUsers } = require('../utils/mockStore');

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    if (mongoose.connection.readyState === 1) {
      const userExists = await User.findOne({ email });

      if (userExists) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      const user = await User.create({ name, email, password });

      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
      });
    }

    // In-memory fallback
    const userExistsMock = mockUsers.find((u) => u.email === email);
    if (userExistsMock) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const mockUser = {
      _id: `user_${Date.now()}`,
      name,
      email,
      password: hashedPassword,
      isAdmin: false,
    };
    mockUsers.push(mockUser);

    return res.status(201).json({
      _id: mockUser._id,
      name: mockUser.name,
      email: mockUser.email,
      isAdmin: mockUser.isAdmin,
      token: generateToken(mockUser._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter email and password' });
    }

    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email });

      if (user && (await user.matchPassword(password))) {
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user._id),
        });
      }
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // In-memory fallback check
    const mockUser = mockUsers.find((u) => u.email === email);
    if (mockUser) {
      const isMatch = await bcrypt.compare(password, mockUser.password);
      if (isMatch) {
        return res.json({
          _id: mockUser._id,
          name: mockUser.name,
          email: mockUser.email,
          isAdmin: mockUser.isAdmin,
          token: generateToken(mockUser._id),
        });
      }
    }

    // Demo user fallback if no users in store
    if (email === 'user@example.com' && password === 'password123') {
      return res.json({
        _id: 'demo_user_1',
        name: 'Demo User',
        email: 'user@example.com',
        isAdmin: false,
        token: generateToken('demo_user_1'),
      });
    }

    res.status(401).json({ message: 'Invalid email or password' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;
