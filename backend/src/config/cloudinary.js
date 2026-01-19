const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Audio storage - FIX: params as function
const audioStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'islamic-stories/audio',
      resource_type: 'video', // Use 'video' for audio files
      allowed_formats: ['mp3', 'wav', 'm4a', 'ogg'],
      public_id: `audio-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      format: 'mp3', // Specify format
    };
  },
});

// Image storage - FIX: params as function
const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'islamic-stories/images',
      resource_type: 'image',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      public_id: `thumbnail-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto' }],
      format: 'jpg', // Specify format
    };
  },
});

module.exports = { cloudinary, audioStorage, imageStorage };