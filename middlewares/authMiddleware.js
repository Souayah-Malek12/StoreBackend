const jwt =require("jsonwebtoken")
const userModel = require("../models/userModel")

const authMiddleware = async(req, res, next)=> {
   try{
    const token = req.cookies.jwt;

    if(!token){
        return res.status(401).send({
            success: false,
            message: 'Token is missing'
        });
    }

    const decode = jwt.verify( token , process.env.SECRET)
    const userExist = await userModel.findById(decode.id)

    if (!userExist) {
        return res.status(401).send({
            success: false,
            message: 'User not found'
        });
    }
    req.user = userExist
    next();
    }catch(error){
        return res.status(500).send({
            success: false,
            message: 'Token is invalid or expired',
            error
        })
    }
}

const authorizeAdmin = async(req, res, next)=> {
    try{
        if(req.user && req.user.isAdmin===true){
            next();
        }else {
            return res.status(403).send({
                success: false,
                message: "Access denied Only Admin"
            })
        }
    }catch(error){
        return res.status(500).send({
            success: false,
            message: 'Error in authorize Admin middleware '
        })
    }
}

module.exports =  {authMiddleware, authorizeAdmin }