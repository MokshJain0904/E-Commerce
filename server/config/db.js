const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/swiftcart');
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`⚠️ MongoDB Connection Warning: ${error.message}`);
  }
};

mongoose.connection.on('connected', () => {
  console.log('💚 Mongoose event: Connected to MongoDB database successfully!');
});

mongoose.connection.on('error', (err) => {
  console.error('💔 Mongoose event connection error:', err.message);
});

module.exports = connectDB;
