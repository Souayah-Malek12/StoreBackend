
const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")

const {connectDB} =require("./config/db")
const categoryRoutes = require("./routes/categoryRoutes") 



dotenv.config()
const app = express();

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173', // Local development
  'https://souayah-malek12.github.io', // GitHub Pages URL
  'https://souayah-malek12.github.io/StoreFrontend' // Project site URL
];

// Enable CORS for all routes
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
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

app.use(express.json())





app.get('/', (req, res)=> {
    res.send('API is running');
})

app.use('/api/v1/auth', require("./routes/userRoutes") );

//category
app.use('/api/v1/category', categoryRoutes )

// 
app.use('/api/v1/product', require('./routes/productRoutes'))


const PORT = process.env.PORT

connectDB().then(() => {
    app.listen(PORT ,
        ()=>console.log(`Server running on port ${PORT}`)   
    )    
}).catch((err) => {
    console.log(err);
});

console.log("bonjour");
