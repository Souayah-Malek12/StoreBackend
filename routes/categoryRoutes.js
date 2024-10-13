const express = require("express");
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware");
const { createCategoryController, updateCategoryController, find, getAllCategoryController, getSingleCategoryController, deleteCategoryController } = require("../controllers/categoryController");

const router = express.Router()

router.post("/create-category", requireSignIn, isAdmin, createCategoryController)
router.put("/update-category/:id", updateCategoryController)
router.get("/find/:id",   find)
router.get("/findAll",  getAllCategoryController)
router.get("/findSingle/:slug", getSingleCategoryController)
router.delete("/delete/:id", requireSignIn, isAdmin, deleteCategoryController)

module.exports = router;