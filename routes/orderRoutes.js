const express = require('express');
const { getOrdersController, getAllOrdersController, treatOrderController } = require('../controllers/orderController');
const { requireSignIn, isAdmin: adminMiddleware } = require('../middlewares/authMiddleware');

const router = express.Router();

// Get user's orders
router.get('/user-orders/:bName', requireSignIn, getOrdersController);

// Get all orders (admin only)
router.get('/all-orders', requireSignIn, adminMiddleware, getAllOrdersController);

// Create order
router.post('/create', requireSignIn, treatOrderController);

module.exports = router;
