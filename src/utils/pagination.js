const getPagination = ({ page = 1, limit = 10 }) => {
  const currentPage = Math.max(Number(page), 1);
  const perPage = Math.min(Math.max(Number(limit), 1), 100);
  const skip = (currentPage - 1) * perPage;

  return {
    page: currentPage,
    limit: perPage,
    skip,
  };
};

const buildPaginationMeta = ({ total, page, limit }) => ({
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit),
});

module.exports = {
  getPagination,
  buildPaginationMeta,
};
