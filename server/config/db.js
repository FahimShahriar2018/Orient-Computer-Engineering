import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/orient_computers',
      {
        serverSelectionTimeoutMS: 3000,
      }
    );
    console.log(`\x1b[32m✔ MongoDB Connected: ${conn.connection.host} [DB: ${conn.connection.name}]\x1b[0m`);
    return conn;
  } catch (error) {
    console.warn(`\x1b[33m⚠ Warning: MongoDB connection failed (${error.message}).\x1b[0m`);
    console.log(`\x1b[36mℹ Note: Server will continue running in offline database mode. Update MONGO_URI in server/.env.\x1b[0m`);
  }
};

export default connectDB;
