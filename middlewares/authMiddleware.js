const jwt =require("jsonwebtoken")
const userModel = require("../models/userModel")

 const requireSignIn = (req, res, next)=> {
    try{    
        const token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized, token missing' });
        }
        const decode = jwt.verify(token, process.env.SECRET);
        req.user = decode;
        next();
    }catch(error){
        console.log(error)
    }
}

const isAdmin = async(req, res, next)=> {
    try{
        const user = await userModel.findById(req.user.id)
        if(!user || user.role !== 1){
            return res.status(401).send({
                success: false,
                message: "UnAuthorized Access",
              }); 
        }

            next();
        
    }catch(error){
        return res.status(500).send({
            success: false,
            message: 'Error in authorize Admin middleware '
        })
    }
}




module.exports = {requireSignIn, isAdmin}