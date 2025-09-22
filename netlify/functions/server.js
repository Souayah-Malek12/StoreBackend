const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectDB } = require('../../config/db');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors({
  origin: '*', // Update this with your frontend URL after deployment
  credentials: true
}));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('API is running');
});

// Import and use your routes
app.use('/api/v1/auth', require('../../routes/userRoutes'));
app.use('/api/v1/category', require('../../routes/categoryRoutes'));
app.use('/api/v1/product', require('../../routes/productRoutes'));
app.use('/api/v1/orders', require('../../routes/orderRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Export the serverless function
module.exports.handler = serverless(app);
