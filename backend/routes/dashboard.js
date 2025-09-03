const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const Order = require('../models/Order');  
const User = require('../models/User');
const Product = require('../models/Product');

const router = express.Router();

router.get('/user/dashboard', protect, (req, res) => {
  res.json({
    message: 'Welcome to User Dashboard',
    user: req.user,
  });
});

router.get('/admin/dashboard', protect, admin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    const revenueData = await Order.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$amount" } } }
    ]);

    res.json({
      message: 'Welcome to Admin Dashboard',
      user: req.user,
      stats: {
        users: totalUsers,
        products: totalProducts,
        orders: totalOrders,
        revenue: revenueData[0]?.totalRevenue || 0
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching admin dashboard stats' });
  }
});

module.exports = router;
