const ApiError = require('../../utils/ApiError');
const { getPagination, buildPaginationMeta } = require('../../utils/pagination');
const adminRepository = require('./admin.repository');

const toMoney = (value) => Number(value).toFixed(2);

const normalizeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  phone: user.phone,
  stats: {
    orders: user._count.orders,
    products: user._count.products,
  },
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const { withProductMedia } = require('../../utils/productMedia');

const normalizeProduct = (product) =>
  withProductMedia({
    ...product,
    price: toMoney(product.price),
  });

const normalizeOrder = (order) => ({
  id: order.id,
  userId: order.userId,
  user: order.user,
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

const listUsers = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const where = {
    ...(query.role ? { role: query.role } : {}),
    ...(query.search
      ? {
          OR: [
            { name: { contains: query.search, mode: 'insensitive' } },
            { email: { contains: query.search, mode: 'insensitive' } },
          ],
        }
      : {}),
  };
  const { users, total } = await adminRepository.listUsers({ where, skip, take: limit });

  return {
    users: users.map(normalizeUser),
    meta: buildPaginationMeta({ total, page, limit }),
  };
};

const getUserById = async (userId) => {
  const user = await adminRepository.findUserById(userId);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return normalizeUser(user);
};

const updateUserRole = async (actorId, userId, role) => {
  if (actorId === userId && role !== 'ADMIN') {
    throw new ApiError(400, 'Admins cannot remove their own admin role');
  }

  await getUserById(userId);

  return normalizeUser(await adminRepository.updateUserRole(userId, role));
};

const listProducts = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const where = {
    ...(query.categoryId ? { categoryId: query.categoryId } : {}),
    ...(query.sellerId ? { sellerId: query.sellerId } : {}),
    ...(query.isActive !== undefined ? { isActive: query.isActive } : {}),
    ...(query.search
      ? {
          OR: [
            { name: { contains: query.search, mode: 'insensitive' } },
            { description: { contains: query.search, mode: 'insensitive' } },
          ],
        }
      : {}),
  };
  const { products, total } = await adminRepository.listProducts({ where, skip, take: limit });

  return {
    products: products.map(normalizeProduct),
    meta: buildPaginationMeta({ total, page, limit }),
  };
};

const getProductById = async (productId) => {
  const product = await adminRepository.findProductById(productId);

  if (!product) {
    throw new ApiError(404, 'Product not found');
  }

  return normalizeProduct(product);
};

const updateProductModeration = async (productId, data) => {
  await getProductById(productId);

  return normalizeProduct(
    await adminRepository.updateProduct(productId, {
      ...data,
      price: data.price !== undefined ? data.price.toString() : undefined,
    })
  );
};

const listOrders = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const where = {
    ...(query.status ? { status: query.status } : {}),
    ...(query.userId ? { userId: query.userId } : {}),
  };
  const { orders, total } = await adminRepository.listOrders({ where, skip, take: limit });

  return {
    orders: orders.map(normalizeOrder),
    meta: buildPaginationMeta({ total, page, limit }),
  };
};

const getOrderById = async (orderId) => {
  const order = await adminRepository.findOrderById(orderId);

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  return normalizeOrder(order);
};

const updateOrderStatus = async (orderId, status) => {
  await getOrderById(orderId);

  return normalizeOrder(await adminRepository.updateOrderStatus(orderId, status));
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
