// backend/src/routes/categories.js
const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Story = require('../models/Story');

// GET all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ order: 1 })
      .lean();

    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET category by slug with stories
router.get('/:slug', async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug, isActive: true });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const stories = await Story.find({ category: category._id, isActive: true })
      .populate('category', 'name slug icon')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ 
      success: true, 
      data: { 
        category,
        stories 
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;