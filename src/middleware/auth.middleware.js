const ApiError = require('../utils/ApiError');
const env = require('../config/env');
const { verifyJwt } = require('../utils/token');

const authenticate = (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return next(new ApiError(401, 'Authentication required'));
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyJwt(token, env.JWT_ACCESS_SECRET);

  req.user = payload;
  return next();
};

const authorizeRoles =
  (...roles) =>
  (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, 'You do not have permission to access this resource'));
    }

    return next();
  };

module.exports = {
  authenticate,
  authorizeRoles,
};
