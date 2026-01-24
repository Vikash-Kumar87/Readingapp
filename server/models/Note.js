const mongoose = require('mongoose');

/**
 * Note Schema
 * Stores handwritten notes information
 */
const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Note title is required'],
    trim: true
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: [true, 'Teacher reference is required']
  },
  fileUrl: {
    type: String,
    required: [true, 'File URL is required']
  },
  fileType: {
    type: String,
    enum: ['pdf', 'image'],
    default: 'image'
  },
  price: {
    type: Number,
    default: 0,
    min: 0
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Note', noteSchema);
