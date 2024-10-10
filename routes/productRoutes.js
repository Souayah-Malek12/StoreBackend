const express = require("express");
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware");
const { createProductController, getAllProductsController, getSingleProductApi, deleteProductController, updateProductController, filterProductController, productCountController, productListController } = require("../controllers/productController");

const router = express.Router();

router.post("/create-product", requireSignIn, isAdmin, createProductController)
router.get("/getProducts", getAllProductsController)
router.post("/filterProducts", filterProductController)
router.get("/productCount", productCountController)
router.get("/productList/:page", productListController)

router.get("/getOneproduct/:slug",  getSingleProductApi)
router.delete('/delete/:id', requireSignIn, isAdmin, deleteProductController )
router.put('/updateProduct/:id' , requireSignIn, isAdmin, updateProductController)

module.exports = router;