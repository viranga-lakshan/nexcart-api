const { z } = require('zod');

const productIdParamsSchema = z.object({
  productId: z.string().uuid(),
});

const productImageSchema = z.string().refine(
  (value) => value.startsWith('/uploads/') || z.string().url().safeParse(value).success,
  'Invalid image URL'
);

const productBodySchema = z.object({
  name: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(140)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must use lowercase letters, numbers, and hyphens')
    .optional(),
  description: z.string().trim().min(10).max(2000),
  categoryId: z.string().uuid(),
  sellerId: z.string().uuid().optional(),
  price: z.coerce.number().positive(),
  stock: z.coerce.number().int().min(0),
  images: z.array(productImageSchema).max(10).optional().default([]),
  isActive: z.boolean().optional(),
});

const productQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  search: z.string().trim().min(1).max(100).optional(),
  categoryId: z.string().uuid().optional(),
  sellerId: z.string().uuid().optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  sortBy: z.enum(['name', 'price', 'createdAt']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

const listProductsSchema = z.object({
  query: productQuerySchema.refine(
    (query) => !query.minPrice || !query.maxPrice || query.minPrice <= query.maxPrice,
    {
      message: 'minPrice must be less than or equal to maxPrice',
    }
  ),
});

const createProductSchema = z.object({
  body: productBodySchema,
});

const updateProductSchema = z.object({
  params: productIdParamsSchema,
  body: productBodySchema.partial().refine((data) => Object.keys(data).length > 0, {
    message: 'At least one product field is required',
  }),
});

const productParamsSchema = z.object({
  params: productIdParamsSchema,
});

module.exports = {
  listProductsSchema,
  createProductSchema,
  updateProductSchema,
  productParamsSchema,
};
