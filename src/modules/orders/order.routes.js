const express = require('express');
const asyncHandler = require('../../utils/asyncHandler');
const validateRequest = require('../../middleware/validateRequest');
const { authenticate, authorizeRoles } = require('../../middleware/auth.middleware');
const orderController = require('./order.controller');
const { placeOrderSchema, listOrdersSchema, orderParamsSchema } = require('./order.validation');

const router = express.Router();

router.use(authenticate, authorizeRoles('USER'));

router.get('/', validateRequest(listOrdersSchema), asyncHandler(orderController.listOrders));
router.post('/', validateRequest(placeOrderSchema), asyncHandler(orderController.placeOrder));
router.get(
  '/:orderId',
  validateRequest(orderParamsSchema),
  asyncHandler(orderController.getOrderById)
);

module.exports = router;
