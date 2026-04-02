const bcrypt = require('bcrypt');
const crypto = require('crypto');
const ApiError = require('../../utils/ApiError');
const env = require('../../config/env');
const { signJwt, verifyJwt, hashToken, createRandomToken } = require('../../utils/token');
const authRepository = require('./auth.repository');

const parseDurationToMs = (duration) => {
  const match = /^(\d+)([smhd])$/.exec(duration);

  if (!match) {
    throw new Error(`Unsupported duration format: ${duration}`);
  }

  const value = Number(match[1]);
  const multipliers = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return value * multipliers[match[2]];
};

const sanitizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const buildAuthPayload = (user) => ({
  sub: user.id,
  email: user.email,
  role: user.role,
});

const createTokenPair = async (user) => {
  const payload = buildAuthPayload(user);
  const refreshTokenId = createRandomToken();
  const accessToken = signJwt(payload, env.JWT_ACCESS_SECRET, env.JWT_ACCESS_EXPIRES_IN);
  const refreshToken = signJwt(
    { ...payload, jti: refreshTokenId },
    env.JWT_REFRESH_SECRET,
    env.JWT_REFRESH_EXPIRES_IN
  );

  await authRepository.createRefreshToken({
    userId: user.id,
    tokenHash: hashToken(refreshToken),
    expiresAt: new Date(Date.now() + parseDurationToMs(env.JWT_REFRESH_EXPIRES_IN)),
  });

  return { accessToken, refreshToken };
};

const register = async ({ name, email, password, role }) => {
  const existingUser = await authRepository.findUserByEmail(email);

  if (existingUser) {
    throw new ApiError(409, 'Email is already registered');
  }

  const hashedPassword = await bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS);
  const user = await authRepository.createUser({
    name,
    email,
    password: hashedPassword,
    role,
  });

  const tokens = await createTokenPair(user);

  return {
    user,
    ...tokens,
  };
};

const login = async ({ email, password }) => {
  const user = await authRepository.findUserByEmail(email);

  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const tokens = await createTokenPair(user);

  return {
    user: sanitizeUser(user),
    ...tokens,
  };
};

const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new ApiError(401, 'Refresh token is required');
  }

  verifyJwt(refreshToken, env.JWT_REFRESH_SECRET);

  const storedToken = await authRepository.findRefreshToken(hashToken(refreshToken));

  if (!storedToken || storedToken.revokedAt || storedToken.expiresAt < new Date()) {
    throw new ApiError(401, 'Invalid refresh token');
  }

  await authRepository.revokeRefreshToken(hashToken(refreshToken));
  const tokens = await createTokenPair(storedToken.user);

  return {
    user: storedToken.user,
    ...tokens,
  };
};

const logout = async (refreshToken) => {
  if (refreshToken) {
    await authRepository.revokeRefreshToken(hashToken(refreshToken));
  }
};

const logoutAllDevices = async (userId) => {
  await authRepository.revokeAllUserRefreshTokens(userId);
};

const forgotPassword = async (email) => {
  const user = await authRepository.findUserByEmail(email);

  if (!user) {
    return null;
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenHash = hashToken(resetToken);
  const expiresAt = new Date(Date.now() + env.PASSWORD_RESET_TOKEN_EXPIRES_MINUTES * 60 * 1000);

  await authRepository.setPasswordResetToken(user.id, resetTokenHash, expiresAt);

  return resetToken;
};

const resetPassword = async ({ token, password }) => {
  const tokenHash = hashToken(token);
  const user = await authRepository.findUserByPasswordResetToken(tokenHash);

  if (!user) {
    throw new ApiError(400, 'Invalid or expired password reset token');
  }

  const hashedPassword = await bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS);
  const updatedUser = await authRepository.updateUserPassword(user.id, hashedPassword);
  await authRepository.revokeAllUserRefreshTokens(user.id);

  return updatedUser;
};

module.exports = {
  register,
  login,
  refreshAccessToken,
  logout,
  logoutAllDevices,
  forgotPassword,
  resetPassword,
};
