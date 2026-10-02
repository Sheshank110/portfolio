const mongoose = require('mongoose');

const connectDB = async () => {
  if (!process.env.MONGO_URI || process.env.MONGO_URI.includes('your_username')) {
    console.warn('⚠️ [MongoDB] MONGO_URI not configured in server/.env. Database features will be simulated/disabled until configured.');
    return;
  }
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    console.warn('⚠️ [MongoDB] Continuing server execution without database connection.');
  }
};

module.exports = connectDB;

