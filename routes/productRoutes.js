const express = require("express");
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware");
const { createProductController, getAllProductsController, getSingleProductApi, deleteProductController, updateProductController, filterProductController, productCountController, productListController, searchProductController, relatedSearchController, 
    getProductByCategory, braintreeTokenController, braintreePaymentController, payOnDelivery, passagerCommand } = require("../controllers/productController");
const { treatOrderController } = require("../controllers/orderController");

const router = express.Router();

router.post("/create-product", requireSignIn, isAdmin, createProductController)
router.get("/getProducts", getAllProductsController)
router.post("/filterProducts", filterProductController)
router.get("/productCount", productCountController)
router.get("/productList/:page", productListController)
router.get("/search/:keyword", searchProductController)
router.get("/relatedProducts/:pid/:cid", relatedSearchController)
router.get("/categoryProduct/:slug", getProductByCategory)

// payment route token 
router.get('/braintree/token', braintreeTokenController)

//payments 
router.post('/braintree/payment', requireSignIn, braintreePaymentController)

router.post('/passagerCommand', passagerCommand)

router.get("/getOneproduct/:slug",  getSingleProductApi)
router.delete('/delete/:id', requireSignIn, isAdmin, deleteProductController )
router.put('/updateProduct/:id' , requireSignIn, isAdmin, updateProductController)

router.put('/treatOrder', requireSignIn,  treatOrderController)


module.exports = router;