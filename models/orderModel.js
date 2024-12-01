const mongoose  = require("mongoose")


const orderSchema = new mongoose.Schema({
    products: [{
        name: {
            type: String 
        },
        color : {
            type: String,
        },
        size : {
            type: String
        },
        photo : {
            type: String
        }
       
    }],
    payment : {},
    buyer : {
        type: String,
        
    },
   
      addresse : {
        type: String  
      }
      ,
    buyerPhone : {
        type : Number
    },
   
    status : {
        type: String,
        default : "Not Process",
        enum : ["Not Process", "Proccessing" , "treated", "Delivered", "Cancelled"]
    }
}, {timestamps: true})

module.exports = mongoose.model("order", orderSchema)