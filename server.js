const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const path = require('path');

const {connectDB} =require("./config/db")
const categoryRoutes = require("./routes/categoryRoutes") 
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");

dotenv.config()
const app = express();

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'https://souayah-malek12.github.io',
  'https://souayah-malek12.github.io/StoreFrontend',
  'https://leafy-maamoul-81be03.netlify.app'
];

// Enable CORS for all routes
app.use((req, res, next) => {
  const origin = req.headers.origin || req.headers.referer?.replace(/\/$/, '');
  
  // Always allow the request origin if it's in allowedOrigins
  if (origin && allowedOrigins.some(allowedOrigin => 
    origin.includes(allowedOrigin.replace(/https?:\/\//, '').replace(/\/$/, ''))
  )) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  // For preflight requests
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Vary', 'Origin');
    return res.status(200).end();
  }
  
  // For actual requests
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Vary', 'Origin');
  
  next();
});

app.use(express.json())

// Connect to database
connectDB();

app.get('/', (req, res)=> {
    res.send('API is running');
})

// API Routes
app.use('/api/v1/auth', userRoutes );
app.use('/api/v1/category', categoryRoutes )
app.use('/api/v1/product', productRoutes)
app.use('/api/v1/orders', orderRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});   
