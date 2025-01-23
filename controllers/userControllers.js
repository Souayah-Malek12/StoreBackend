const userModel = require("../models/userModel")
const bcrypt = require('bcrypt');
const JWT = require("jsonwebtoken")



const registreController = async (req, res) => {
    try {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const { name, email, password, confirmPassword, phone, address, role } = req.body;

        if (!name) {
            return res.send({ error: "Name is Required" });
          }
          if (!email) {
            return res.send({ error: "Email is Required" });
          }
          if (!password) {
            return res.send({ error: "Password is Required" });
          }
          if (!confirmPassword) {
            return res.send({ error: "Confirm Password is Required" });
          }
          if (!phone) {
            return res.send({ error: "Phone no is Required" });
          }
          if (!address) {
            return res.send({ error: "Address is Required" });
          }

        if (!emailRegex.test(email)) {
            return res.status(400).send({
                success: false,
                message: "Please enter a valid email format"
            });
        }

        const userExist = await userModel.findOne({ email });
        if (userExist) {
            return res.status(409).send({
                success: false,
                message: "This email is already in use"
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).send({
                success: false,
                message: "Passwords do not match"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await userModel.create({
            name,
            email,
            password: hashedPassword,
            phone,
            address, 
            role : role || 0    
            
        });

        const { _id: UserId, name: UserName, email: UserEmail, phone: UserPhone, address: UserAddress, role : UserRole } = newUser;

        return res.status(201).send({
            success: true,
            message: "User created successfully",
            user: {
                UserId,
                UserName,
                UserEmail,
                UserPhone,
                UserAddress,
                UserRole
            }
        });

    } catch (error) {
        console.error("Error in user registration:", error);
        return res.status(500).send({
            success: false,
            message: "Error in registre api"
        });
    }
};


const loginController = async(req, res)=> {
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

        const token = await JWT.sign( { id: userExist._id}, process.env.SECRET, {
            expiresIn : '1d'
        })
        userExist.password=undefined

        return res.status(200).send({
            success: true,
            message : "LogIn successfully ",
            user :{
            id: userExist._id,
            userName: userExist.name,
            email: userExist.email,
            phone: userExist.phone,
            address: userExist.address,
            role: userExist.role
            },
            token

        })
    }catch(error){
        return  res.status(500).send({
            success: false,
            message :" Error in login user Api",
            error

        })
    }
}

const testController = async(req, res)=>{
try{
    res.send({message: "protected route"})
}catch(error){
    res.send({error})
}
}


const updateProfilController = async(req, res)=> {
    try{
        
        const { name, email ,NewPassword,  phone, address } = req.body;

        const userExist = await userModel.findById(req.user.id);
        console.log(req.user.id)

        if (!userExist) {
            return res.status(404).send({
                success: false,
                message: "User not found"
            });
        }
        if(NewPassword ){

            if (NewPassword.length < 6) {
                return res.status(400).send({
                    success: false,
                    message: "Password must be at least 6 characters long"
                });
            }
            
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(NewPassword, salt);
               userExist.password  = hashedPassword;

            
            
        }


        if(name) userExist.name  = name;
        if(email) userExist.email  = email;
        if(phone) userExist.phone  = phone;
        if(address) userExist.address  = address;

        await userExist.save();
        return res.status(200).send({
            success : true,
            message: "Profil  updated Successfully",
            user : 
            {
                name, 
                email,
                phone,
                address
            }
        })

        
    }catch(error){
        return  res.status(500).send({
            success: false,
            message :" Error in Update profil  Api",
            error

        });
    }
}

const getUsers = async (req, res) => {
    try {
      const users = await userModel.find({});
      return res.status(200).send({
        success: true,
        message: "Users List",
        users,
      });
    } catch (err) {
      return res.status(500).send({
        success: false,
        message: "Error in getting users list API",
        error: err.message,  
      });
    }
  };
  





module.exports = {registreController, loginController, testController, updateProfilController, getUsers}
