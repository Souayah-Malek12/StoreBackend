const mongoose = require("mongoose")

const productModel = mongoose.Schema({
    name : {
        type: String,
        required : true
    },
    slug: {
        type: String,
        required : true
    },
    description : {
        type: String,
        required : true
    },
    price : {
        type: Number,
        required : true
    },
    category : {
        type: mongoose.Schema.Types.ObjectId,
        ref : "category"

    }, 
    details : [
        {
        color :String,
        size :String,
        quantities: Number
        }
    ],
    quantity : {
        type: Number,
        required : true
    },
    photo : {
        type: String,
        
    },
    
}, { timestamp :true})

module.exports  = mongoose.model("product", productModel)