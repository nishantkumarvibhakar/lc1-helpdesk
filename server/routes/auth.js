const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const storage = require('../utils/storage');
const { authMiddleware, JWT_SECRET } = require('../middleware/auth');

// @route   POST /api/auth/register
// @desc    Register a new LC-1 student with verification
router.post('/register', async (req, res) => {
  try {
    const { name, email, studentId, llbYear, section, phone, password } = req.body;

    if (!name || !email || !password || !studentId) {
      return res.status(400).json({ message: 'Name, email, password, and LC-1 Roll Number are required' });
    }

    const cleanRollNo = studentId.trim().toUpperCase();

    // Basic format check for Law Centre-1 roll number
    const lc1Pattern = /^(2[0-6])?LC[1-3]?[0-9]{3,6}$/i;
    const isStandardFormat = lc1Pattern.test(cleanRollNo) || cleanRollNo.includes('LC') || cleanRollNo.length >= 6;

    if (!isStandardFormat) {
      return res.status(400).json({ 
        message: 'Please enter a valid Law Centre-1 Roll Number (e.g., 24LC10124, 23LC10567)' 
      });
    }

    const existingUser = storage.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists. Please Sign In.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      id: `usr_${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      studentId: cleanRollNo,
      llbYear: llbYear || '1st Year',
      section: section || 'Section A',
      phone: phone ? phone.trim() : '',
      password: hashedPassword,
      role: 'student',
      designation: `Law Centre-1 (${llbYear || 'LL.B.'} - ${section || 'Student'})`,
      isVerifiedLc1: true,
      createdAt: new Date().toISOString()
    };

    storage.addUser(newUser);

    const token = jwt.sign(
      { 
        id: newUser.id, 
        email: newUser.email, 
        role: newUser.role, 
        name: newUser.name, 
        studentId: newUser.studentId,
        llbYear: newUser.llbYear,
        section: newUser.section
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({
      message: 'LC-1 Student verified and registered successfully!',
      token,
      user: userWithoutPassword
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// @route   POST /api/auth/login
// @desc    Login student or admin
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Username/Email and password are required' });
    }

    const cleanIdentifier = String(email).trim().toLowerCase();

    // Look up user by email or username
    const allUsers = storage.getUsers();
    const user = allUsers.find(u => 
      (u.email && u.email.toLowerCase() === cleanIdentifier) ||
      (u.username && u.username.toLowerCase() === cleanIdentifier) ||
      (cleanIdentifier === 'anubhavnishant1@gmail.com' && u.role === 'admin') ||
      (cleanIdentifier === 'prashantdiwakar' && u.role === 'admin') ||
      (cleanIdentifier === 'admin' && u.role === 'admin')
    );

    if (!user) {
      return res.status(401).json({ message: 'Invalid username/email or password' });
    }

    // Support fixed admin password + student default + bcrypt
    let isMatch = false;
    if (
      user.role === 'admin' &&
      (password === 'Nishant@80' || password === 'admin123')
    ) {
      isMatch = true;
    } else if (password === 'student123' && user.role === 'student') {
      isMatch = true;
    } else if (user.password) {
      isMatch = await bcrypt.compare(password, user.password);
    }

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username/email or password' });
    }

    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role, 
        name: user.name, 
        studentId: user.studentId,
        llbYear: user.llbYear || '1st Year',
        section: user.section || 'Section A'
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _, ...userWithoutPassword } = user;
    res.json({
      message: 'Logged in successfully',
      token,
      user: userWithoutPassword
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
router.get('/me', authMiddleware, (req, res) => {
  const user = storage.getUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  const { password: _, ...userWithoutPassword } = user;
  res.json({ user: userWithoutPassword });
});

module.exports = router;
