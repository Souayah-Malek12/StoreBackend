const express = require("express")
const {createUser, login} = require("../controllers/userControllers")

const router = express.Router();

router.post('/', createUser)
router.post('/authen',login )


module.exports = router