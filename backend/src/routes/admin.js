// backend/src/routes/admin.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { audioStorage, imageStorage } = require('../config/cloudinary');
const Story = require('../models/Story');
const Category = require('../models/Category');
const { protect, restrictTo } = require('../middleware/auth');

// Protect all admin routes
router.use(protect);
router.use(restrictTo('admin', 'moderator'));

// Configure separate multer instances for Cloudinary
const uploadAudio = multer({ 
  storage: audioStorage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

const uploadImage = multer({ 
  storage: imageStorage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// ============================================
// FILE UPLOAD ROUTES
// ============================================

// Upload audio file
router.post('/upload/audio', uploadAudio.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No audio file uploaded' 
      });
    }

    res.json({ 
      success: true, 
      data: {
        filename: req.file.filename,
        url: req.file.path, // Cloudinary URL
        size: req.file.size
      }
    });
  } catch (error) {
    console.error('Audio upload error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Upload thumbnail
router.post('/upload/thumbnail', uploadImage.single('thumbnail'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No thumbnail file uploaded' 
      });
    }

    res.json({ 
      success: true, 
      data: {
        filename: req.file.filename,
        url: req.file.path, // Cloudinary URL
        size: req.file.size
      }
    });
  } catch (error) {
    console.error('Thumbnail upload error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// ============================================
// STORY MANAGEMENT ROUTES
// ============================================

// GET all stories (with pagination and filters)
router.get('/stories', async (req, res) => {
  try {
    const { page = 1, limit = 20, category, search, isActive } = req.query;
    
    const query = {};
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const stories = await Story.find(query)
      .populate('category', 'name icon color')
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

// GET single story
router.get('/stories/:id', async (req, res) => {
  try {
    const story = await Story.findById(req.params.id).populate('category');
    if (!story) {
      return res.status(404).json({ success: false, message: 'Story not found' });
    }
    res.json({ success: true, data: story });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST - Create new story (receives URLs from separate uploads)
router.post('/stories', async (req, res) => {
  try {
    const {
      title,
      titleArabic,
      description,
      audioUrl,
      thumbnail,
      category,
      narrator,
      ageGroup,
      duration,
      language,
      isFeatured
    } = req.body;

    // Validate required fields
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    if (!audioUrl) {
      return res.status(400).json({
        success: false,
        message: 'Audio file is required'
      });
    }

    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Category is required'
      });
    }

    // Create slug
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') +
      '-' +
      Date.now();

    // Create story
    const story = await Story.create({
      title,
      titleArabic,
      description,
      audioUrl,
      thumbnail: thumbnail || null,
      category,
      narrator,
      ageGroup,
      duration: parseInt(duration) || 0,
      language: language || 'hindi',
      isFeatured: isFeatured || false,
      slug
    });

    // Update category story count
    await Category.findByIdAndUpdate(category, {
      $inc: { storyCount: 1 }
    });

    res.status(201).json({
      success: true,
      data: story
    });
  } catch (error) {
    console.error('Create story error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// PUT - Update story
router.put('/stories/:id', async (req, res) => {
  try {
    const oldStory = await Story.findById(req.params.id);
    
    if (!oldStory) {
      return res.status(404).json({ 
        success: false, 
        message: 'Story not found' 
      });
    }

    const story = await Story.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      {
        new: true,
        runValidators: true
      }
    );
    
    // Update category counts if category changed
    if (oldStory.category.toString() !== story.category.toString()) {
      await Category.findByIdAndUpdate(oldStory.category, { 
        $inc: { storyCount: -1 } 
      });
      await Category.findByIdAndUpdate(story.category, { 
        $inc: { storyCount: 1 } 
      });
    }
    
    res.json({ success: true, data: story });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE - Delete story
router.delete('/stories/:id', async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    
    if (!story) {
      return res.status(404).json({ 
        success: false, 
        message: 'Story not found' 
      });
    }
    
    // Note: Cloudinary files are not deleted automatically
    // You may want to add cloudinary.uploader.destroy() here
    // to delete files from Cloudinary when story is deleted
    
    await Story.findByIdAndDelete(req.params.id);
    
    // Update category story count
    await Category.findByIdAndUpdate(story.category, {
      $inc: { storyCount: -1 }
    });
    
    res.json({ 
      success: true, 
      message: 'Story deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// ============================================
// CATEGORY MANAGEMENT ROUTES
// ============================================

// GET all categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find().sort({ order: 1 });
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST - Create category
router.post('/categories', async (req, res) => {
  try {
    const { name, nameArabic, icon, color, description } = req.body;
    
    const category = await Category.create({
      name,
      nameArabic,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      icon: icon || '📖',
      color: color || '#10b981',
      description
    });
    
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT - Update category
router.put('/categories/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      {
        new: true,
        runValidators: true
      }
    );
    
    if (!category) {
      return res.status(404).json({ 
        success: false, 
        message: 'Category not found' 
      });
    }
    
    res.json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE - Delete category
router.delete('/categories/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ 
        success: false, 
        message: 'Category not found' 
      });
    }
    
    // Check if category has stories
    const storyCount = await Story.countDocuments({ category: req.params.id });
    if (storyCount > 0) {
      return res.status(400).json({ 
        success: false, 
        message: `Cannot delete category with ${storyCount} stories. Delete or reassign stories first.` 
      });
    }
    
    await Category.findByIdAndDelete(req.params.id);
    res.json({ 
      success: true, 
      message: 'Category deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// ============================================
// ANALYTICS & STATS
// ============================================

router.get('/stats', async (req, res) => {
  try {
    const totalStories = await Story.countDocuments();
    const activeStories = await Story.countDocuments({ isActive: true });
    const totalCategories = await Category.countDocuments();
    const totalPlays = await Story.aggregate([
      { $group: { _id: null, total: { $sum: '$playCount' } } }
    ]);
    
    // Most played stories
    const mostPlayed = await Story.find()
      .sort({ playCount: -1 })
      .limit(5)
      .populate('category', 'name icon')
      .select('title playCount category')
      .lean();
    
    // Stories by category
    const storiesByCategory = await Story.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { 
        $lookup: { 
          from: 'categories', 
          localField: '_id', 
          foreignField: '_id', 
          as: 'category' 
        } 
      },
      { $unwind: '$category' },
      { 
        $project: { 
          name: '$category.name', 
          icon: '$category.icon', 
          count: 1 
        } 
      }
    ]);
    
    res.json({
      success: true,
      data: {
        overview: {
          totalStories,
          activeStories,
          totalCategories,
          totalPlays: totalPlays[0]?.total || 0
        },
        mostPlayed,
        storiesByCategory
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// ============================================
// TEST CLOUDINARY CONNECTION
// ============================================

router.get('/test-cloudinary', async (req, res) => {
  try {
    const { cloudinary } = require('../config/cloudinary');
    const config = cloudinary.config();
    
    res.json({
      success: true,
      message: 'Cloudinary connected successfully',
      cloudName: config.cloud_name,
      apiKeyLength: config.api_key ? config.api_key.length : 0
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Cloudinary connection failed',
      error: error.message
    });
  }
});

module.exports = router;