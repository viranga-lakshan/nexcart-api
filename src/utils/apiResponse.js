const sendSuccess = (res, { statusCode = 200, message = 'Success', data = null, meta = {} }) =>
  res.status(statusCode).json({
    success: true,
    message,
    data,
    meta,
  });

module.exports = {
  sendSuccess,
};
