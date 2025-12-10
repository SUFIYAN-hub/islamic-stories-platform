// backend/src/routes/user.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Story = require('../models/Story');
const { protect } = require('../middleware/auth');

// All routes are protected (require authentication)
router.use(protect);

// ============================================
// PROFILE ROUTES
// ============================================

// GET current user profile
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('favorites', 'title titleArabic slug thumbnail duration category')
      .populate('playlists.stories', 'title slug thumbnail duration');

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// UPDATE user profile
router.put('/profile', async (req, res) => {
  try {
    const { name, bio, avatar } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (avatar !== undefined) user.avatar = avatar;
    
    await user.save();
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ============================================
// SETTINGS ROUTES
// ============================================

// GET user settings
router.get('/settings', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('preferences');
    
    res.json({
      success: true,
      data: user.preferences
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// UPDATE user settings
router.put('/settings', async (req, res) => {
  try {
    const { theme, language, autoplay, notifications, emailNotifications } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (theme) user.preferences.theme = theme;
    if (language) user.preferences.language = language;
    if (autoplay !== undefined) user.preferences.autoplay = autoplay;
    if (notifications !== undefined) user.preferences.notifications = notifications;
    if (emailNotifications !== undefined) user.preferences.emailNotifications = emailNotifications;
    
    await user.save();
    
    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: user.preferences
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ============================================
// FAVORITES ROUTES
// ============================================

// GET user favorites
router.get('/favorites', async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'favorites',
        populate: {
          path: 'category',
          select: 'name nameArabic slug icon color'
        }
      });
    
    res.json({
      success: true,
      data: user.favorites
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ADD story to favorites
router.post('/favorites/:storyId', async (req, res) => {
  try {
    const { storyId } = req.params;
    
    // Check if story exists
    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ success: false, message: 'Story not found' });
    }
    
    const user = await User.findById(req.user._id);
    await user.addToFavorites(storyId);
    
    res.json({
      success: true,
      message: 'Added to favorites',
      data: { favoriteCount: user.stats.favoriteCount }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// REMOVE story from favorites
router.delete('/favorites/:storyId', async (req, res) => {
  try {
    const { storyId } = req.params;
    
    const user = await User.findById(req.user._id);
    await user.removeFromFavorites(storyId);
    
    res.json({
      success: true,
      message: 'Removed from favorites',
      data: { favoriteCount: user.stats.favoriteCount }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// CHECK if story is in favorites
router.get('/favorites/check/:storyId', async (req, res) => {
  try {
    const { storyId } = req.params;
    const user = await User.findById(req.user._id).select('favorites');
    
    const isFavorite = user.favorites.some(
      id => id.toString() === storyId.toString()
    );
    
    res.json({
      success: true,
      data: { isFavorite }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// PLAYLISTS ROUTES
// ============================================

// GET all user playlists
router.get('/playlists', async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('playlists')
      .populate('playlists.stories', 'title slug thumbnail duration category');
    
    res.json({
      success: true,
      data: user.playlists
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET single playlist
router.get('/playlists/:playlistId', async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('playlists')
      .populate({
        path: 'playlists.stories',
        populate: {
          path: 'category',
          select: 'name nameArabic slug icon color'
        }
      });
    
    const playlist = user.playlists.id(req.params.playlistId);
    
    if (!playlist) {
      return res.status(404).json({ success: false, message: 'Playlist not found' });
    }
    
    res.json({
      success: true,
      data: playlist
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// CREATE new playlist
router.post('/playlists', async (req, res) => {
  try {
    const { name, description, isPublic } = req.body;
    
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Playlist name is required' 
      });
    }
    
    const user = await User.findById(req.user._id);
    
    user.playlists.push({
      name: name.trim(),
      description: description || '',
      isPublic: isPublic || false,
      stories: []
    });
    
    await user.save();
    
    const newPlaylist = user.playlists[user.playlists.length - 1];
    
    res.status(201).json({
      success: true,
      message: 'Playlist created successfully',
      data: newPlaylist
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// UPDATE playlist
router.put('/playlists/:playlistId', async (req, res) => {
  try {
    const { name, description, isPublic } = req.body;
    
    const user = await User.findById(req.user._id);
    const playlist = user.playlists.id(req.params.playlistId);
    
    if (!playlist) {
      return res.status(404).json({ success: false, message: 'Playlist not found' });
    }
    
    if (name) playlist.name = name.trim();
    if (description !== undefined) playlist.description = description;
    if (isPublic !== undefined) playlist.isPublic = isPublic;
    
    await user.save();
    
    res.json({
      success: true,
      message: 'Playlist updated successfully',
      data: playlist
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE playlist
router.delete('/playlists/:playlistId', async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const playlist = user.playlists.id(req.params.playlistId);
    
    if (!playlist) {
      return res.status(404).json({ success: false, message: 'Playlist not found' });
    }
    
    playlist.remove();
    await user.save();
    
    res.json({
      success: true,
      message: 'Playlist deleted successfully'
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ADD story to playlist
router.post('/playlists/:playlistId/stories/:storyId', async (req, res) => {
  try {
    const { playlistId, storyId } = req.params;
    
    // Check if story exists
    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ success: false, message: 'Story not found' });
    }
    
    const user = await User.findById(req.user._id);
    const playlist = user.playlists.id(playlistId);
    
    if (!playlist) {
      return res.status(404).json({ success: false, message: 'Playlist not found' });
    }
    
    // Check if story already in playlist
    if (playlist.stories.includes(storyId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Story already in playlist' 
      });
    }
    
    playlist.stories.push(storyId);
    await user.save();
    
    res.json({
      success: true,
      message: 'Story added to playlist',
      data: { storyCount: playlist.stories.length }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// REMOVE story from playlist
router.delete('/playlists/:playlistId/stories/:storyId', async (req, res) => {
  try {
    const { playlistId, storyId } = req.params;
    
    const user = await User.findById(req.user._id);
    const playlist = user.playlists.id(playlistId);
    
    if (!playlist) {
      return res.status(404).json({ success: false, message: 'Playlist not found' });
    }
    
    playlist.stories = playlist.stories.filter(
      id => id.toString() !== storyId.toString()
    );
    
    await user.save();
    
    res.json({
      success: true,
      message: 'Story removed from playlist',
      data: { storyCount: playlist.stories.length }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// ============================================
// LISTENING HISTORY & PROGRESS ROUTES
// ============================================

// GET listening history
router.get('/history', async (req, res) => {
  try {
    const { limit = 50, completed } = req.query;
    
    const user = await User.findById(req.user._id)
      .populate({
        path: 'listeningHistory.story',
        populate: {
          path: 'category',
          select: 'name nameArabic slug icon color'
        }
      });
    
    let history = user.listeningHistory;
    
    // Filter by completion status if specified
    if (completed !== undefined) {
      const isCompleted = completed === 'true';
      history = history.filter(item => item.completed === isCompleted);
    }
    
    // Sort by most recent first
    history.sort((a, b) => b.lastPlayedAt - a.lastPlayedAt);
    
    // Limit results
    history = history.slice(0, parseInt(limit));
    
    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// UPDATE listening progress
router.post('/progress/:storyId', async (req, res) => {
  try {
    const { storyId } = req.params;
    const { position, duration, completed } = req.body;
    
    // Validate story exists
    const story = await Story.findById(storyId);
    if (!story) {
      return res.status(404).json({ success: false, message: 'Story not found' });
    }
    
    const user = await User.findById(req.user._id);
    await user.updateListeningProgress(storyId, position, duration, completed);
    
    res.json({
      success: true,
      message: 'Progress updated',
      data: {
        position,
        completed,
        stats: user.stats
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// GET progress for specific story
router.get('/progress/:storyId', async (req, res) => {
  try {
    const { storyId } = req.params;
    
    const user = await User.findById(req.user._id).select('listeningHistory');
    
    const historyItem = user.listeningHistory.find(
      item => item.story.toString() === storyId.toString()
    );
    
    if (!historyItem) {
      return res.json({
        success: true,
        data: {
          hasProgress: false,
          position: 0,
          completed: false
        }
      });
    }
    
    res.json({
      success: true,
      data: {
        hasProgress: true,
        position: historyItem.lastPosition,
        completed: historyItem.completed,
        playCount: historyItem.playCount,
        lastPlayedAt: historyItem.lastPlayedAt
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// STATS ROUTES
// ============================================

// GET user statistics
router.get('/stats', async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('stats listeningHistory favorites playlists');
    
    // Calculate additional stats
    const totalStories = user.listeningHistory.length;
    const completedStories = user.listeningHistory.filter(item => item.completed).length;
    const completionRate = totalStories > 0 
      ? Math.round((completedStories / totalStories) * 100) 
      : 0;
    
    // Format listening time
    const hours = Math.floor(user.stats.totalListeningTime / 3600);
    const minutes = Math.floor((user.stats.totalListeningTime % 3600) / 60);
    
    res.json({
      success: true,
      data: {
        ...user.stats.toObject(),
        totalStories,
        completionRate,
        formattedListeningTime: `${hours}h ${minutes}m`,
        playlistCount: user.playlists.length
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET dashboard stats (overview)
router.get('/stats/dashboard', async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('stats listeningHistory favorites playlists')
      .populate('favorites', 'title slug thumbnail')
      .populate('listeningHistory.story', 'title slug thumbnail');
    
    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentHistory = user.listeningHistory.filter(
      item => new Date(item.lastPlayedAt) >= sevenDaysAgo
    );
    
    // Currently listening (incomplete stories)
    const currentlyListening = user.listeningHistory
      .filter(item => !item.completed && item.lastPosition > 0)
      .sort((a, b) => b.lastPlayedAt - a.lastPlayedAt)
      .slice(0, 5);
    
    res.json({
      success: true,
      data: {
        stats: user.stats,
        recentActivity: recentHistory.length,
        favoriteCount: user.favorites.length,
        playlistCount: user.playlists.length,
        currentlyListening
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;