const express = require('express');
const asyncHandler = require('../../utils/asyncHandler');
const validateRequest = require('../../middleware/validateRequest');
const { authenticate, authorizeRoles } = require('../../middleware/auth.middleware');
const categoryController = require('./category.controller');
const {
  createCategorySchema,
  updateCategorySchema,
  categoryParamsSchema,
} = require('./category.validation');

const router = express.Router();

router.get('/', asyncHandler(categoryController.getCategories));
router.get(
  '/:categoryId',
  validateRequest(categoryParamsSchema),
  asyncHandler(categoryController.getCategoryById)
);

router.use(authenticate, authorizeRoles('ADMIN'));

router.post('/', validateRequest(createCategorySchema), asyncHandler(categoryController.createCategory));
router.patch(
  '/:categoryId',
  validateRequest(updateCategorySchema),
  asyncHandler(categoryController.updateCategory)
);
router.delete(
  '/:categoryId',
  validateRequest(categoryParamsSchema),
  asyncHandler(categoryController.deleteCategory)
);

module.exports = router;
