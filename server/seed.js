require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const Teacher = require('./models/Teacher');
const Note = require('./models/Note');

/**
 * Seed Script
 * Creates initial admin user and sample teachers with notes
 */

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Teacher.deleteMany({});
    await Note.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@teachernotes.com',
      password: 'admin123',
      isAdmin: true
    });
    console.log('👤 Admin user created:', adminUser.email);

    // Create regular test user
    const testUser = await User.create({
      name: 'Test User',
      email: 'user@test.com',
      password: 'user123',
      isAdmin: false
    });
    console.log('👤 Test user created:', testUser.email);

    // Create teachers
    const teachers = await Teacher.create([
      {
        name: 'Dr. Sarah Johnson',
        subject: 'Mathematics',
        description: 'Expert in Advanced Calculus and Linear Algebra with 15+ years of teaching experience.',
        notesCount: 3
      },
      {
        name: 'Prof. Michael Chen',
        subject: 'Physics',
        description: 'Specializes in Quantum Mechanics and Electromagnetism.',
        notesCount: 3
      },
      {
        name: 'Ms. Emily Davis',
        subject: 'Chemistry',
        description: 'Organic Chemistry specialist with a passion for making complex concepts simple.',
        notesCount: 3
      },
      {
        name: 'Dr. James Wilson',
        subject: 'Biology',
        description: 'Cell Biology and Genetics expert.',
        notesCount: 3
      },
      {
        name: 'Prof. Lisa Anderson',
        subject: 'Computer Science',
        description: 'Software Engineering and Algorithms specialist.',
        notesCount: 3
      },
      {
        name: 'Dr. Robert Martinez',
        subject: 'History',
        description: 'World History expert with focus on Modern European history.',
        notesCount: 3
      },
      {
        name: 'Ms. Jennifer Lee',
        subject: 'English Literature',
        description: 'Shakespeare and Modern Literature specialist.',
        notesCount: 3
      },
      {
        name: 'Prof. David Brown',
        subject: 'Economics',
        description: 'Microeconomics and Macroeconomics expert.',
        notesCount: 3
      }
    ]);
    console.log(`👨‍🏫 Created ${teachers.length} teachers`);

    // Create notes for each teacher
    const notesData = [];
    
    teachers.forEach((teacher, index) => {
      for (let i = 1; i <= 3; i++) {
        notesData.push({
          title: `${teacher.subject} - Chapter ${i}`,
          subject: teacher.subject,
          teacher: teacher._id,
          fileUrl: `https://via.placeholder.com/800x1000?text=${teacher.subject}+Notes+${i}`,
          fileType: i === 1 ? 'pdf' : 'image',
          price: i === 1 ? 0 : 29.99,
          isPaid: i !== 1
        });
      }
    });

    const notes = await Note.create(notesData);
    console.log(`📝 Created ${notes.length} notes`);

    console.log('\n✨ Seed data created successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('-----------------------------------');
    console.log('Admin:');
    console.log('  Email: admin@teachernotes.com');
    console.log('  Password: admin123');
    console.log('\nTest User:');
    console.log('  Email: user@test.com');
    console.log('  Password: user123');
    console.log('-----------------------------------\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
