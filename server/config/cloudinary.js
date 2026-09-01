const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// Configure Cloudinary with either CLOUDINARY_URL or individual variables
if (process.env.CLOUDINARY_URL) {
  cloudinary.config({
    cloudinary_url: process.env.CLOUDINARY_URL
  });
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
    api_key: process.env.CLOUDINARY_API_KEY || '',
    api_secret: process.env.CLOUDINARY_API_SECRET || '',
    secure: true
  });
}

// Check if Cloudinary is configured
const isCloudinaryConfigured = () => {
  const config = cloudinary.config();
  return Boolean(config.cloud_name && (config.api_key || process.env.CLOUDINARY_URL));
};

// Configure Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB limit
});

// Helper function to upload file buffer to Cloudinary
const uploadToCloudinary = (fileBuffer, folder = 'lc1_helpdesk', options = {}) => {
  return new Promise((resolve, reject) => {
    if (!isCloudinaryConfigured()) {
      console.log('ℹ️ [Cloudinary]: Credentials not set in .env. Falling back to local data URL.');
      const base64 = fileBuffer.toString('base64');
      const mimeType = options.mimetype || 'image/jpeg';
      const dataUri = `data:${mimeType};base64,${base64}`;
      return resolve({
        secure_url: dataUri,
        url: dataUri,
        public_id: `local_${Date.now()}`,
        isLocal: true
      });
    }

    const uploadOptions = {
      folder,
      resource_type: 'auto',
      ...options
    };

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error('❌ Cloudinary Upload Error:', error);
          return reject(error);
        }
        console.log(`✅ [Cloudinary]: Uploaded successfully to ${result.secure_url}`);
        resolve(result);
      }
    );

    uploadStream.end(fileBuffer);
  });
};

module.exports = {
  cloudinary,
  upload,
  uploadToCloudinary,
  isCloudinaryConfigured
};
