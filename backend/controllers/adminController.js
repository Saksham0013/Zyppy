const Product = require('../models/Product');
const Order = require('../models/Order');

exports.addProduct = async (req, res) => {
    if (!req.user.isAdmin) return res.status(403).json({ message: 'Unauthorized' });

    const product = await Product.create(req.body);
    res.json({ message: 'Product added', product });
};

exports.getAllOrders = async (req, res) => {
    if (!req.user.isAdmin) return res.status(403).json({ message: 'Unauthorized' });

    const orders = await Order.find().populate('items.productId').populate('userId');
    res.json(orders);
};

