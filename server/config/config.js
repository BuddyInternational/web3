import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Connection options for Mongoose
const options = {
  useNewUrlParser: true,         // Use the new URL string parser
  useUnifiedTopology: true,      // Use the new server discovery and monitoring engine
  serverSelectionTimeoutMS: 5000 // Timeout after 5000ms if server is not reachable
};

// Connect to MongoDB
const connection = mongoose.connect(process.env.CONNECTION_STRING, options)
  .then(() => console.log('Database connected successfully'))
  .catch((err) => {
    console.error('Database connection error:', err);
    process.exit(1);  // Exit process if connection fails
  });

// Handle disconnection events
mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB connection lost. Attempting to reconnect...');
});

// Export the connection
export default connection;
