const express = require('express');
const asyncHandler = require('../../utils/asyncHandler');
const validateRequest = require('../../middleware/validateRequest');
const { authenticate } = require('../../middleware/auth.middleware');
const authController = require('./auth.controller');
const {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require('./auth.validation');

const router = express.Router();

router.post('/register', validateRequest(registerSchema), asyncHandler(authController.register));
router.post('/login', validateRequest(loginSchema), asyncHandler(authController.login));
router.post(
  '/refresh-token',
  validateRequest(refreshTokenSchema),
  asyncHandler(authController.refreshToken)
);
router.post('/logout', asyncHandler(authController.logout));
router.post('/logout-all', authenticate, asyncHandler(authController.logoutAllDevices));
router.post(
  '/forgot-password',
  validateRequest(forgotPasswordSchema),
  asyncHandler(authController.forgotPassword)
);
router.post(
  '/reset-password',
  validateRequest(resetPasswordSchema),
  asyncHandler(authController.resetPassword)
);

module.exports = router;
