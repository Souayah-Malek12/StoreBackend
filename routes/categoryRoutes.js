const express = require("express");
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware");
const { createCategoryController, updateCategoryController, find, getAllCategoryController } = require("../controllers/categoryController");

const router = express.Router()

router.post("/create-category", requireSignIn, isAdmin, createCategoryController)
router.put("/update-category/:id", requireSignIn, isAdmin, updateCategoryController)
router.get("/find/:id", requireSignIn, isAdmin, find)
router.get("/findAll", requireSignIn, isAdmin, getAllCategoryController)


module.exports = router;