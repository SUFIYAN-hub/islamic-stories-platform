const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['admin', 'moderator', 'user'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  
  // NEW: Profile Information
  avatar: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  
  // NEW: User Preferences/Settings
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system'
    },
    language: {
      type: String,
      default: 'hindi'
    },
    autoplay: {
      type: Boolean,
      default: true
    },
    notifications: {
      type: Boolean,
      default: true
    },
    emailNotifications: {
      type: Boolean,
      default: false
    }
  },
  
  // NEW: Favorites System
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story'
  }],
  
  // NEW: Playlists
  playlists: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    stories: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Story'
    }],
    isPublic: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // NEW: Listening History & Stats
  listeningHistory: [{
    story: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Story',
      required: true
    },
    lastPosition: {
      type: Number,
      default: 0 // in seconds
    },
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: {
      type: Date
    },
    playCount: {
      type: Number,
      default: 1
    },
    lastPlayedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // NEW: Overall Stats
  stats: {
    totalListeningTime: {
      type: Number,
      default: 0 // in seconds
    },
    storiesCompleted: {
      type: Number,
      default: 0
    },
    favoriteCount: {
      type: Number,
      default: 0
    },
    streakDays: {
      type: Number,
      default: 0
    },
    lastActiveDate: {
      type: Date,
      default: Date.now
    }
  }
  
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to add to favorites
userSchema.methods.addToFavorites = async function(storyId) {
  if (!this.favorites.includes(storyId)) {
    this.favorites.push(storyId);
    this.stats.favoriteCount = this.favorites.length;
    await this.save();
  }
  return this;
};

// Method to remove from favorites
userSchema.methods.removeFromFavorites = async function(storyId) {
  this.favorites = this.favorites.filter(id => id.toString() !== storyId.toString());
  this.stats.favoriteCount = this.favorites.length;
  await this.save();
  return this;
};

// Method to update listening progress
userSchema.methods.updateListeningProgress = async function(storyId, position, duration, completed = false) {
  const historyIndex = this.listeningHistory.findIndex(
    item => item.story.toString() === storyId.toString()
  );
  
  if (historyIndex > -1) {
    // Update existing history
    this.listeningHistory[historyIndex].lastPosition = position;
    this.listeningHistory[historyIndex].lastPlayedAt = Date.now();
    this.listeningHistory[historyIndex].playCount += 1;
    
    if (completed && !this.listeningHistory[historyIndex].completed) {
      this.listeningHistory[historyIndex].completed = true;
      this.listeningHistory[historyIndex].completedAt = Date.now();
      this.stats.storiesCompleted += 1;
    }
  } else {
    // Add new history entry
    this.listeningHistory.push({
      story: storyId,
      lastPosition: position,
      completed: completed,
      completedAt: completed ? Date.now() : null,
      playCount: 1,
      lastPlayedAt: Date.now()
    });
    
    if (completed) {
      this.stats.storiesCompleted += 1;
    }
  }
  
  // Update total listening time
  if (duration) {
    this.stats.totalListeningTime += Math.floor(duration);
  }
  
  // Update last active date
  this.stats.lastActiveDate = Date.now();
  
  await this.save();
  return this;
};

module.exports = mongoose.model('User', userSchema);