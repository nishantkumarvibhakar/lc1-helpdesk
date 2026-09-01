const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true
  },
  question: {
    type: String,
    required: true,
    trim: true
  },
  answer: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.models.Faq || mongoose.model('Faq', faqSchema);
