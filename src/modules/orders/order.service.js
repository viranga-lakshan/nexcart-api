const ApiError = require('../../utils/ApiError');
const { getPagination, buildPaginationMeta } = require('../../utils/pagination');
const orderRepository = require('./order.repository');

const toMoney = (value) => Number(value).toFixed(2);

const normalizeOrder = (order) => ({
  id: order.id,
  userId: order.userId,
  status: order.status,
  totalAmount: toMoney(order.totalAmount),
  shippingAddress: order.shippingAddress,
  items: order.items.map((item) => ({
    id: item.id,
    productId: item.productId,
    quantity: item.quantity,
    unitPrice: toMoney(item.unitPrice),
    lineTotal: toMoney(Number(item.unitPrice) * item.quantity),
    product: item.product,
    createdAt: item.createdAt,
  })),
  createdAt: order.createdAt,
  updatedAt: order.updatedAt,
});

const listOrders = async (userId, query) => {
  const { page, limit, skip } = getPagination(query);
  const { orders, total } = await orderRepository.findOrdersByUserId({
    userId,
    status: query.status,
    skip,
    take: limit,
  });

  return {
    orders: orders.map(normalizeOrder),
    meta: buildPaginationMeta({ total, page, limit }),
  };
};

const getOrderById = async (userId, orderId) => {
  const order = await orderRepository.findOrderByIdAndUserId(orderId, userId);

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  return normalizeOrder(order);
};

const placeOrder = async (userId, { shippingAddress }) =>
  normalizeOrder(await orderRepository.placeOrderFromCart({ userId, shippingAddress }));

module.exports = {
  listOrders,
  getOrderById,
  placeOrder,
};
