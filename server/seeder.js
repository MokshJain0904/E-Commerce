const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Product = require('./models/productModel');
const User = require('./models/userModel');
const { products } = require('./utils/mockStore');

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await Product.deleteMany();
    await User.deleteMany();

    await Product.insertMany(products);

    // Create a sample demo user
    await User.create({
      name: 'Demo User',
      email: 'user@example.com',
      password: 'password123',
    });

    console.log(`✅ ${products.length} Products successfully seeded into MongoDB!`);
    process.exit();
  } catch (error) {
    console.error(`❌ Seeding error: ${error.message}`);
    process.exit(1);
  }
};

importData();
