require('dotenv').config();
const mongoose = require('mongoose');
const Teacher = require('./models/Teacher');
const Note = require('./models/Note');

/**
 * Clear Dummy Data Script
 * Removes all teachers and notes from database
 * Keeps user accounts intact
 */

const clearDummyData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear teachers and notes
    const deletedTeachers = await Teacher.deleteMany({});
    const deletedNotes = await Note.deleteMany({});
    
    console.log(`🗑️  Deleted ${deletedTeachers.deletedCount} teachers`);
    console.log(`🗑️  Deleted ${deletedNotes.deletedCount} notes`);
    
    console.log('\n✨ Dummy data cleared successfully!');
    console.log('👤 User accounts remain intact');
    console.log('\nYou can now add teachers and notes through the admin panel.\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing data:', error);
    process.exit(1);
  }
};

clearDummyData();
