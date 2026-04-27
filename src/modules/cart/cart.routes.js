const express = require('express');
const asyncHandler = require('../../utils/asyncHandler');
const validateRequest = require('../../middleware/validateRequest');
const { authenticate, authorizeRoles } = require('../../middleware/auth.middleware');
const cartController = require('./cart.controller');
const {
  addCartItemSchema,
  updateCartItemSchema,
  cartItemParamsSchema,
} = require('./cart.validation');

const router = express.Router();

router.use(authenticate, authorizeRoles('USER'));

router.get('/', asyncHandler(cartController.getCart));
router.delete('/', asyncHandler(cartController.clearCart));
router.post('/items', validateRequest(addCartItemSchema), asyncHandler(cartController.addItem));
router.patch(
  '/items/:productId',
  validateRequest(updateCartItemSchema),
  asyncHandler(cartController.updateItem)
);
router.delete(
  '/items/:productId',
  validateRequest(cartItemParamsSchema),
  asyncHandler(cartController.removeItem)
);

module.exports = router;
