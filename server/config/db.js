const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.log('ℹ️ [Database]: MONGODB_URI not set. Running with built-in persistent storage.');
    console.log('💡 Tip: Add MONGODB_URI in server/.env to connect your MongoDB Atlas cluster.');
    return false;
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`🍃 [MongoDB Atlas Connected]: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`❌ [MongoDB Connection Error]: ${error.message}`);
    console.log('⚠️ Falling back to built-in persistent storage.');
    return false;
  }
};

module.exports = connectDB;
