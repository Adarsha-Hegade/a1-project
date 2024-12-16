import express from 'express';
import multer from 'multer';
import path from 'path';
import { auth, checkPermission } from '../middleware/auth.js';
import Product from '../models/Product.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// Get all products
router.get('/', auth, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get product statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const products = await Product.find();
    
    const stats = {
      totalProducts,
      lowStock: products.filter(p => p.availableStock < 10).length,
      outOfStock: products.filter(p => p.availableStock === 0).length,
      totalValue: products.reduce((acc, p) => acc + (p.stock * 10), 0), // Example calculation
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new product
router.post('/', auth, checkPermission('create:products'), upload.single('image'), async (req, res) => {
  try {
    const productData = {
      ...req.body,
      image: req.file ? `/uploads/${req.file.filename}` : undefined,
    };

    const product = new Product(productData);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update product
router.put('/:id', auth, checkPermission('update:products'), upload.single('image'), async (req, res) => {
  try {
    const updates = {
      ...req.body,
      ...(req.file && { image: `/uploads/${req.file.filename}` }),
    };

    const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete product
router.delete('/:id', auth, checkPermission('delete:products'), async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;