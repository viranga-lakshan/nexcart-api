const ApiError = require('../../utils/ApiError');
const { getPagination, buildPaginationMeta } = require('../../utils/pagination');
const createSlug = require('../../utils/slug');
const productRepository = require('./product.repository');

const { withProductMedia } = require('../../utils/productMedia');

const normalizeProduct = (product) =>
  withProductMedia({
    ...product,
    price: product.price.toString(),
  });

const buildProductWhere = (query, options = {}) => {
  const where = {};

  if (!options.includeInactive) {
    where.isActive = true;
  }

  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: 'insensitive' } },
      { description: { contains: query.search, mode: 'insensitive' } },
    ];
  }

  if (query.categoryId) {
    where.categoryId = query.categoryId;
  }

  if (query.sellerId) {
    where.sellerId = query.sellerId;
  }

  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    where.price = {};

    if (query.minPrice !== undefined) {
      where.price.gte = query.minPrice;
    }

    if (query.maxPrice !== undefined) {
      where.price.lte = query.maxPrice;
    }
  }

  return where;
};

const listProducts = async (query, options = {}) => {
  const { page, limit, skip } = getPagination(query);
  const where = buildProductWhere(query, options);
  const orderBy = { [query.sortBy]: query.sortOrder };
  const { products, total } = await productRepository.listProducts({
    where,
    orderBy,
    skip,
    take: limit,
  });

  return {
    products: products.map(normalizeProduct),
    meta: buildPaginationMeta({ total, page, limit }),
  };
};

const getProductById = async (productId, options = {}) => {
  const product = await productRepository.findProductById(productId);

  if (!product || (!options.includeInactive && !product.isActive)) {
    throw new ApiError(404, 'Product not found');
  }

  return normalizeProduct(product);
};

const ensureCategoryExists = async (categoryId) => {
  const category = await productRepository.findCategoryById(categoryId);

  if (!category) {
    throw new ApiError(404, 'Category not found');
  }
};

const resolveSellerId = async (actor, requestedSellerId) => {
  if (actor.role === 'SELLER') {
    return actor.sub;
  }

  const sellerId = requestedSellerId || actor.sub;
  const seller = await productRepository.findSellerById(sellerId);

  if (!seller || !['SELLER', 'ADMIN'].includes(seller.role)) {
    throw new ApiError(400, 'Product seller must be a SELLER or ADMIN account');
  }

  return sellerId;
};

const createProduct = async (actor, data) => {
  await ensureCategoryExists(data.categoryId);

  const sellerId = await resolveSellerId(actor, data.sellerId);
  const productData = { ...data };
  delete productData.sellerId;
  const { price } = productData;

  return normalizeProduct(
    await productRepository.createProduct({
      ...productData,
      sellerId,
      price: price.toString(),
      slug: productData.slug || createSlug(productData.name),
    })
  );
};

const assertCanManageProduct = (actor, product) => {
  if (actor.role === 'ADMIN') {
    return;
  }

  if (actor.role !== 'SELLER' || product.sellerId !== actor.sub) {
    throw new ApiError(403, 'You can only manage your own products');
  }
};

const updateProduct = async (actor, productId, data) => {
  const product = await getProductById(productId, { includeInactive: true });
  assertCanManageProduct(actor, product);

  if (data.categoryId) {
    await ensureCategoryExists(data.categoryId);
  }

  if (data.sellerId && actor.role !== 'ADMIN') {
    throw new ApiError(403, 'Only admins can reassign product ownership');
  }

  if (data.sellerId) {
    await resolveSellerId(actor, data.sellerId);
  }

  return normalizeProduct(
    await productRepository.updateProduct(productId, {
      ...data,
      price: data.price !== undefined ? data.price.toString() : undefined,
      slug: data.slug || (data.name ? createSlug(data.name) : undefined),
    })
  );
};

const deleteProduct = async (actor, productId) => {
  const product = await getProductById(productId, { includeInactive: true });
  assertCanManageProduct(actor, product);

  return normalizeProduct(await productRepository.updateProduct(productId, { isActive: false }));
};

module.exports = {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
