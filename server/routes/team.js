const express = require('express');
const router = express.Router();
const storage = require('../utils/storage');
const { authMiddleware, adminOnly } = require('../middleware/auth');

// @route   GET /api/team
// @desc    Get Team Prashant Diwakar leadership & helpline members
router.get('/', (req, res) => {
  const team = storage.getTeam();
  res.json({ team });
});

// @route   POST /api/team
// @desc    Add a new team member (Admin only)
router.post('/', authMiddleware, adminOnly, (req, res) => {
  const { name, role, year, phone, email, bio, isMainLeader, avatar } = req.body;
  if (!name || !role) {
    return res.status(400).json({ message: 'Name and Role are required' });
  }

  const newMember = {
    id: `tm_${Date.now()}`,
    name: name.trim(),
    role: role.trim(),
    year: year || '3rd Year (Batch \'24)',
    phone: phone ? phone.trim() : '6206319802',
    email: email ? email.trim() : '',
    bio: bio ? bio.trim() : '',
    avatar: avatar || name.trim().substring(0, 2).toUpperCase(),
    isMainLeader: Boolean(isMainLeader)
  };

  const created = storage.addTeamMember(newMember);
  res.status(201).json({ message: 'Team member added successfully', member: created });
});

// @route   PATCH /api/team/:id
// @desc    Update a team member (Admin only)
router.patch('/:id', authMiddleware, adminOnly, (req, res) => {
  const { name, role, year, phone, email, bio, isMainLeader, avatar } = req.body;
  const existing = storage.getTeam().find(t => String(t.id) === String(req.params.id));
  if (!existing) {
    return res.status(404).json({ message: 'Team member not found' });
  }

  const updates = {};
  if (name !== undefined) updates.name = name.trim();
  if (role !== undefined) updates.role = role.trim();
  if (year !== undefined) updates.year = year;
  if (phone !== undefined) updates.phone = phone.trim();
  if (email !== undefined) updates.email = email.trim();
  if (bio !== undefined) updates.bio = bio.trim();
  if (avatar !== undefined) updates.avatar = avatar;
  if (isMainLeader !== undefined) updates.isMainLeader = Boolean(isMainLeader);

  const updated = storage.updateTeamMember(req.params.id, updates);
  res.json({ message: 'Team member updated successfully', member: updated });
});

// @route   DELETE /api/team/:id
// @desc    Delete a team member (Admin only)
router.delete('/:id', authMiddleware, adminOnly, (req, res) => {
  const deleted = storage.deleteTeamMember(req.params.id);
  if (!deleted) {
    return res.status(404).json({ message: 'Team member not found' });
  }
  res.json({ message: 'Team member deleted successfully', member: deleted });
});

module.exports = router;

