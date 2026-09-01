const express = require('express');
const router = express.Router();
const storage = require('../utils/storage');
const { authMiddleware, adminOnly } = require('../middleware/auth');

// @route   GET /api/faqs
// @desc    Get all FAQs (supports category search)
router.get('/', (req, res) => {
  const { category, search } = req.query;
  let faqs = storage.getFaqs();

  if (category && category !== 'All') {
    faqs = faqs.filter(f => f.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    faqs = faqs.filter(f => 
      f.question.toLowerCase().includes(q) || 
      f.answer.toLowerCase().includes(q) ||
      f.category.toLowerCase().includes(q)
    );
  }

  res.json({ faqs });
});

// @route   POST /api/faqs
// @desc    Create FAQ (Admin only)
router.post('/', authMiddleware, adminOnly, (req, res) => {
  const { category, question, answer } = req.body;
  if (!category || !question || !answer) {
    return res.status(400).json({ message: 'Category, question and answer are required' });
  }

  const newFaq = {
    id: `faq_${Date.now()}`,
    category,
    question,
    answer
  };

  const created = storage.addFaq(newFaq);
  res.status(201).json({ message: 'FAQ created successfully', faq: created });
});

// @route   PATCH /api/faqs/:id
// @desc    Update FAQ (Admin only)
router.patch('/:id', authMiddleware, adminOnly, (req, res) => {
  const { category, question, answer } = req.body;
  const existing = storage.getFaqs().find(f => f.id === req.params.id);
  if (!existing) {
    return res.status(404).json({ message: 'FAQ not found' });
  }

  const updates = {};
  if (category !== undefined) updates.category = category;
  if (question !== undefined) updates.question = question;
  if (answer !== undefined) updates.answer = answer;

  const updated = storage.updateFaq(req.params.id, updates);
  res.json({ message: 'FAQ updated successfully', faq: updated });
});

// @route   DELETE /api/faqs/:id
// @desc    Delete FAQ (Admin only)
router.delete('/:id', authMiddleware, adminOnly, (req, res) => {
  const deleted = storage.deleteFaq(req.params.id);
  if (!deleted) {
    return res.status(404).json({ message: 'FAQ not found' });
  }
  res.json({ message: 'FAQ deleted successfully', faq: deleted });
});

module.exports = router;
