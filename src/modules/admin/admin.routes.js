const express = require('express');
const asyncHandler = require('../../utils/asyncHandler');
const validateRequest = require('../../middleware/validateRequest');
const { authenticate, authorizeRoles } = require('../../middleware/auth.middleware');
const adminController = require('./admin.controller');
const {
  listUsersSchema,
  userParamsSchema,
  updateUserRoleSchema,
  listAdminProductsSchema,
  productParamsSchema,
  updateProductModerationSchema,
  listAdminOrdersSchema,
  orderParamsSchema,
  updateOrderStatusSchema,
} = require('./admin.validation');

const router = express.Router();

router.use(authenticate, authorizeRoles('ADMIN'));

router.get('/users', validateRequest(listUsersSchema), asyncHandler(adminController.listUsers));
router.get('/users/:userId', validateRequest(userParamsSchema), asyncHandler(adminController.getUserById));
router.patch(
  '/users/:userId/role',
  validateRequest(updateUserRoleSchema),
  asyncHandler(adminController.updateUserRole)
);

router.get(
  '/products',
  validateRequest(listAdminProductsSchema),
  asyncHandler(adminController.listProducts)
);
router.get(
  '/products/:productId',
  validateRequest(productParamsSchema),
  asyncHandler(adminController.getProductById)
);
router.patch(
  '/products/:productId',
  validateRequest(updateProductModerationSchema),
  asyncHandler(adminController.updateProductModeration)
);

router.get('/orders', validateRequest(listAdminOrdersSchema), asyncHandler(adminController.listOrders));
router.get(
  '/orders/:orderId',
  validateRequest(orderParamsSchema),
  asyncHandler(adminController.getOrderById)
);
router.patch(
  '/orders/:orderId/status',
  validateRequest(updateOrderStatusSchema),
  asyncHandler(adminController.updateOrderStatus)
);

module.exports = router;
