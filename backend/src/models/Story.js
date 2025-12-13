const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Story title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  titleArabic: {
    type: String,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  audioUrl: {
  type: String,
  required: true,
  get: function(url) {
    // Convert http to https for Render deployments
    if (url && url.startsWith('http://')) {
      return url.replace('http://', 'https://');
    }
    return url;
  }
},
  thumbnail: {
  type: String,
  get: function(url) {
    if (url && url.startsWith('http://')) {
      return url.replace('http://', 'https://');
    }
    return url;
  }
},
  duration: {
    type: Number, // in seconds
    required: true
  },
  language: {
    type: String,
    enum: ['hindi', 'urdu', 'english', 'arabic'],
    default: 'hindi'
  },
  narrator: {
    type: String,
    trim: true
  },
  source: {
    type: String, // Book/Hadith reference
    trim: true
  },
  ageGroup: {
    type: String,
    enum: ['3-5', '6-8', '9-12', '13+', 'all'],
    default: 'all'
  },
  tags: [{
    type: String,
    lowercase: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  playCount: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { getters: true },
  toObject: { getters: true }  
});

// Create slug before saving
storySchema.pre('save', function(next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  next();
});

// Create slug before insertMany
storySchema.pre('insertMany', function(next, docs) {
  if (docs && docs.length) {
    docs.forEach(doc => {
      if (!doc.slug && doc.title) {
        doc.slug = doc.title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();
      }
    });
  }
  next();
});

// Index for search (using 'none' language for multilingual support)
storySchema.index({ title: 'text', description: 'text', tags: 'text' }, { default_language: 'none' });

module.exports = mongoose.model('Story', storySchema);