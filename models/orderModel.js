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

export default mongoose.model("order", orderSchema)