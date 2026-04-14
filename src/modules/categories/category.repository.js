const prisma = require('../../config/prisma');

const categorySelect = {
  id: true,
  name: true,
  slug: true,
  description: true,
  imageUrl: true,
  createdAt: true,
  updatedAt: true,
  _count: {
    select: {
      products: true,
    },
  },
};

const findCategories = () =>
  prisma.category.findMany({
    orderBy: { name: 'asc' },
    select: categorySelect,
  });

const findCategoryById = (categoryId) =>
  prisma.category.findUnique({
    where: { id: categoryId },
    select: categorySelect,
  });

const createCategory = (data) =>
  prisma.category.create({
    data,
    select: categorySelect,
  });

const updateCategory = (categoryId, data) =>
  prisma.category.update({
    where: { id: categoryId },
    data,
    select: categorySelect,
  });

const deleteCategory = (categoryId) =>
  prisma.category.delete({
    where: { id: categoryId },
    select: categorySelect,
  });

module.exports = {
  findCategories,
  findCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
