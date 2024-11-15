const express = require("express")
const {registreController, loginController, testController, updateProfilController} = require("../controllers/userControllers")
const {requireSignIn, isAdmin} = require("../middlewares/authMiddleware");
const {  getOrdersController } = require("../controllers/orderController");

const router = express.Router();

router.post('/registre' ,registreController)
router.post('/login',loginController )
router.put('/profil', requireSignIn, updateProfilController)

router.get("/user-auth", requireSignIn, (req, res) => {res.status(200).send({success : true})} ) 

router.get("/admin-auth", requireSignIn, isAdmin, (req, res)=> { res.status(200).send({success : true} ) })  

router.get("/test", requireSignIn , isAdmin ,testController)

router.get('/orders', requireSignIn, getOrdersController)

module.exports = router;