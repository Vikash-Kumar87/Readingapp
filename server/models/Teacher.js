const mongoose = require('mongoose');

/**
 * Teacher Schema
 * Stores teacher information
 */
const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Teacher name is required'],
    trim: true
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },
  profileImage: {
    type: String,
    default: null
  },
  description: {
    type: String,
    trim: true
  },
  notesCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Teacher', teacherSchema);
