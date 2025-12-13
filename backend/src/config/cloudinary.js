const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Audio storage
const audioStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'islamic-stories/audio',
    resource_type: 'video', // Use 'video' for audio files
    allowed_formats: ['mp3', 'wav', 'm4a'],
    public_id: (req, file) => `audio-${Date.now()}`,
  },
});

// Image storage
const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'islamic-stories/images',
    resource_type: 'image',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    public_id: (req, file) => `thumbnail-${Date.now()}`,
    transformation: [{ width: 800, height: 800, crop: 'limit' }]
  },
});

module.exports = { cloudinary, audioStorage, imageStorage };