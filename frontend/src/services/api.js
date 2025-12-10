// frontend/src/services/api.js
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    // Try to get token from localStorage (with proper JSON parsing)
    let token = null;
    
    try {
      // First try to get the parsed token
      const tokenData = localStorage.getItem('user-token');
      if (tokenData) {
        // Check if it's JSON or plain string
        try {
          token = JSON.parse(tokenData);
        } catch {
          token = tokenData; // It's already a plain string
        }
      }
    } catch (error) {
      console.error('Error reading token:', error);
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log('401 Error - Clearing auth and redirecting to login');
      localStorage.removeItem('user-token');
      localStorage.removeItem('user-data');
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ============================================
// STORIES API
// ============================================
export const storiesAPI = {
  getAll: (params) => api.get('/stories', { params }),
  getBySlug: (slug) => api.get(`/stories/${slug}`),
  getRelated: (slug) => api.get(`/stories/${slug}/related`),
};

// ============================================
// CATEGORIES API
// ============================================
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getBySlug: (slug) => api.get(`/categories/${slug}`),
};

// ============================================
// AUTH API
// ============================================
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

// ============================================
// USER API (NEW FEATURES)
// ============================================
export const userAPI = {
  // Profile
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
  
  // Settings
  getSettings: () => api.get('/user/settings'),
  updateSettings: (data) => api.put('/user/settings', data),
  
  // Favorites
  getFavorites: () => api.get('/user/favorites'),
  addToFavorites: (storyId) => api.post(`/user/favorites/${storyId}`),
  removeFromFavorites: (storyId) => api.delete(`/user/favorites/${storyId}`),
  checkFavorite: (storyId) => api.get(`/user/favorites/check/${storyId}`),
  
  // Playlists
  getPlaylists: () => api.get('/user/playlists'),
  getPlaylist: (playlistId) => api.get(`/user/playlists/${playlistId}`),
  createPlaylist: (data) => api.post('/user/playlists', data),
  updatePlaylist: (playlistId, data) => api.put(`/user/playlists/${playlistId}`, data),
  deletePlaylist: (playlistId) => api.delete(`/user/playlists/${playlistId}`),
  addStoryToPlaylist: (playlistId, storyId) => 
    api.post(`/user/playlists/${playlistId}/stories/${storyId}`),
  removeStoryFromPlaylist: (playlistId, storyId) => 
    api.delete(`/user/playlists/${playlistId}/stories/${storyId}`),
  
  // Listening History & Progress
  getHistory: (params) => api.get('/user/history', { params }),
  updateProgress: (storyId, data) => api.post(`/user/progress/${storyId}`, data),
  getProgress: (storyId) => api.get(`/user/progress/${storyId}`),
  
  // Stats
  getStats: () => api.get('/user/stats'),
  getDashboardStats: () => api.get('/user/stats/dashboard'),
};

// ============================================
// ADMIN API
// ============================================
export const adminAPI = {
  createStory: (data) => api.post('/admin/stories', data),
  updateStory: (id, data) => api.put(`/admin/stories/${id}`, data),
  deleteStory: (id) => api.delete(`/admin/stories/${id}`),
  createCategory: (data) => api.post('/admin/categories', data),
};

export default api;