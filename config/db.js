const mongoose =require("mongoose")

const connectDB = async ()=>   {
    try{
        await mongoose.connect(process.env.DbUrl)
        console.log(`Connected to database successfully ${mongoose.connection.host}` )
    }catch(error){
        throw new Error(error.message)
    }
}


module.exports = {connectDB}