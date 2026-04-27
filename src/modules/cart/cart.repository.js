const prisma = require('../../config/prisma');

const cartInclude = {
  items: {
    orderBy: { createdAt: 'asc' },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          stock: true,
          images: true,
          isActive: true,
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      },
    },
  },
};

const findCartByUserId = (userId) =>
  prisma.cart.findUnique({
    where: { userId },
    include: cartInclude,
  });

const createCart = (userId) =>
  prisma.cart.create({
    data: { userId },
    include: cartInclude,
  });

const findProductForCart = (productId) =>
  prisma.product.findUnique({
    where: { id: productId },
    select: {
      id: true,
      name: true,
      stock: true,
      isActive: true,
    },
  });

const findCartItem = (cartId, productId) =>
  prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId,
        productId,
      },
    },
  });

const createCartItem = (cartId, productId, quantity) =>
  prisma.cartItem.create({
    data: {
      cartId,
      productId,
      quantity,
    },
  });

const updateCartItemQuantity = (cartItemId, quantity) =>
  prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity },
  });

const deleteCartItem = (cartItemId) =>
  prisma.cartItem.delete({
    where: { id: cartItemId },
  });

const clearCartItems = (cartId) =>
  prisma.cartItem.deleteMany({
    where: { cartId },
  });

module.exports = {
  findCartByUserId,
  createCart,
  findProductForCart,
  findCartItem,
  createCartItem,
  updateCartItemQuantity,
  deleteCartItem,
  clearCartItems,
};
