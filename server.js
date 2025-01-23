
const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")

const {connectDB} =require("./config/db")
const categoryRoutes = require("./routes/categoryRoutes") 



dotenv.config()
const app = express();

app.use(cors({
    origin: 'http://localhost:5173', //  requests from your frontend 
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
