const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

/* ================= REGISTER ================= */
router.post('/register', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      role: role || 'USER',
    });

    return res.status(201).json({
      id: user._id,
      email: user.email,
      role: user.role,
    });

  } catch (error) {
    console.error('REGISTER ERROR:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

/* ================= LOGIN ================= */
router.post('/login', async (req, res) => {
  try {
    console.log('LOGIN BODY:', req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = await User.findOne({ email });
    console.log('USER FROM DB:', user);

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('PASSWORD MATCH:', isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return res.json({ token });

  } catch (error) {
    console.error('LOGIN ERROR:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
