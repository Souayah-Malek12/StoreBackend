const jwt = require("jsonwebtoken")

const generateToken = async(req, res, userID) => {

const token = jwt.sign({id : userID}, process.env.SECRET,  {expiresIn: '1d'})

res.cookie("jwt", token, {
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production', 
    sameSite: "strict", 
    maxAge: 30 * 24 * 60 * 60 * 1000 
});

}

module.exports = {generateToken};



