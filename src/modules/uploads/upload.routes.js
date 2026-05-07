const express = require('express');
const asyncHandler = require('../../utils/asyncHandler');
const { authenticate, authorizeRoles } = require('../../middleware/auth.middleware');
const uploadController = require('./upload.controller');
const { handleProductImageUpload } = require('./upload.middleware');

const router = express.Router();

router.post(
  '/product-image',
  authenticate,
  authorizeRoles('SELLER', 'ADMIN'),
  handleProductImageUpload,
  asyncHandler(uploadController.uploadProductImage)
);

module.exports = router;
