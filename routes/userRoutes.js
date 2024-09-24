const express = require("express")
const {createUser, loginUser, logoutUser, getAllUsers, getUser, updateProfil, deleteUser, getUserById, updatedUserById} = require("../controllers/userControllers")
const {authMiddleware, authorizeAdmin}= require("../middlewares/authMiddleware")

const router = express.Router();

router.post('/', authMiddleware, authorizeAdmin ,createUser)
router.get('/', authMiddleware, authorizeAdmin, getAllUsers)
router.delete('/:id', authMiddleware, authorizeAdmin, deleteUser)
router.get('/:id', authMiddleware, authorizeAdmin, getUserById)
router.get('/:id', authMiddleware, authorizeAdmin, getUserById)
router.patch('/:id', authMiddleware, authorizeAdmin, updatedUserById)

router.get('/profil', authMiddleware, getUser)
router.patch('/update', authMiddleware ,updateProfil)

router.post('/authen',loginUser )
router.post('/logout', logoutUser)


module.exports = router;