import mongoose from 'mongoose';
import User from './User.js';


// MongoDB connection URI
const MONGO_URI = 'mongodb+srv://magnificblr:4gphC5JgMvwF7aT3@inventory.m7seo.mongodb.net/inventory?retryWrites=true&w=majority&appName=inventory'; // Replace with your MongoDB URI

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

const createAdminUser = async () => {
  try {
    // Check if an admin user already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin);
      return;
    }

    // Create a new admin user
    const adminUser = new User({
      username: 'admin', // Replace with desired username
      email: 'admin@example.com', // Replace with desired email
      password: '20140457764', // Replace with desired password
      role: 'admin',
    });

    // Save the admin user to the database
    await adminUser.save();
    console.log('Admin user created successfully:', adminUser);
  } catch (error) {
    console.error('Error creating admin user:', error.message);
  } finally {
    mongoose.connection.close();
  }
};

// Run the script
const run = async () => {
  await connectDB();
  await createAdminUser();
};

run();
