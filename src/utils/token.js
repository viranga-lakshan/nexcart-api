const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const signJwt = (payload, secret, expiresIn) => jwt.sign(payload, secret, { expiresIn });

const verifyJwt = (token, secret) => jwt.verify(token, secret);

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const createRandomToken = () => crypto.randomBytes(32).toString('hex');

module.exports = {
  signJwt,
  verifyJwt,
  hashToken,
  createRandomToken,
};
