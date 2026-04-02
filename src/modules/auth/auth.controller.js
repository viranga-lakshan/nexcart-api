const env = require('../../config/env');
const ApiError = require('../../utils/ApiError');
const { sendSuccess } = require('../../utils/apiResponse');
const authService = require('./auth.service');

const refreshCookieOptions = {
  httpOnly: true,
  secure: env.IS_PRODUCTION,
  sameSite: env.IS_PRODUCTION ? 'none' : 'lax',
  path: '/api/v1/auth',
};

const setRefreshTokenCookie = (res, refreshToken) => {
  res.cookie(env.REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
    ...refreshCookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const clearRefreshTokenCookie = (res) => {
  res.clearCookie(env.REFRESH_TOKEN_COOKIE_NAME, refreshCookieOptions);
};

const register = async (req, res) => {
  const result = await authService.register(req.validated.body);
  setRefreshTokenCookie(res, result.refreshToken);

  return sendSuccess(res, {
    statusCode: 201,
    message: 'Registration successful',
    data: {
      user: result.user,
      accessToken: result.accessToken,
    },
  });
};

const login = async (req, res) => {
  const result = await authService.login(req.validated.body);
  setRefreshTokenCookie(res, result.refreshToken);

  return sendSuccess(res, {
    message: 'Login successful',
    data: {
      user: result.user,
      accessToken: result.accessToken,
    },
  });
};

const refreshToken = async (req, res) => {
  const tokenFromCookie = req.cookies?.[env.REFRESH_TOKEN_COOKIE_NAME];
  const tokenFromBody = req.validated.body?.refreshToken;
  const result = await authService.refreshAccessToken(tokenFromCookie || tokenFromBody);
  setRefreshTokenCookie(res, result.refreshToken);

  return sendSuccess(res, {
    message: 'Access token refreshed successfully',
    data: {
      user: result.user,
      accessToken: result.accessToken,
    },
  });
};

const logout = async (req, res) => {
  const tokenFromCookie = req.cookies?.[env.REFRESH_TOKEN_COOKIE_NAME];
  const tokenFromBody = req.body?.refreshToken;

  await authService.logout(tokenFromCookie || tokenFromBody);
  clearRefreshTokenCookie(res);

  return sendSuccess(res, {
    message: 'Logout successful',
    data: null,
  });
};

const logoutAllDevices = async (req, res) => {
  if (!req.user?.sub) {
    throw new ApiError(401, 'Authentication required');
  }

  await authService.logoutAllDevices(req.user.sub);
  clearRefreshTokenCookie(res);

  return sendSuccess(res, {
    message: 'Logged out from all devices successfully',
    data: null,
  });
};

const forgotPassword = async (req, res) => {
  const resetToken = await authService.forgotPassword(req.validated.body.email);

  return sendSuccess(res, {
    message: 'If the account exists, a password reset token has been generated',
    data: env.IS_PRODUCTION ? null : { resetToken },
  });
};

const resetPassword = async (req, res) => {
  await authService.resetPassword(req.validated.body);

  return sendSuccess(res, {
    message: 'Password reset successful',
    data: null,
  });
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  logoutAllDevices,
  forgotPassword,
  resetPassword,
};
