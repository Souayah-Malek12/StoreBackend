
const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")

const {connectDB} =require("./config/db")


dotenv.config()
const app = express();

app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from your frontend running on this origin
    credentials: true // Allow credentials (for cookies, sessions, etc.)
}));

app.use(express.json())


const PORT = process.env.PORT
app.listen(PORT ,
    ()=>console.log(`Server running on port ${PORT}`)   
)

connectDB();

app.get('/', (req, res)=> {
    res.send('API is running');
})

app.use('/api/v1/auth', require("./routes/userRoutes") );