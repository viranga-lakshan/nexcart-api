const prisma = require('../../config/prisma');

const safeUserSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  phone: true,
  createdAt: true,
  updatedAt: true,
};

const createUser = (data) => prisma.user.create({ data, select: safeUserSelect });

const findUserByEmail = (email) => prisma.user.findUnique({ where: { email } });

const updateUserPassword = (userId, password) =>
  prisma.user.update({
    where: { id: userId },
    data: {
      password,
      passwordResetToken: null,
      passwordResetExpiry: null,
    },
    select: safeUserSelect,
  });

const setPasswordResetToken = (userId, tokenHash, expiresAt) =>
  prisma.user.update({
    where: { id: userId },
    data: {
      passwordResetToken: tokenHash,
      passwordResetExpiry: expiresAt,
    },
    select: safeUserSelect,
  });

const findUserByPasswordResetToken = (tokenHash) =>
  prisma.user.findFirst({
    where: {
      passwordResetToken: tokenHash,
      passwordResetExpiry: {
        gt: new Date(),
      },
    },
  });

const createRefreshToken = (data) => prisma.refreshToken.create({ data });

const findRefreshToken = (tokenHash) =>
  prisma.refreshToken.findUnique({
    where: { tokenHash },
    include: {
      user: {
        select: safeUserSelect,
      },
    },
  });

const revokeRefreshToken = (tokenHash) =>
  prisma.refreshToken.updateMany({
    where: {
      tokenHash,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });

const revokeAllUserRefreshTokens = (userId) =>
  prisma.refreshToken.updateMany({
    where: {
      userId,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });

module.exports = {
  createUser,
  findUserByEmail,
  updateUserPassword,
  setPasswordResetToken,
  findUserByPasswordResetToken,
  createRefreshToken,
  findRefreshToken,
  revokeRefreshToken,
  revokeAllUserRefreshTokens,
};
