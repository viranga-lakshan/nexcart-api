const ApiError = require('../../utils/ApiError');
const { sendSuccess } = require('../../utils/apiResponse');
const { resolveMediaUrl } = require('../../utils/productMedia');

const uploadProductImage = async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'Image file is required');
  }

  const url = resolveMediaUrl(`/uploads/products/${req.file.filename}`);

  return sendSuccess(res, {
    statusCode: 201,
    message: 'Image uploaded successfully',
    data: { url },
  });
};

module.exports = {
  uploadProductImage,
};
