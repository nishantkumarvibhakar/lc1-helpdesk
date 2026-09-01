const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'lc1_helpdesk_super_secret_key_2026';

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token missing or invalid' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is invalid or expired' });
  }
}

function adminOnly(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Team Prashant Diwakar / Admin privileges required.' });
  }
  next();
}

module.exports = {
  authMiddleware,
  adminOnly,
  JWT_SECRET
};
