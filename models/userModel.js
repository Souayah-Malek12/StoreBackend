const mongoose = require("mongoose")

const userSchema = mongoose.Schema({

    userName: {
        type: String,
        required : true
    },
    email : {
        type: String,
        required : true,
        unique: true
    },
    password : {
        type: String,
        required : true
    },
    confirmPassword : {
        type: String,
        required : true
    },
    isAdmin :{
        type: Boolean,
        required : true,
        default : false
    },
    
}, {timestamps : true})

module.exports = mongoose.model("user" , userSchema)