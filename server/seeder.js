const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Product = require('./models/productModel');
const User = require('./models/userModel');
const Order = require('./models/orderModel');
const { products } = require('./utils/mockStore');

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await Product.deleteMany();
    await User.deleteMany();
    await Order.deleteMany();

    await Product.insertMany(products);

    // Create a sample demo user
    const sampleUser = await User.create({
      name: 'Demo User',
      email: 'user@example.com',
      password: 'password123',
    });

    // Create a sample order so orders collection exists immediately
    await Order.create({
      user: sampleUser._id,
      guestEmail: sampleUser.email,
      orderItems: [
        {
          id: 1,
          name: 'Wireless Over-Ear Headphones',
          quantity: 1,
          price: 9999,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
        },
      ],
      shippingAddress: {
        fullName: 'Demo User',
        address: '123 MG Road',
        city: 'Bengaluru',
        postalCode: '560001',
      },
      paymentMethod: 'UPI',
      totalPrice: 9999,
      isPaid: true,
      paymentResult: {
        transactionId: `TXN_SWIFT_DEMO_101`,
        status: 'SUCCESS',
        paidAt: new Date(),
      },
    });

    console.log(`✅ ${products.length} Products, Demo User, and Sample Order successfully seeded into MongoDB!`);
    process.exit();
  } catch (error) {
    console.error(`❌ Seeding error: ${error.message}`);
    process.exit(1);
  }
};

importData();
