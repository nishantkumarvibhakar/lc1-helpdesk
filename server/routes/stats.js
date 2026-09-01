const express = require('express');
const router = express.Router();
const storage = require('../utils/storage');

// @route   GET /api/stats
// @desc    Get aggregate statistics for the dashboard
router.get('/', (req, res) => {
  const tickets = storage.getTickets();
  const total = tickets.length;
  const pending = tickets.filter(t => t.status === 'Pending').length;
  const inProgress = tickets.filter(t => t.status === 'In Progress').length;
  const resolved = tickets.filter(t => t.status === 'Resolved').length;
  const rejected = tickets.filter(t => t.status === 'Rejected').length;

  const categoryBreakdown = {};
  tickets.forEach(t => {
    categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + 1;
  });

  res.json({
    total,
    pending,
    inProgress,
    resolved,
    rejected,
    resolutionRate: total > 0 ? Math.round((resolved / total) * 100) : 100,
    categoryBreakdown
  });
});

module.exports = router;
