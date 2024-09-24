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

    const newUser = await userModel.create({ userName, email,  password: hashedPassword })
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

const loginUser = async(req, res)=> {
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
                message: "Check your email/password",
            })
        }

        const isMatch = await bcrypt.compare(password,  userExist.password)

        if(!isMatch){
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
        return  res.status(500).send({
            success: false,
            message :" Error in login user Api"
        })
    }
}
const logoutUser = async(req, res)=>{
    res.cookie("jwt", "", {
        httpOnly : true,
        expiresIn : new Date(0)
    })

    res.status(200).send({
        success: true,
        message: "Loged out Successfully"
    })
}

const getAllUsers = async(req, res)=> {
    try{
        const AllUsers = await userModel.find() 
        return res.status(200).send({
            success: true,
            message : "List of Users",
            AllUsers
        })
    }catch(error){
        return  res.status(500).send({
            success: false,
            message :" Error in get All user Api"
        })
    }
}

const getUser = async(req, res)=> {
    try{

        const User = await userModel.findById(req.user.id);
        
        if(!User){
            return res.status(404).send({
                success : false,
                message : "User not Found"
            })
        }

         
        return res.status(200).send({
            success : true,
            id: User._id,
            userName: User.userName,
            email: User.email,
            isAdmin: User.isAdmin
            
        })
    }catch(error){
        return  res.status(500).send({
            success: false,
            message :" Error in get  user Api"
        })
    }
}


const updateProfil = async(req, res)=> {
    try{

        const UserId = req.user.id;
        if(req.body.password){  
            const Salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, Salt)
        }
        const updatedUser = await userModel.findByIdAndUpdate(UserId , req.body ,{
            new:true,
            runValidators : true
        } )

        if(!updatedUser){
            return res.status(404).send({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).send({
            success: true,
            message: "Profile updated successfully",
            updatedUser,
            
        });

    }catch(error){
        return  res.status(500).send({
            success: false,
            message :" Error in update  profil Api",
            error : error.message
        })
    }
}

const deleteUser = async(req, res)=> {
    try{
        const userExist = await userModel.findById(req.params.id);

        if(!userExist){
            return  res.status(404).send({
                success: false,
                message :" User not found",
            })
        }
        if(userExist){
            if(userExist.isAdmin){
                return  res.status(400).send({
                    success: false,
                    message :" Cannot delete Admin",
                    error : error.message
                })
            }else {
                await userModel.deleteOne(userExist._id)
            }
        }
        return res.status(200).send({
            success : true,
            message:'Deleted successfully',
            
        })
    }catch(error){
        return  res.status(500).send({
            success: false,
            message :" Error in delete user Api",
            error : error.message
        })
    }
}

const getUserById = async(req, res)=>{
try{
    const userExist = await userModel.findById(req.params.id);
    if(!userExist){
        return  res.status(404).send({
            success: false,
            message :" User not Found",
            })
    }
    const id = userExist._id;
    const userName = userExist.userName
    const email = userExist.email
    const isAdmin = userExist.isAdmin

    return  res.status(200).send({
        success: true,
        id,
        userName,
        email,
        isAdmin
    })}catch(error){
    return  res.status(500).send({
        success: false,
        message :" Error in delete user Api",
        error : error.message
    })
}
}


const updatedUserById = async (req, res) => {
    try {
        const userExist = await userModel.findById(req.params.id);

        console.log(req.params.id)
        // Check if the user exists
        if (!userExist) {
            return res.status(404).send({
                success: false,
                message: "User not found",
            });
        }

        // Update fields if they are provided in the request body
        if (req.body.userName) userExist.userName = req.body.userName;
        if (req.body.email) userExist.email = req.body.email;
        if (typeof req.body.isAdmin !== 'undefined') {
            userExist.isAdmin = Boolean(req.body.isAdmin);
        }

        
        const updatedUser = await userExist.save();

        // Send a success response with updated user information
        return res.status(200).send({
            success: true,
            id: updatedUser._id,
            userName: updatedUser.userName,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Error in update user by ID API",
            error: error.message,
        });
    }
};



module.exports = {createUser, loginUser, logoutUser, getAllUsers, getUser, updateProfil, deleteUser, getUserById, updatedUserById}
