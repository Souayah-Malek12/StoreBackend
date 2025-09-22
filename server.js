
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

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

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
