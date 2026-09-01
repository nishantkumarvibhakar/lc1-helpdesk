const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    default: 'General'
  },
  type: {
    type: String,
    enum: ['Event', 'Townhall', 'Rally', 'Workshop', 'Manifesto', 'Notice'],
    default: 'Event'
  },
  description: {
    type: String,
    required: true
  },
  eventDate: {
    type: String,
    default: ''
  },
  eventTime: {
    type: String,
    default: ''
  },
  venue: {
    type: String,
    default: ''
  },
  priority: {
    type: String,
    enum: ['Normal', 'High', 'Urgent'],
    default: 'Normal'
  },
  isPinned: {
    type: Boolean,
    default: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  publishedBy: {
    type: String,
    default: 'Team Prashant Diwakar'
  },
  date: {
    type: String,
    default: () => new Date().toISOString().split('T')[0]
  },
  linkText: {
    type: String,
    default: ''
  },
  linkUrl: {
    type: String,
    default: ''
  },
  contactPerson: {
    type: String,
    default: 'Team Prashant Diwakar (+91 6206319802)'
  },
  rsvpCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.models.Notice || mongoose.model('Notice', noticeSchema);
