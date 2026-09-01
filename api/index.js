const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('../server/config/db');
const storage = require('../server/utils/storage');
const authRoutes = require('../server/routes/auth');
const ticketRoutes = require('../server/routes/tickets');
const noticeRoutes = require('../server/routes/notices');
const faqRoutes = require('../server/routes/faqs');
const teamRoutes = require('../server/routes/team');
const statsRoutes = require('../server/routes/stats');
const manifestoRoutes = require('../server/routes/manifesto');
const uploadRoutes = require('../server/routes/upload');

const app = express();

// Initialize in-memory storage and MongoDB Atlas
storage.init();
connectDB();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/faqs', faqRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/manifesto', manifestoRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/stats', statsRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    app: 'LC1 Student Help Desk API (Vercel Serverless)',
    initiative: 'Team Prashant Diwakar',
    mongoConfigured: Boolean(process.env.MONGODB_URI),
    cloudinaryConfigured: Boolean(process.env.CLOUDINARY_CLOUD_NAME),
    timestamp: new Date().toISOString()
  });
});

// Fallback for API
app.all('/api/*', (req, res) => {
  res.status(404).json({ message: `API route not found: ${req.method} ${req.originalUrl}` });
});

module.exports = app;
