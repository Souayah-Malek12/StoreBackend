
const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const cookieParser = require('cookie-parser');
const  path =require("path")

const {connectDB} =require("./config/db")


dotenv.config()
const app = express();

app.use(cors())
app.use(express.json())
app.use(cookieParser())


const PORT = process.env.PORT
app.listen(PORT ,
    ()=>console.log(`Server running on port ${PORT}`)   
)

connectDB();

app.get('/', (req, res)=> {
    res.send('API is running');
})

app.use('/api/users', require("./routes/userRoutes") );