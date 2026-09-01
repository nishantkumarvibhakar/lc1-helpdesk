const express = require('express');
const router = express.Router();
const storage = require('../utils/storage');
const { authMiddleware, adminOnly } = require('../middleware/auth');

// @route   GET /api/notices
// @desc    Get all notices
router.get('/', (req, res) => {
  const notices = storage.getNotices();
  res.json({ notices });
});

// @route   GET /api/notices/:id
// @desc    Get single notice by ID
router.get('/:id', (req, res) => {
  const notices = storage.getNotices();
  const notice = notices.find(n => n.id === req.params.id);
  if (!notice) {
    return res.status(404).json({ message: 'Notice not found' });
  }
  res.json({ notice });
});

// @route   POST /api/notices
// @desc    Create a notice or event announcement (Admin only)
router.post('/', authMiddleware, adminOnly, (req, res) => {
  const { 
    title, 
    category = 'General', 
    type = 'Notice', // 'Notice' | 'Event'
    description, 
    eventDate,
    eventTime,
    venue,
    priority = 'Normal', 
    isPinned = false, 
    linkText, 
    linkUrl,
    contactPerson
  } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }

  const newNotice = {
    id: `not_${Date.now()}`,
    title: title.trim(),
    category,
    type,
    description: description.trim(),
    eventDate: eventDate || '',
    eventTime: eventTime || '',
    venue: venue ? venue.trim() : '',
    priority,
    isPinned: Boolean(isPinned),
    isActive: true,
    publishedBy: req.user.name ? `${req.user.name} (Team Prashant Diwakar)` : 'Team Prashant Diwakar',
    date: new Date().toISOString().split('T')[0],
    linkText: linkText ? linkText.trim() : '',
    linkUrl: linkUrl ? linkUrl.trim() : '',
    contactPerson: contactPerson ? contactPerson.trim() : ''
  };

  const created = storage.addNotice(newNotice);
  res.status(201).json({ message: 'Announcement published successfully', notice: created });
});

// @route   PATCH /api/notices/:id
// @desc    Update notice or toggle pin/active status (Admin only)
router.patch('/:id', authMiddleware, adminOnly, (req, res) => {
  const existing = storage.getNotices().find(n => n.id === req.params.id);
  if (!existing) {
    return res.status(404).json({ message: 'Notice not found' });
  }

  const updated = storage.updateNotice(req.params.id, req.body);
  res.json({ message: 'Notice updated successfully', notice: updated });
});

// @route   DELETE /api/notices/:id
// @desc    Delete notice (Admin only)
router.delete('/:id', authMiddleware, adminOnly, (req, res) => {
  const deleted = storage.deleteNotice(req.params.id);
  if (!deleted) {
    return res.status(404).json({ message: 'Notice not found' });
  }
  res.json({ message: 'Notice deleted successfully', notice: deleted });
});

module.exports = router;
