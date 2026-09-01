const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true
  },
  organization: {
    type: String,
    default: 'Team Prashant Diwakar'
  },
  phone: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  avatar: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.models.TeamMember || mongoose.model('TeamMember', teamMemberSchema);
