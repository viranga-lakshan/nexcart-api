const express = require('express');
const adminRoutes = require('../modules/admin/admin.routes');
const authRoutes = require('../modules/auth/auth.routes');
const cartRoutes = require('../modules/cart/cart.routes');
const categoryRoutes = require('../modules/categories/category.routes');
const orderRoutes = require('../modules/orders/order.routes');
const productRoutes = require('../modules/products/product.routes');
const userRoutes = require('../modules/users/user.routes');

const router = express.Router();

router.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'NexCart API is healthy',
    data: {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
    meta: {},
  });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/admin', adminRoutes);
router.use('/uploads', require('../modules/uploads/upload.routes'));

module.exports = router;
