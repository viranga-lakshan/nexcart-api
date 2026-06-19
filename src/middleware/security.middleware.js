const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const env = require('../config/env');

const helmetMiddleware = helmet({
  // EC2 serves HTTP only; Vercel provides HTTPS in front. Forcing upgrade here
  // breaks direct http://IP:5000 access (e.g. Swagger UI assets → ERR_SSL_PROTOCOL_ERROR).
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      'upgrade-insecure-requests': null,
      'script-src': ["'self'", "'unsafe-inline'"],
    },
  },
  strictTransportSecurity: false,
  crossOriginOpenerPolicy: false,
});

const corsOptions = {
  origin(origin, callback) {
    if (!origin || env.CORS_ORIGINS.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests, please try again later',
    errors: [],
  },
});

module.exports = {
  helmet: helmetMiddleware,
  corsOptions,
  apiLimiter,
};
