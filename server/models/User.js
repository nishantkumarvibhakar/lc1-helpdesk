const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'admin', 'volunteer'],
    default: 'student'
  },
  studentId: {
    type: String,
    required: true,
    trim: true
  },
  llbYear: {
    type: String,
    enum: ['1st Year', '2nd Year', '3rd Year'],
    default: '1st Year'
  },
  section: {
    type: String,
    default: 'Section A'
  },
  phone: {
    type: String,
    default: ''
  },
  designation: {
    type: String,
    default: 'Law Centre-1 Student'
  },
  isVerifiedLc1: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
