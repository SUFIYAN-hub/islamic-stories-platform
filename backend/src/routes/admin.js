// backend/src/routes/admin.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { audioStorage, imageStorage } = require('../config/cloudinary');
const path = require('path');
const fs = require('fs');
const Story = require('../models/Story');
const Category = require('../models/Category');
const { protect, restrictTo } = require('../middleware/auth');

// Protect all admin routes
router.use(protect);
router.use(restrictTo('admin', 'moderator'));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const type = file.fieldname; // 'audio' or 'thumbnail'
    const dir = `public/${type}`;
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'audio') {
    // Accept audio files
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed!'), false);
    }
  } else if (file.fieldname === 'thumbnail') {
    // Accept images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  } else {
    cb(null, true);
  }
};

const upload = multer({
  storage: audioStorage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

const uploadImage = multer({
  storage: imageStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// ============================================
// FILE UPLOAD ROUTES
// ============================================

// Upload audio file
router.post('/upload/audio', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const audioUrl = `${req.protocol}://${req.get('host')}/audio/${req.file.filename}`;
    
    res.json({ 
      success: true, 
      data: {
        filename: req.file.filename,
        url: audioUrl,
        size: req.file.size
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Upload thumbnail
router.post('/upload/thumbnail', upload.single('thumbnail'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const thumbnailUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    
    res.json({ 
      success: true, 
      data: {
        filename: req.file.filename,
        url: thumbnailUrl,
        size: req.file.size
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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

// POST - Create new story
// Update your story upload route:
router.post('/stories', 
  protect, 
  restrictTo('admin'),
  upload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const { title, titleArabic, description, category, narrator, ageGroup, duration, language } = req.body;
      
      // Cloudinary URLs are automatically in req.files
      const audioUrl = req.files.audio ? req.files.audio[0].path : null;
      const thumbnail = req.files.thumbnail ? req.files.thumbnail[0].path : null;
      
      if (!audioUrl) {
        return res.status(400).json({ 
          success: false, 
          message: 'Audio file is required' 
        });
      }
      
      const story = await Story.create({
        title,
        titleArabic,
        description,
        audioUrl,  // Already HTTPS from Cloudinary!
        thumbnail,
        category,
        narrator,
        ageGroup,
        duration: parseInt(duration),
        language: language || 'hindi',
        slug: title.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now()
      });
      
      res.status(201).json({
        success: true,
        data: story
      });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error.message 
      });
    }
  }
);

// PUT - Update story
router.put('/stories/:id', async (req, res) => {
  try {
    const oldStory = await Story.findById(req.params.id);
    const story = await Story.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    if (!story) {
      return res.status(404).json({ success: false, message: 'Story not found' });
    }
    
    // Update category counts if category changed
    if (oldStory.category.toString() !== story.category.toString()) {
      await Category.findByIdAndUpdate(oldStory.category, { $inc: { storyCount: -1 } });
      await Category.findByIdAndUpdate(story.category, { $inc: { storyCount: 1 } });
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
      return res.status(404).json({ success: false, message: 'Story not found' });
    }
    
    // Delete associated files
    if (story.audioUrl && story.audioUrl.includes('localhost')) {
      const filename = story.audioUrl.split('/').pop();
      const filepath = path.join(__dirname, '../../public/audio', filename);
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    }
    
    if (story.thumbnailUrl && story.thumbnailUrl.includes('localhost')) {
      const filename = story.thumbnailUrl.split('/').pop();
      const filepath = path.join(__dirname, '../../public/images', filename);
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    }
    
    await Story.findByIdAndDelete(req.params.id);
    
    // Update category story count
    await Category.findByIdAndUpdate(story.category, {
      $inc: { storyCount: -1 }
    });
    
    res.json({ success: true, message: 'Story deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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
    const category = await Category.create(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT - Update category
router.put('/categories/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
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
      return res.status(404).json({ success: false, message: 'Category not found' });
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
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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
      { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'category' } },
      { $unwind: '$category' },
      { $project: { name: '$category.name', icon: '$category.icon', count: 1 } }
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
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;