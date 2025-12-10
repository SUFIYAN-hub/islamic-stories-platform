const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true
  },
  nameArabic: {
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
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  icon: {
    type: String,
    default: '📖'
  },
  color: {
    type: String,
    default: '#10b981'
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  storyCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Create slug before saving
categorySchema.pre('save', function(next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  next();
});

// Create slug before insertMany
categorySchema.pre('insertMany', function(next, docs) {
  if (docs && docs.length) {
    docs.forEach(doc => {
      if (!doc.slug && doc.name) {
        doc.slug = doc.name
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

module.exports = mongoose.model('Category', categorySchema);
