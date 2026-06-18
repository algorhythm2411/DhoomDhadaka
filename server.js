const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');

// Load environment variables
dotenv.config();

// Connect to MongoDB Atlas
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Allows us to parse JSON bodies

// Basic Health Check Route
app.get('/', (req, res) => {
  res.json({ message: "Welcome to the Gamified DILR Platform API!" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🎯 Server sprinting on port ${PORT}`);
});
