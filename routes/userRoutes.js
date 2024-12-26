const express = require("express")
const {registreController, loginController, testController, updateProfilController, getUsers} = require("../controllers/userControllers")
const {requireSignIn, isAdmin} = require("../middlewares/authMiddleware");
const {  getOrdersController, getAllOrdersController } = require("../controllers/orderController");
const Order = require("../models/orderModel");
const userModel = require("../models/userModel"); // Assuming the user model is defined in this file

const router = express.Router();

router.post('/registre' ,registreController)
router.post('/login',loginController )
router.put('/profil', requireSignIn, updateProfilController)

router.get("/user-auth", requireSignIn, (req, res) => {res.status(200).send({success : true})} ) 

router.get("/admin-auth", requireSignIn, isAdmin, (req, res)=> { res.status(200).send({success : true} ) })  

router.get("/test", requireSignIn , isAdmin ,testController)

router.get('/orders/:bName', requireSignIn, getOrdersController)



router.get('/AllOrders', requireSignIn,isAdmin, getAllOrdersController)

router.get('/users', requireSignIn, isAdmin, getUsers)

router.get('/all-users', requireSignIn, isAdmin, async (req, res) => {
  try {
    const users = await userModel.find({})
      .select('-password -answer') // Exclude sensitive fields
      .sort({ createdAt: -1 });
    res.json({
      success: true,
      users
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: 'Error while getting users',
    });
  }
});

router.get("/stats", requireSignIn, async (req, res) => {
  try {
    // Get user's monthly spending
    const spending = await Order.aggregate([
      {
        $match: {
          buyer: req.user._id,
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          total: { $sum: "$payment.transaction.amount" }
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
          total: 1
        }
      },
      { $sort: { month: 1 } }
    ]);

    // Get purchase categories distribution
    const categories = await Order.aggregate([
      {
        $match: {
          buyer: req.user._id,
        }
      },
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

    // Get recent orders
    const recentOrders = await Order.find({ buyer: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('createdAt payment.transaction.amount')
      .lean()
      .then(orders => orders.map(order => ({
        date: order.createdAt,
        amount: order.payment.transaction.amount
      })));

    res.json({
      success: true,
      stats: {
        spending,
        categories,
        recentOrders
      }
    });
  } catch (error) {
    console.error('Error getting user stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting user statistics',
      error: error.message
    });
  }
});

module.exports = router;