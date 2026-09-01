const express = require('express');
const router = express.Router();
const storage = require('../utils/storage');
const { authMiddleware, adminOnly } = require('../middleware/auth');

// @route   GET /api/manifesto
// @desc    Get all Manifesto / Welfare Charter points
router.get('/', (req, res) => {
  const manifesto = storage.getManifesto();
  res.json({ manifesto });
});

// @route   POST /api/manifesto
// @desc    Create a new manifesto point (Admin only)
router.post('/', authMiddleware, adminOnly, (req, res) => {
  const { num, title, desc, icon } = req.body;
  if (!title || !desc) {
    return res.status(400).json({ message: 'Title and description are required' });
  }

  const all = storage.getManifesto();
  const nextNum = num || String(all.length + 1).padStart(2, '0');

  const newPoint = {
    id: `mf_${Date.now()}`,
    num: nextNum,
    title: title.trim(),
    desc: desc.trim(),
    icon: icon || 'Droplet'
  };

  const created = storage.addManifestoPoint(newPoint);
  res.status(201).json({ message: 'Manifesto point created successfully', point: created });
});

// @route   PATCH /api/manifesto/:id
// @desc    Update a manifesto point (Admin only)
router.patch('/:id', authMiddleware, adminOnly, (req, res) => {
  const { num, title, desc, icon } = req.body;
  const existing = storage.getManifesto().find(m => String(m.id) === String(req.params.id));
  if (!existing) {
    return res.status(404).json({ message: 'Manifesto point not found' });
  }

  const updates = {};
  if (num !== undefined) updates.num = num;
  if (title !== undefined) updates.title = title.trim();
  if (desc !== undefined) updates.desc = desc.trim();
  if (icon !== undefined) updates.icon = icon;

  const updated = storage.updateManifestoPoint(req.params.id, updates);
  res.json({ message: 'Manifesto point updated successfully', point: updated });
});

// @route   DELETE /api/manifesto/:id
// @desc    Delete a manifesto point (Admin only)
router.delete('/:id', authMiddleware, adminOnly, (req, res) => {
  const deleted = storage.deleteManifestoPoint(req.params.id);
  if (!deleted) {
    return res.status(404).json({ message: 'Manifesto point not found' });
  }
  res.json({ message: 'Manifesto point deleted successfully', point: deleted });
});

module.exports = router;
