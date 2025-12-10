// backend/src/utils/drop-db.js
const mongoose = require('mongoose');
require('dotenv').config();

async function dropDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/islamic-stories');
    console.log('✅ Connected to MongoDB');
    
    await mongoose.connection.dropDatabase();
    console.log('🗑️  Database dropped successfully');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

dropDatabase();