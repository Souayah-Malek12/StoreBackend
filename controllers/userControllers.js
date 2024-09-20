const userModel = require("../models/userModel")
const bcrypt = require('bcrypt');
const {generateToken} = require("../utils/genToken")

const createUser = async(req, res)=> {

    try{

        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const { userName, email, password, confirmPassword} = req.body;

    if(!userName || !email || !password || !confirmPassword){
        return res.status(400).send({
            success : false,
            message: "provide missed fields"
        })
    }
    if(!regex.test(email)){
        return res.status(401).send({
            success : false,
            message : "Enter a Valid email format"
        })
    }

    const userExist = await userModel.findOne({email})
    if(userExist){
        return res.status(409).send({
            success : false, 
            message : "This email already exist "
        })
    }
    if(password !== confirmPassword){
        return res.status(401).send({
            success : false,
            message : "Passwords doesn't match"
        }) 
    }
    const Salt = await bcrypt.genSalt(10);
    var hashedPassword =  await bcrypt.hash(password, Salt)

    const newUser = await userModel.create({ userName, email, password, confirmPassword: hashedPassword })
    await generateToken(req, res, newUser._id)


    const UserId = newUser._id; 
    const UserName = newUser.userName; 
    const UserEmail = newUser.email; 
    const UserAdmin = newUser.isAdmin; 

    return res.status(201).send({
        success: true,
        message: "User created Successfully",
        UserId,
        UserName,
        UserEmail,
        UserAdmin

    })
    }catch(error){

        console.log(error)

        return  res.status(500).send({
            success: false,
            message :" Error in create user Api"
        })
    }
}

const login = async(req, res)=> {
    try{
        const {email, password} = req.body;

        if(!email || !password){
            return  res.status(400).send({
                success: false,
                message :" Provide missed fields"
            })
        }

        const userExist = await userModel.findOne({email})

        if(!userExist){
            return res.status(404).send({
                success : false,
                message: "User not found",
            })
        }

        const isMatch = await bcrypt.compare(password,  userExist.password)

        if(isMatch){
            return res.status(401).send({   
                success : false,
                message: "Password do not  match",
            })
        }

        generateToken( req, res, userExist._id)

        return res.status(200).send({
            success: true,
            message : "LogIn successfully ",
            id: userExist._id,
            userName: userExist.userName,
            email: userExist.email,
            isAdmin: userExist.isAdmin

        })
    }catch(error){
        console.log(error)
        return  res.status(500).send({
            success: false,
            message :" Error in login user Api"
        })
    }
}

module.exports = {createUser, login}
