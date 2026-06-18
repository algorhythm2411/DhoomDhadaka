const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db.js');
const authRoutes = require('./routes/authRoutes.js');
const setRoutes = require('./routes/setRoutes.js'); // Naya import

// Load environment variables
dotenv.config();

// Connect to MongoDB Atlas
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes Integration
app.use('/api/auth', authRoutes);
app.use('/api/sets', setRoutes); // Sets endpoints connect ho gaye

// Basic Health Check Route
app.get('/', (req, res) => {
  res.json({ message: "Welcome to the Gamified DILR Platform API!" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🎯 Server sprinting on port ${PORT}`);
});
