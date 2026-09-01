const mongoose = require('mongoose');

const timelineItemSchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => `tl_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
  },
  author: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'admin', 'volunteer', 'system'],
    default: 'system'
  },
  message: {
    type: String,
    required: true
  },
  timestamp: {
    type: String,
    default: () => new Date().toISOString()
  }
}, { _id: false });

const ticketSchema = new mongoose.Schema({
  ticketId: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    enum: ['Issue', 'Manifesto Suggestion', 'Volunteer Application', 'General Query'],
    default: 'Issue'
  },
  studentName: {
    type: String,
    required: true,
    trim: true
  },
  studentEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  studentId: {
    type: String,
    required: true,
    trim: true
  },
  llbYear: {
    type: String,
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
  isAnonymous: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['Low', 'Normal', 'High', 'Urgent'],
    default: 'Normal'
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
    default: 'Pending'
  },
  assignedTo: {
    type: String,
    default: 'Unassigned'
  },
  attachment: {
    type: String,
    default: null
  },
  createdAt: {
    type: String,
    default: () => new Date().toISOString()
  },
  updatedAt: {
    type: String,
    default: () => new Date().toISOString()
  },
  resolutionNote: {
    type: String,
    default: ''
  },
  timeline: [timelineItemSchema]
}, {
  timestamps: true
});

module.exports = mongoose.models.Ticket || mongoose.model('Ticket', ticketSchema);
