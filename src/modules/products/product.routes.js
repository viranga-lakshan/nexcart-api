const express = require('express');
const asyncHandler = require('../../utils/asyncHandler');
const validateRequest = require('../../middleware/validateRequest');
const { authenticate, authorizeRoles } = require('../../middleware/auth.middleware');
const productController = require('./product.controller');
const {
  listProductsSchema,
  createProductSchema,
  updateProductSchema,
  productParamsSchema,
} = require('./product.validation');

const router = express.Router();

router.get('/', validateRequest(listProductsSchema), asyncHandler(productController.listProducts));
router.get(
  '/me/listings',
  authenticate,
  authorizeRoles('SELLER', 'ADMIN'),
  validateRequest(listProductsSchema),
  asyncHandler(productController.listMyProducts)
);
router.get(
  '/:productId',
  validateRequest(productParamsSchema),
  asyncHandler(productController.getProductById)
);
router.post(
  '/',
  authenticate,
  authorizeRoles('SELLER', 'ADMIN'),
  validateRequest(createProductSchema),
  asyncHandler(productController.createProduct)
);
router.patch(
  '/:productId',
  authenticate,
  authorizeRoles('SELLER', 'ADMIN'),
  validateRequest(updateProductSchema),
  asyncHandler(productController.updateProduct)
);
router.delete(
  '/:productId',
  authenticate,
  authorizeRoles('SELLER', 'ADMIN'),
  validateRequest(productParamsSchema),
  asyncHandler(productController.deleteProduct)
);

module.exports = router;
