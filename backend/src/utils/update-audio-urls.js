const mongoose = require('mongoose');
const Story = require('../models/Story');
require('dotenv').config();

async function updateAudioUrls() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/islamic-stories');
    console.log('✅ Connected to MongoDB');

    const stories = await Story.find();
    
    for (let story of stories) {
      // Extract filename from current URL path
      const filename = story.audioUrl.split('/').pop();
      
      // Update to localhost URL
      story.audioUrl = `http://localhost:5000/audio/${filename}`;
      await story.save();
      
      console.log(`✅ Updated: ${story.title}`);
      console.log(`   URL: ${story.audioUrl}`);
    }

    console.log(`\n✅ Updated ${stories.length} stories!`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

updateAudioUrls();