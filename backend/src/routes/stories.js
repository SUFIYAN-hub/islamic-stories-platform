// backend/src/routes/stories.js
const express = require('express');
const router = express.Router();
const Story = require('../models/Story');

// GET all stories with filters
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      language, 
      ageGroup, 
      search, 
      page = 1, 
      limit = 12,
      featured 
    } = req.query;

    const query = { isActive: true };

    // Apply filters
    if (category) query.category = category;
    if (language) query.language = language;
    if (ageGroup) query.ageGroup = ageGroup;
    if (featured === 'true') query.isFeatured = true;
    if (search) {
      query.$text = { $search: search };
    }

    const stories = await Story.find(query)
      .populate('category', 'name nameArabic slug icon color')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const count = await Story.countDocuments(query);

    res.json({
      success: true,
      data: stories,
      pagination: {
        total: count,
        page: Number(page),
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET single story by slug
router.get('/:slug', async (req, res) => {
  try {
    const story = await Story.findOne({ slug: req.params.slug, isActive: true })
      .populate('category', 'name nameArabic slug icon color');

    if (!story) {
      return res.status(404).json({ success: false, message: 'Story not found' });
    }

    // Increment play count
    story.playCount += 1;
    await story.save();

    res.json({ success: true, data: story });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET related stories
router.get('/:slug/related', async (req, res) => {
  try {
    const story = await Story.findOne({ slug: req.params.slug });
    if (!story) {
      return res.status(404).json({ success: false, message: 'Story not found' });
    }

    const relatedStories = await Story.find({
      _id: { $ne: story._id },
      category: story.category,
      isActive: true
    })
    .populate('category', 'name slug icon')
    .limit(6)
    .lean();

    res.json({ success: true, data: relatedStories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
