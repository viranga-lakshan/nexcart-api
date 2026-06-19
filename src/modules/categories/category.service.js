const ApiError = require('../../utils/ApiError');
const createSlug = require('../../utils/slug');
const { resolveMediaUrl } = require('../../utils/productMedia');
const categoryRepository = require('./category.repository');

const normalizeCategory = (category) => ({
  ...category,
  imageUrl: category.imageUrl ? resolveMediaUrl(category.imageUrl) : category.imageUrl,
  productCount: category._count.products,
  _count: undefined,
});

const getCategories = async () => {
  const categories = await categoryRepository.findCategories();

  return categories.map(normalizeCategory);
};

const getCategoryById = async (categoryId) => {
  const category = await categoryRepository.findCategoryById(categoryId);

  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  return normalizeCategory(category);
};

const createCategory = async (data) =>
  normalizeCategory(
    await categoryRepository.createCategory({
      ...data,
      slug: data.slug || createSlug(data.name),
    })
  );

const updateCategory = async (categoryId, data) => {
  await getCategoryById(categoryId);

  return normalizeCategory(
    await categoryRepository.updateCategory(categoryId, {
      ...data,
      slug: data.slug || (data.name ? createSlug(data.name) : undefined),
    })
  );
};

const deleteCategory = async (categoryId) => {
  const category = await categoryRepository.findCategoryById(categoryId);

  if (!category) {
    throw new ApiError(404, 'Category not found');
  }

  if (category._count.products > 0) {
    throw new ApiError(409, 'Category cannot be deleted while products are assigned to it');
  }

  return normalizeCategory(await categoryRepository.deleteCategory(categoryId));
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
