const  orderModel = require("../models/orderModel");



const getOrdersController = async(req, res)=>{
    try{
        const orders = await orderModel.find({ buyer: req.user.id}).populate("buyer").populate("products" );

        if(!orders || orders.length === 0 ){
            return res.status(404).send({
                success : false,
                message : "You Didin't have any order already"
            })
        }

        const totalAmount = orders.reduce((acc, order) => acc + order.payment, 0);
        const totalCount = orders.length;

        return res.status(200).send({
            success : true,
            message : "Your orders",
            orders,
            totals: {
                totalAmount,
                totalCount
            }

        }) 
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Error in Get orders Api",
            error: error.message,
          });
    }
}

const getAllOrdersController = async(req, res)=>{
    try{
        const orders = await orderModel.find({ }).populate("buyer").populate("products" );
       
        console.log(orders)
        if(!orders || orders.length === 0 ){
            return res.status(404).send({
                success : false,
                message : "You Didin't have any order already"
            })
        }

        const totalAmount = orders.reduce((acc, order) => acc + order.payment, 0);
        const totalCount = orders.length;

        return res.status(200).send({
            success : true,
            message : "Your orders",
            orders,
            totals: {
                totalAmount,
                totalCount
            }

        }) 
    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Error in Get orders Api",
            error: error.message,
          });
    }
}

module.exports = {getOrdersController, getAllOrdersController};