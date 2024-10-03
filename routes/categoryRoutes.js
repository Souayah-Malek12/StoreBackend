const express = require("express");
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware");
const { createCategoryController, updateCategoryController, find, getAllCategoryController, getSingleCategoryController, deleteCategoryController } = require("../controllers/categoryController");

const router = express.Router()

router.post("/create-category", requireSignIn, isAdmin, createCategoryController)
router.put("/update-category/:id", requireSignIn, isAdmin, updateCategoryController)
router.get("/find/:id", requireSignIn, isAdmin, find)
router.get("/findAll", requireSignIn, isAdmin, getAllCategoryController)
router.get("/findSingle/:slug", requireSignIn, isAdmin, getSingleCategoryController)
router.delete("/delete/:id", requireSignIn, isAdmin, deleteCategoryController)

module.exports = router;