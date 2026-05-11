const prisma = require('../../config/prisma');

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  phone: true,
  createdAt: true,
  updatedAt: true,
  _count: {
    select: {
      orders: true,
      products: true,
    },
  },
};

const productInclude = {
  category: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
  seller: {
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  },
};

const orderInclude = {
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  },
  items: {
    include: {
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          images: true,
        },
      },
    },
  },
};

const listUsers = async ({ where, skip, take }) => {
  const [users, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
      select: userSelect,
    }),
    prisma.user.count({ where }),
  ]);

  return { users, total };
};

const findUserById = (userId) =>
  prisma.user.findUnique({
    where: { id: userId },
    select: userSelect,
  });

const updateUserRole = (userId, role) =>
  prisma.user.update({
    where: { id: userId },
    data: { role },
    select: userSelect,
  });

const listProducts = async ({ where, skip, take }) => {
  const [products, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
      include: productInclude,
    }),
    prisma.product.count({ where }),
  ]);

  return { products, total };
};

const findProductById = (productId) =>
  prisma.product.findUnique({
    where: { id: productId },
    include: productInclude,
  });

const updateProduct = (productId, data) =>
  prisma.product.update({
    where: { id: productId },
    data,
    include: productInclude,
  });

const listOrders = async ({ where, skip, take }) => {
  const [orders, total] = await prisma.$transaction([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
      include: orderInclude,
    }),
    prisma.order.count({ where }),
  ]);

  return { orders, total };
};

const findOrderById = (orderId) =>
  prisma.order.findUnique({
    where: { id: orderId },
    include: orderInclude,
  });

const updateOrderStatus = (orderId, status) =>
  prisma.order.update({
    where: { id: orderId },
    data: { status },
    include: orderInclude,
  });

module.exports = {
  listUsers,
  findUserById,
  updateUserRole,
  listProducts,
  findProductById,
  updateProduct,
  listOrders,
  findOrderById,
  updateOrderStatus,
};
