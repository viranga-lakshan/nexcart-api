const { sendSuccess } = require('../../utils/apiResponse');
const productService = require('./product.service');

const listProducts = async (req, res) => {
  const result = await productService.listProducts(req.validated.query);

  return sendSuccess(res, {
    message: 'Products fetched successfully',
    data: result.products,
    meta: result.meta,
  });
};

const listMyProducts = async (req, res) => {
  const result = await productService.listProducts(
    {
      ...req.validated.query,
      sellerId: req.user.sub,
    },
    { includeInactive: true }
  );

  return sendSuccess(res, {
    message: 'Seller products fetched successfully',
    data: result.products,
    meta: result.meta,
  });
};

const getProductById = async (req, res) => {
  const product = await productService.getProductById(req.validated.params.productId);

  return sendSuccess(res, {
    message: 'Product fetched successfully',
    data: product,
  });
};

const createProduct = async (req, res) => {
  const product = await productService.createProduct(req.user, req.validated.body);

  return sendSuccess(res, {
    statusCode: 201,
    message: 'Product created successfully',
    data: product,
  });
};

const updateProduct = async (req, res) => {
  const product = await productService.updateProduct(
    req.user,
    req.validated.params.productId,
    req.validated.body
  );

  return sendSuccess(res, {
    message: 'Product updated successfully',
    data: product,
  });
};

const deleteProduct = async (req, res) => {
  await productService.deleteProduct(req.user, req.validated.params.productId);

  return sendSuccess(res, {
    message: 'Product deleted successfully',
    data: null,
  });
};

module.exports = {
  listProducts,
  listMyProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
