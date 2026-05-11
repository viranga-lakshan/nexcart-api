const { sendSuccess } = require('../../utils/apiResponse');
const adminService = require('./admin.service');

const listUsers = async (req, res) => {
  const result = await adminService.listUsers(req.validated.query);

  return sendSuccess(res, {
    message: 'Users fetched successfully',
    data: result.users,
    meta: result.meta,
  });
};

const getUserById = async (req, res) => {
  const user = await adminService.getUserById(req.validated.params.userId);

  return sendSuccess(res, {
    message: 'User fetched successfully',
    data: user,
  });
};

const updateUserRole = async (req, res) => {
  const user = await adminService.updateUserRole(
    req.user.sub,
    req.validated.params.userId,
    req.validated.body.role
  );

  return sendSuccess(res, {
    message: 'User role updated successfully',
    data: user,
  });
};

const listProducts = async (req, res) => {
  const result = await adminService.listProducts(req.validated.query);

  return sendSuccess(res, {
    message: 'Products fetched successfully',
    data: result.products,
    meta: result.meta,
  });
};

const getProductById = async (req, res) => {
  const product = await adminService.getProductById(req.validated.params.productId);

  return sendSuccess(res, {
    message: 'Product fetched successfully',
    data: product,
  });
};

const updateProductModeration = async (req, res) => {
  const product = await adminService.updateProductModeration(
    req.validated.params.productId,
    req.validated.body
  );

  return sendSuccess(res, {
    message: 'Product updated successfully',
    data: product,
  });
};

const listOrders = async (req, res) => {
  const result = await adminService.listOrders(req.validated.query);

  return sendSuccess(res, {
    message: 'Orders fetched successfully',
    data: result.orders,
    meta: result.meta,
  });
};

const getOrderById = async (req, res) => {
  const order = await adminService.getOrderById(req.validated.params.orderId);

  return sendSuccess(res, {
    message: 'Order fetched successfully',
    data: order,
  });
};

const updateOrderStatus = async (req, res) => {
  const order = await adminService.updateOrderStatus(
    req.validated.params.orderId,
    req.validated.body.status
  );

  return sendSuccess(res, {
    message: 'Order status updated successfully',
    data: order,
  });
};

module.exports = {
  listUsers,
  getUserById,
  updateUserRole,
  listProducts,
  getProductById,
  updateProductModeration,
  listOrders,
  getOrderById,
  updateOrderStatus,
};
