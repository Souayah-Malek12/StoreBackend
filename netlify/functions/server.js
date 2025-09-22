const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectDB } = require('../../config/db');

const app = express();

// Connect to database
connectDB();

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'https://souayah-malek12.github.io',
  'https://souayah-malek12.github.io/StoreFrontend',
  'https://souayah-malek12.github.io/StoreFrontend/'
];

// Middleware
app.use((req, res, next) => {
  const origin = req.headers.origin || req.headers.referer?.replace(/\/$/, '');
  if (allowedOrigins.some(allowedOrigin => origin?.includes(allowedOrigin.replace(/https?:\/\//, '').replace(/\/$/, '')))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('API is running');
});

// Import and use your routes
const path = require('path');

// Use absolute paths for imports
const routesPath = path.join(__dirname, '..', '..', 'routes');
app.use('/api/v1/auth', require(path.join(routesPath, 'userRoutes')));
app.use('/api/v1/category', require(path.join(routesPath, 'categoryRoutes')));
app.use('/api/v1/product', require(path.join(routesPath, 'productRoutes')));
app.use('/api/v1/orders', require(path.join(routesPath, 'orderRoutes')));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Export the serverless function
module.exports.handler = serverless(app);
