const express = require("express");
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware");
const { createProductController, getAllProductsController, getSingleProductApi, deleteProductController, updateProductController } = require("../controllers/productController");

const router = express.Router();

router.post("/create-product", requireSignIn, isAdmin, createProductController)
router.get("/getProducts", requireSignIn, getAllProductsController)
router.get("/getOneproduct/:slug", requireSignIn, getSingleProductApi)
router.delete('/delete/:id', requireSignIn, isAdmin, deleteProductController )
router.put('/updateProduct/:id' , requireSignIn, isAdmin, updateProductController)

module.exports = router;