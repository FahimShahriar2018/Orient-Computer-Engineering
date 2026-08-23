import mongoose from 'mongoose';
import dotenv from 'dotenv';
import users from '../data/users.js';
import categories from '../data/categories.js';
import products from '../data/products.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import connectDB from '../config/db.js';

dotenv.config();

const importData = async () => {
  try {
    const conn = await connectDB();
    if (!conn || mongoose.connection.readyState !== 1) {
      console.error('\x1b[31m✖ Cannot seed database because MongoDB is not connected.\x1b[0m');
      console.error('\x1b[33m👉 Please start your local MongoDB service or configure a MongoDB Atlas connection string in server/.env\x1b[0m');
      process.exit(1);
    }

    console.log('\x1b[33m⏳ Clearing existing database records...\x1b[0m');
    await Order.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();

    console.log('\x1b[34m📦 Seeding Users (with bcrypt password encryption)...\x1b[0m');
    // Using User.create to trigger pre('save') password hashing middleware
    const createdUsers = await User.create(users);
    const adminUser = createdUsers.find((u) => u.role === 'admin') || createdUsers[0];
    const customerUser = createdUsers.find((u) => u.role === 'customer') || createdUsers[1];

    console.log('\x1b[34m📦 Seeding Hardware Categories...\x1b[0m');
    const createdCategories = await Category.insertMany(categories);
    const categoryMap = createdCategories.reduce((map, cat) => {
      map[cat.slug] = cat._id;
      return map;
    }, {});

    console.log('\x1b[34m📦 Seeding Authentic Orient Computers Hardware Catalog...\x1b[0m');
    const sampleProducts = products.map((prod) => {
      const categoryId = categoryMap[prod.categorySlug] || createdCategories[0]._id;
      
      const sampleReviews = [
        {
          user: customerUser._id,
          name: customerUser.name,
          rating: prod.rating || 5,
          comment: `Excellent genuine product from Orient Computers. Fast delivery and authentic official brand warranty!`,
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        },
      ];

      return {
        ...prod,
        category: categoryId,
        reviews: sampleReviews,
      };
    });

    const createdProducts = await Product.insertMany(sampleProducts);

    console.log('\x1b[34m📦 Seeding Sample Customer Orders & Fulfillment History...\x1b[0m');
    const sampleOrders = [
      {
        user: customerUser._id,
        orderItems: [
          {
            product: createdProducts[0]._id,
            title: createdProducts[0].title,
            image: createdProducts[0].images[0],
            price: createdProducts[0].discountPrice || createdProducts[0].price,
            qty: 1,
            sku: createdProducts[0].sku,
          },
          {
            product: createdProducts[6]._id,
            title: createdProducts[6].title,
            image: createdProducts[6].images[0],
            price: createdProducts[6].discountPrice || createdProducts[6].price,
            qty: 1,
            sku: createdProducts[6].sku,
          },
        ],
        shippingAddress: {
          fullName: customerUser.name,
          phone: customerUser.phone,
          email: customerUser.email,
          division: 'Dhaka',
          district: 'Dhaka',
          address: 'House 42, Road 11, Dhanmondi',
          postalCode: '1209',
        },
        deliveryMethod: 'standard_inside_dhaka',
        paymentMethod: 'bkash',
        paymentResult: {
          id: 'TRX-BKASH-892109',
          status: 'COMPLETED',
          update_time: new Date().toISOString(),
          phone_number: '01812345678',
          transaction_id: '8AJ9201948B',
        },
        itemsPrice: 148400,
        shippingPrice: 100,
        taxPrice: 0,
        discountPrice: 0,
        totalPrice: 148500,
        isPaid: true,
        paidAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        orderStatus: 'Processing',
        trackingNumber: 'ORIENT-2026-948102',
        statusHistory: [
          { status: 'Pending', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), note: 'Order placed online' },
          { status: 'Confirmed', timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000), note: 'bKash payment verified' },
          { status: 'Processing', timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000), note: 'Items allocated in Orient Central Warehouse' },
        ],
      },
      {
        user: customerUser._id,
        orderItems: [
          {
            product: createdProducts[10]._id,
            title: createdProducts[10].title,
            image: createdProducts[10].images[0],
            price: createdProducts[10].discountPrice || createdProducts[10].price,
            qty: 1,
            sku: createdProducts[10].sku,
          },
        ],
        shippingAddress: {
          fullName: 'Engr. Tariqul Islam',
          phone: '+8801919876543',
          email: 'tariq.engineer@orientcomputers.com.bd',
          division: 'Chittagong',
          district: 'Chittagong',
          address: 'Agrabad Commercial Area',
          postalCode: '4100',
        },
        deliveryMethod: 'standard_outside_dhaka',
        paymentMethod: 'COD',
        itemsPrice: 199000,
        shippingPrice: 200,
        taxPrice: 0,
        discountPrice: 0,
        totalPrice: 199200,
        isPaid: true,
        paidAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        orderStatus: 'Delivered',
        trackingNumber: 'ORIENT-2026-819203',
        statusHistory: [
          { status: 'Pending', timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), note: 'Order placed by customer' },
          { status: 'Shipped', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), note: 'Dispatched via Express Courier' },
          { status: 'Delivered', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), note: 'Package delivered & Cash collected' },
        ],
      },
    ];

    await Order.insertMany(sampleOrders);

    console.log('\x1b[32m===================================================\x1b[0m');
    console.log('\x1b[32m✔ SUCCESS: Orient Computers Database Seeded!\x1b[0m');
    console.log(`\x1b[36m👤 Users Seeded:\x1b[0m ${createdUsers.length}`);
    console.log(`   - Admin:    admin@orientcomputers.com.bd (password: admin123)`);
    console.log(`   - Customer: customer@orientcomputers.com.bd (password: customer123)`);
    console.log(`\x1b[36m📁 Categories Seeded:\x1b[0m ${createdCategories.length}`);
    console.log(`\x1b[36m💻 Products Seeded:\x1b[0m   ${createdProducts.length}`);
    console.log(`\x1b[36m🛒 Orders Seeded:\x1b[0m     ${sampleOrders.length}`);
    console.log('\x1b[32m===================================================\x1b[0m');

    process.exit(0);
  } catch (error) {
    console.error(`\x1b[31m✖ Error during seeding: ${error.message}\x1b[0m`, error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    const conn = await connectDB();
    if (!conn || mongoose.connection.readyState !== 1) {
      console.error('\x1b[31m✖ Cannot clear database because MongoDB is not connected.\x1b[0m');
      console.error('\x1b[33m👉 Please start your local MongoDB service or configure a MongoDB Atlas connection string in server/.env\x1b[0m');
      process.exit(1);
    }

    console.log('\x1b[31m⏳ Destroying all Orient Computers database collections...\x1b[0m');
    await Order.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();

    console.log('\x1b[32m✔ Database successfully cleared.\x1b[0m');
    process.exit(0);
  } catch (error) {
    console.error(`\x1b[31m✖ Error destroying data: ${error.message}\x1b[0m`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d' || process.argv[2] === '--destroy') {
  destroyData();
} else {
  importData();
}
