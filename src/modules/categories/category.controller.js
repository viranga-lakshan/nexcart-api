const { sendSuccess } = require('../../utils/apiResponse');
const categoryService = require('./category.service');

const getCategories = async (_req, res) => {
  const categories = await categoryService.getCategories();

  return sendSuccess(res, {
    message: 'Categories fetched successfully',
    data: categories,
    meta: {
      count: categories.length,
    },
  });
};

const getCategoryById = async (req, res) => {
  const category = await categoryService.getCategoryById(req.validated.params.categoryId);

  return sendSuccess(res, {
    message: 'Category fetched successfully',
    data: category,
  });
};

const createCategory = async (req, res) => {
  const category = await categoryService.createCategory(req.validated.body);

  return sendSuccess(res, {
    statusCode: 201,
    message: 'Category created successfully',
    data: category,
  });
};

const updateCategory = async (req, res) => {
  const category = await categoryService.updateCategory(
    req.validated.params.categoryId,
    req.validated.body
  );

  return sendSuccess(res, {
    message: 'Category updated successfully',
    data: category,
  });
};

const deleteCategory = async (req, res) => {
  await categoryService.deleteCategory(req.validated.params.categoryId);

  return sendSuccess(res, {
    message: 'Category deleted successfully',
    data: null,
  });
};

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
