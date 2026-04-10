const express = require('express');
const asyncHandler = require('../../utils/asyncHandler');
const validateRequest = require('../../middleware/validateRequest');
const { authenticate } = require('../../middleware/auth.middleware');
const userController = require('./user.controller');
const {
  updateProfileSchema,
  createAddressSchema,
  updateAddressSchema,
  addressParamsSchema,
} = require('./user.validation');

const router = express.Router();

router.use(authenticate);

router.get('/me', asyncHandler(userController.getProfile));
router.patch('/me', validateRequest(updateProfileSchema), asyncHandler(userController.updateProfile));

router.get('/me/addresses', asyncHandler(userController.getAddresses));
router.post(
  '/me/addresses',
  validateRequest(createAddressSchema),
  asyncHandler(userController.createAddress)
);
router.patch(
  '/me/addresses/:addressId',
  validateRequest(updateAddressSchema),
  asyncHandler(userController.updateAddress)
);
router.delete(
  '/me/addresses/:addressId',
  validateRequest(addressParamsSchema),
  asyncHandler(userController.deleteAddress)
);

module.exports = router;
