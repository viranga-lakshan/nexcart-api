const { sendSuccess } = require('../../utils/apiResponse');
const orderService = require('./order.service');

const listOrders = async (req, res) => {
  const result = await orderService.listOrders(req.user.sub, req.validated.query);

  return sendSuccess(res, {
    message: 'Orders fetched successfully',
    data: result.orders,
    meta: result.meta,
  });
};

const getOrderById = async (req, res) => {
  const order = await orderService.getOrderById(req.user.sub, req.validated.params.orderId);

  return sendSuccess(res, {
    message: 'Order fetched successfully',
    data: order,
  });
};

const placeOrder = async (req, res) => {
  const order = await orderService.placeOrder(req.user.sub, req.validated.body);

  return sendSuccess(res, {
    statusCode: 201,
    message: 'Order placed successfully',
    data: order,
  });
};

module.exports = {
  listOrders,
  getOrderById,
  placeOrder,
};
