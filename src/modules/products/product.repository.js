const prisma = require('../../config/prisma');

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

const listProducts = async ({ where, orderBy, skip, take }) => {
  const [products, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      orderBy,
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

const createProduct = (data) =>
  prisma.product.create({
    data,
    include: productInclude,
  });

const updateProduct = (productId, data) =>
  prisma.product.update({
    where: { id: productId },
    data,
    include: productInclude,
  });

const findCategoryById = (categoryId) =>
  prisma.category.findUnique({
    where: { id: categoryId },
    select: { id: true },
  });

const findSellerById = (sellerId) =>
  prisma.user.findUnique({
    where: { id: sellerId },
    select: {
      id: true,
      role: true,
    },
  });

module.exports = {
  listProducts,
  findProductById,
  createProduct,
  updateProduct,
  findCategoryById,
  findSellerById,
};
