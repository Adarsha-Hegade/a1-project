import express from 'express';
import { auth, checkPermission } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// Get all users
router.get('/', auth, checkPermission('read:users'), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new user
router.post('/', auth, checkPermission('create:users'), async (req, res) => {
  try {
    const { username, email, password, role, permissions } = req.body;
    const user = new User({ username, email, password, role, permissions });
    await user.save();
    res.status(201).json({ ...user.toJSON(), password: undefined });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user
router.put('/:id', auth, checkPermission('update:users'), async (req, res) => {
  try {
    const updates = { ...req.body };
    delete updates.password; // Don't allow password updates through this route

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true })
      .select('-password');
      
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user
router.delete('/:id', auth, checkPermission('delete:users'), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;