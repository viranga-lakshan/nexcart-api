const ApiError = require('../../utils/ApiError');
const { withProductMedia } = require('../../utils/productMedia');
const cartRepository = require('./cart.repository');

const toMoney = (value) => Number(value).toFixed(2);

const normalizeCart = (cart) => {
  const items = cart.items.map((item) => {
    const unitPrice = Number(item.product.price);
    const lineTotal = unitPrice * item.quantity;

    return {
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: toMoney(unitPrice),
      lineTotal: toMoney(lineTotal),
      product: withProductMedia({
        id: item.product.id,
        name: item.product.name,
        slug: item.product.slug,
        images: item.product.images,
        stock: item.product.stock,
        isActive: item.product.isActive,
        category: item.product.category,
      }),
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    };
  });

  const subtotal = items.reduce((sum, item) => sum + Number(item.lineTotal), 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    id: cart.id,
    userId: cart.userId,
    items,
    summary: {
      itemCount,
      uniqueItems: items.length,
      subtotal: toMoney(subtotal),
    },
    createdAt: cart.createdAt,
    updatedAt: cart.updatedAt,
  };
};

const getOrCreateCart = async (userId) => {
  const existingCart = await cartRepository.findCartByUserId(userId);

  if (existingCart) {
    return existingCart;
  }

  return cartRepository.createCart(userId);
};

const getCart = async (userId) => normalizeCart(await getOrCreateCart(userId));

const ensureProductCanBeAdded = async (productId, quantity) => {
  const product = await cartRepository.findProductForCart(productId);

  if (!product || !product.isActive) {
    throw new ApiError(404, 'Product not found');
  }

  if (product.stock < quantity) {
    throw new ApiError(400, `Only ${product.stock} units are available for ${product.name}`);
  }

  return product;
};

const addItem = async (userId, { productId, quantity }) => {
  const cart = await getOrCreateCart(userId);
  const existingItem = await cartRepository.findCartItem(cart.id, productId);
  const nextQuantity = (existingItem?.quantity || 0) + quantity;

  await ensureProductCanBeAdded(productId, nextQuantity);

  if (existingItem) {
    await cartRepository.updateCartItemQuantity(existingItem.id, nextQuantity);
  } else {
    await cartRepository.createCartItem(cart.id, productId, quantity);
  }

  return getCart(userId);
};

const updateItem = async (userId, productId, quantity) => {
  const cart = await getOrCreateCart(userId);
  const existingItem = await cartRepository.findCartItem(cart.id, productId);

  if (!existingItem) {
    throw new ApiError(404, 'Cart item not found');
  }

  await ensureProductCanBeAdded(productId, quantity);
  await cartRepository.updateCartItemQuantity(existingItem.id, quantity);

  return getCart(userId);
};

const removeItem = async (userId, productId) => {
  const cart = await getOrCreateCart(userId);
  const existingItem = await cartRepository.findCartItem(cart.id, productId);

  if (!existingItem) {
    throw new ApiError(404, 'Cart item not found');
  }

  await cartRepository.deleteCartItem(existingItem.id);

  return getCart(userId);
};

const clearCart = async (userId) => {
  const cart = await getOrCreateCart(userId);
  await cartRepository.clearCartItems(cart.id);

  return getCart(userId);
};

module.exports = {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
};
