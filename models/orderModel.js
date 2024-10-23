const mongoose  = require("mongoose")


const orderSchema = new mongoose.Schema({
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product'
    }],
    payment : {},
    buyer : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    status : {
        type: String,
        default : "Not Process",
        enum : ["Not Process", "Proccessing" , "Shipped", "Delivered", "Cancelled"]
    }
}, {timestamps: true})

module.exports = mongoose.model("order", orderSchema)