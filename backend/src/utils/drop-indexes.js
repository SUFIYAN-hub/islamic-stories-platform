// backend/src/utils/drop-indexes.js
const mongoose = require('mongoose');
require('dotenv').config();

async function dropIndexes() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/islamic-stories');
    console.log('✅ Connected to MongoDB');
    
    const collections = await mongoose.connection.db.collections();
    
    for (let collection of collections) {
      try {
        await collection.dropIndexes();
        console.log(`🗑️  Dropped indexes for ${collection.collectionName}`);
      } catch (error) {
        console.log(`⚠️  No indexes to drop for ${collection.collectionName}`);
      }
    }
    
    console.log('✅ All indexes dropped successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

dropIndexes();