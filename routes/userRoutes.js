const express = require("express")
const {registreController, loginController, testController} = require("../controllers/userControllers")
const {requireSignIn, isAdmin} = require("../middlewares/authMiddleware")

const router = express.Router();

router.post('/registre' ,registreController)
router.post('/login',loginController )

router.get("/user-auth", requireSignIn, (req, res) => {res.status(200).send({success : true})} ) 

router.get("/admin-auth", requireSignIn, isAdmin, (req, res)=> { res.status(200).send({success : true} ) })  

router.get("/test", requireSignIn , isAdmin ,testController)

module.exports = router;