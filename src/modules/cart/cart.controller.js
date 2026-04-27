const { sendSuccess } = require('../../utils/apiResponse');
const cartService = require('./cart.service');

const getCart = async (req, res) => {
  const cart = await cartService.getCart(req.user.sub);

  return sendSuccess(res, {
    message: 'Cart fetched successfully',
    data: cart,
  });
};

const addItem = async (req, res) => {
  const cart = await cartService.addItem(req.user.sub, req.validated.body);

  return sendSuccess(res, {
    statusCode: 201,
    message: 'Item added to cart successfully',
    data: cart,
  });
};

const updateItem = async (req, res) => {
  const cart = await cartService.updateItem(
    req.user.sub,
    req.validated.params.productId,
    req.validated.body.quantity
  );

  return sendSuccess(res, {
    message: 'Cart item updated successfully',
    data: cart,
  });
};

const removeItem = async (req, res) => {
  const cart = await cartService.removeItem(req.user.sub, req.validated.params.productId);

  return sendSuccess(res, {
    message: 'Cart item removed successfully',
    data: cart,
  });
};

const clearCart = async (req, res) => {
  const cart = await cartService.clearCart(req.user.sub);

  return sendSuccess(res, {
    message: 'Cart cleared successfully',
    data: cart,
  });
};

module.exports = {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
};
