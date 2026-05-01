const prisma = require('../../config/prisma');
const ApiError = require('../../utils/ApiError');

const orderInclude = {
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

const findOrdersByUserId = async ({ userId, status, skip, take }) => {
  const where = {
    userId,
    ...(status ? { status } : {}),
  };

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

const findOrderByIdAndUserId = (orderId, userId) =>
  prisma.order.findFirst({
    where: {
      id: orderId,
      userId,
    },
    include: orderInclude,
  });

const placeOrderFromCart = ({ userId, shippingAddress }) =>
  prisma.$transaction(async (tx) => {
    const cart = await tx.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new ApiError(400, 'Cart is empty');
    }

    for (const item of cart.items) {
      if (!item.product.isActive) {
        throw new ApiError(400, `${item.product.name} is no longer available`);
      }

      if (item.product.stock < item.quantity) {
        throw new ApiError(400, `Only ${item.product.stock} units are available for ${item.product.name}`);
      }
    }

    const totalAmount = cart.items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0
    );

    const order = await tx.order.create({
      data: {
        userId,
        totalAmount: totalAmount.toFixed(2),
        shippingAddress,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.product.price,
          })),
        },
      },
      include: orderInclude,
    });

    for (const item of cart.items) {
      const updatedProduct = await tx.product.updateMany({
        where: {
          id: item.productId,
          isActive: true,
          stock: {
            gte: item.quantity,
          },
        },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });

      if (updatedProduct.count !== 1) {
        throw new ApiError(409, `Insufficient stock for ${item.product.name}`);
      }
    }

    await tx.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return order;
  });

module.exports = {
  findOrdersByUserId,
  findOrderByIdAndUserId,
  placeOrderFromCart,
};
