const mongoose = require('mongoose');
// const bcrypt = require('bcrypt'); // REMOVED - passwords stored as plain text

/**
 * User Schema
 * Handles user authentication and purchased notes tracking
 * WARNING: Passwords are stored as plain text (NOT SECURE!)
 */
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  profileImage: {
    type: String,
    default: null
  },
  purchasedNotes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Note'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// REMOVED password hashing - storing plain text passwords
// userSchema.pre('save', async function(next) { ... });

// Method to compare password (plain text comparison)
userSchema.methods.comparePassword = async function(candidatePassword) {
  // Simple plain text comparison
  return candidatePassword === this.password;
};

module.exports = mongoose.model('User', userSchema);
