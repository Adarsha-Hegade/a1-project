import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Check if this is the first user
router.get('/check-first-user', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    res.json({ isFirstUser: userCount === 0 });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    res.json({ token, user: { ...user.toJSON(), password: undefined } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role, permissions } = req.body;
    
    // For first user registration, check if there are no existing users
    const userCount = await User.countDocuments();
    if (userCount === 0 && role !== 'admin') {
      return res.status(400).json({ message: 'First user must be an admin' });
    } else if (userCount > 0 && !req.user?.role === 'admin') {
      return res.status(403).json({ message: 'Only admins can create new users' });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = new User({ username, email, password, role, permissions });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    res.status(201).json({ token, user: { ...user.toJSON(), password: undefined } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;