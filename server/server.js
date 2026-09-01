const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const connectDB = require('./config/db');
const storage = require('./utils/storage');
const authRoutes = require('./routes/auth');
const ticketRoutes = require('./routes/tickets');
const noticeRoutes = require('./routes/notices');
const faqRoutes = require('./routes/faqs');
const teamRoutes = require('./routes/team');
const statsRoutes = require('./routes/stats');
const manifestoRoutes = require('./routes/manifesto');
const uploadRoutes = require('./routes/upload');

const app = express();

// Initialize data store & connect to MongoDB if MONGODB_URI is provided
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

// Unhandled API Routes (never return HTML)
app.all('/api/*', (req, res) => {
  res.status(404).json({ message: `API route not found: ${req.method} ${req.originalUrl}` });
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    app: 'LC1 Student Help Desk API',
    initiative: 'Team Prashant Diwakar',
    mongoConfigured: Boolean(process.env.MONGODB_URI),
    cloudinaryConfigured: Boolean(process.env.CLOUDINARY_CLOUD_NAME),
    timestamp: new Date().toISOString()
  });
});

// Production: Serve React frontend static build if present
const clientDistPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));

  // SPA fallback: any non-API route serves index.html
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(clientDistPath, 'index.html'));
    }
  });
} else {
  // Development fallback for root route
  app.get('/', (req, res) => {
    res.json({
      message: '🏛️ LC1 Student Help Desk API is active! An Initiative by Team Prashant Diwakar.',
      documentation: '/api/health'
    });
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 LC1 Help Desk Server running on port ${PORT}`);
  console.log(`🏛️ An Initiative by Team Prashant Diwakar`);
  console.log(`====================================================`);
});
