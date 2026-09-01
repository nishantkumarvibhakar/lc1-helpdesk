const express = require('express');
const router = express.Router();
const { upload, uploadToCloudinary, isCloudinaryConfigured } = require('../config/cloudinary');

// @route   GET /api/upload/status
// @desc    Check if Cloudinary is configured and ready
router.get('/status', (req, res) => {
  res.json({
    configured: isCloudinaryConfigured(),
    cloudName: process.env.CLOUDINARY_CLOUD_NAME ? 'Configured' : (process.env.CLOUDINARY_URL ? 'Via CLOUDINARY_URL' : 'Not set'),
    maxFileSize: '15MB'
  });
});

// @route   POST /api/upload
// @desc    Upload any image or document to Cloudinary
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const folder = req.body.folder || 'lc1_helpdesk';
    const result = await uploadToCloudinary(req.file.buffer, folder, {
      mimetype: req.file.mimetype,
      filename_override: req.file.originalname
    });

    res.json({
      message: 'File uploaded successfully',
      url: result.secure_url || result.url,
      secure_url: result.secure_url || result.url,
      fileName: req.file.originalname,
      publicId: result.public_id || null,
      format: result.format || null,
      bytes: req.file.size
    });
  } catch (err) {
    console.error('File upload error:', err);
    res.status(500).json({ message: 'Failed to upload file to Cloudinary: ' + err.message });
  }
});

module.exports = router;
