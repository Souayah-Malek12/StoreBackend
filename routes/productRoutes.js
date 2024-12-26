const express = require("express");
const { requireSignIn, isAdmin } = require("../middlewares/authMiddleware");
const { createProductController, getAllProductsController, getSingleProductApi, deleteProductController, updateProductController, filterProductController, productCountController, productListController, searchProductController, relatedSearchController, 
    getProductByCategory, braintreeTokenController, braintreePaymentController, payOnDelivery, passagerCommand } = require("../controllers/productController");
const { treatOrderController } = require("../controllers/orderController");
const Order = require("../models/orderModel");

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

router.put('/treatOrder', requireSignIn, isAdmin, async (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status: 'Delivered' },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Error while updating order status',
      error: error.message
    });
  }
});

router.get("/orders/stats", requireSignIn, isAdmin, async (req, res) => {
  try {
    // Get monthly order counts
    const monthly = await Order.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          month: {
            $concat: [
              { $toString: "$_id.year" },
              "-",
              {
                $cond: {
                  if: { $lt: ["$_id.month", 10] },
                  then: { $concat: ["0", { $toString: "$_id.month" }] },
                  else: { $toString: "$_id.month" }
                }
              }
            ]
          },
          count: 1
        }
      },
      { $sort: { month: 1 } }
    ]);

    // Get order status distribution
    const status = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]).then(results => 
      results.reduce((acc, curr) => ({
        ...acc,
        [curr._id]: curr.count
      }), {})
    );

    // Get sales by category
    const categories = await Order.aggregate([
      { $unwind: "$products" },
      {
        $lookup: {
          from: "products",
          localField: "products.product",
          foreignField: "_id",
          as: "productDetails"
        }
      },
      { $unwind: "$productDetails" },
      {
        $group: {
          _id: "$productDetails.category",
          total: { $sum: "$products.quantity" }
        }
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "categoryDetails"
        }
      },
      { $unwind: "$categoryDetails" }
    ]).then(results =>
      results.reduce((acc, curr) => ({
        ...acc,
        [curr.categoryDetails.name]: curr.total
      }), {})
    );

    res.json({
      success: true,
      stats: {
        monthly,
        status,
        categories
      }
    });
  } catch (error) {
    console.error('Error getting order stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting order statistics',
      error: error.message
    });
  }
});

// Get all orders
router.get('/all-orders', requireSignIn, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('products')
      .populate('buyer', 'name email phone address')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: 'Error while getting orders',
      error: error.message
    });
  }
});

module.exports = router;