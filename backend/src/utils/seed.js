const mongoose = require('mongoose');
const Category = require('../models/Category');
const Story = require('../models/Story');
const User = require('../models/User');
require('dotenv').config();

// Sample categories
const categories = [
  {
    name: 'Anbiya (Prophets)',
    nameArabic: 'أنبياء',
    slug: 'anbiya-prophets',
    description: 'Stories of Allah\'s prophets',
    icon: '🕌',
    color: '#10b981',
    order: 1
  },
  {
    name: 'Sahaba (Companions)',
    nameArabic: 'صحابة',
    slug: 'sahaba-companions',
    description: 'Stories of Prophet Muhammad\'s companions',
    icon: '⭐',
    color: '#f59e0b',
    order: 2
  },
  {
    name: 'Seerah (Prophet\'s Life)',
    nameArabic: 'سيرة',
    slug: 'seerah-prophets-life',
    description: 'Life of Prophet Muhammad ﷺ',
    icon: '📿',
    color: '#8b5cf6',
    order: 3
  },
  {
    name: 'Akhlaq (Moral Stories)',
    nameArabic: 'أخلاق',
    slug: 'akhlaq-moral-stories',
    description: 'Stories teaching good character',
    icon: '💎',
    color: '#06b6d4',
    order: 4
  },
  {
    name: 'Bedtime Stories',
    nameArabic: 'قصص قبل النوم',
    slug: 'bedtime-stories',
    description: 'Short, soothing stories for sleep',
    icon: '🌙',
    color: '#ec4899',
    order: 5
  }
];

// Function to seed database
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/islamic-stories');
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Category.deleteMany({});
    await Story.deleteMany({});
    await User.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Insert categories
    const insertedCategories = await Category.insertMany(categories);
    console.log(`✅ Added ${insertedCategories.length} categories`);

    // Create sample stories for each category
    const sampleStories = [];

    // Anbiya category stories
    const anbiyaCategory = insertedCategories[0];
    sampleStories.push(
      {
        title: 'Hazrat Nuh (Noah) aur Kashti ki Kahani',
        titleArabic: 'حضرت نوح والسفينة',
        description: 'Hazrat Nuh AS ne Allah ke hukm par ek badi kashti banayi. Ye kahani imaan aur sabr ki misaal hai.',
        category: anbiyaCategory._id,
        audioUrl: '/audio/sample/nuh-story.mp3',
        duration: 480,
        language: 'hindi',
        narrator: 'Maulana Ahmed',
        source: 'Quran - Surah Nuh',
        ageGroup: '6-8',
        tags: ['prophet', 'flood', 'patience', 'faith'],
        isFeatured: true
      },
      {
        title: 'Hazrat Ibrahim ka Imaan',
        titleArabic: 'إيمان إبراهيم',
        description: 'Hazrat Ibrahim AS ne butparasti ke khilaaf awaz uthai aur Allah par pura bharosa rakha.',
        category: anbiyaCategory._id,
        audioUrl: '/audio/sample/ibrahim-story.mp3',
        duration: 360,
        language: 'hindi',
        narrator: 'Maulana Ahmed',
        source: 'Quran - Surah Al-Anbiya',
        ageGroup: '9-12',
        tags: ['prophet', 'faith', 'courage'],
        isFeatured: true
      }
    );

    // Sahaba category stories
    const sahabaCategory = insertedCategories[1];
    sampleStories.push(
      {
        title: 'Abu Bakr Siddiq RA ki Sachchai',
        titleArabic: 'صدق أبي بكر',
        description: 'Hazrat Abu Bakr RA Nabi SAW ke sabse qareeb sahabi the. Unki sachchai aur wafadari ki kahani.',
        category: sahabaCategory._id,
        audioUrl: '/audio/sample/abubakar-story.mp3',
        duration: 420,
        language: 'hindi',
        narrator: 'Maulana Ahmed',
        source: 'Siyar A\'lam al-Nubala',
        ageGroup: '9-12',
        tags: ['companion', 'truthfulness', 'loyalty']
      },
      {
        title: 'Hazrat Bilal RA ki Azaan',
        titleArabic: 'أذان بلال',
        description: 'Hazrat Bilal RA ki pyari awaz aur unki azaan ki kahani. Allah ki raah mein sabr aur qurbani.',
        category: sahabaCategory._id,
        audioUrl: '/audio/sample/bilal-story.mp3',
        duration: 300,
        language: 'hindi',
        narrator: 'Maulana Ahmed',
        source: 'Seerah Ibn Hisham',
        ageGroup: '6-8',
        tags: ['companion', 'adhan', 'sacrifice']
      }
    );

    // Akhlaq category stories
    const akhlaqCategory = insertedCategories[3];
    sampleStories.push(
      {
        title: 'Sachchai ki Taqat',
        titleArabic: 'قوة الصدق',
        description: 'Ek chhote bachche ne hamesha sach bola, chahe kuch bhi ho jaye. Ye kahani humein sikhati hai ki sach bolna kitna zaroori hai.',
        category: akhlaqCategory._id,
        audioUrl: '/audio/sample/truth-story.mp3',
        duration: 240,
        language: 'hindi',
        narrator: 'Sister Fatima',
        source: 'Islamic Moral Tales',
        ageGroup: '3-5',
        tags: ['truthfulness', 'moral', 'character'],
        isFeatured: true
      },
      {
        title: 'Madad Karne ka Ajar',
        titleArabic: 'أجر المساعدة',
        description: 'Ek ladke ne apne dost ki madad ki. Allah ne usse bahut pyar kiya. Achhai karne ka silaa.',
        category: akhlaqCategory._id,
        audioUrl: '/audio/sample/help-story.mp3',
        duration: 180,
        language: 'hindi',
        narrator: 'Sister Fatima',
        source: 'Islamic Moral Tales',
        ageGroup: '3-5',
        tags: ['kindness', 'helping', 'reward']
      }
    );

    // Bedtime Stories category
    const bedtimeCategory = insertedCategories[4];
    sampleStories.push(
      {
        title: 'Sone se Pehle ki Dua',
        titleArabic: 'دعاء النوم',
        description: 'Ek pyari kahani jisme bachche sone se pehle Allah ka naam lete hain aur khush rehte hain.',
        category: bedtimeCategory._id,
        audioUrl: '/audio/sample/sleep-dua.mp3',
        duration: 120,
        language: 'hindi',
        narrator: 'Sister Fatima',
        source: 'Bedtime Prayers',
        ageGroup: '3-5',
        tags: ['bedtime', 'dua', 'sleep']
      }
    );

    // Insert stories
    const insertedStories = await Story.insertMany(sampleStories);
    console.log(`✅ Added ${insertedStories.length} sample stories`);

    // Create default admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@islamicstories.com',
      password: 'admin123456', // Change this in production!
      role: 'admin'
    });
    console.log(`✅ Created admin user: ${adminUser.email}`);
    console.log('   Password: admin123456 (CHANGE THIS!)');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Categories: ${insertedCategories.length}`);
    console.log(`   Stories: ${insertedStories.length}`);
    console.log(`   Admin Users: 1`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeder
seedDatabase();