const { z } = require('zod');

const categoryIdParamsSchema = z.object({
  categoryId: z.string().uuid(),
});

const categoryImageSchema = z
  .string()
  .refine(
    (value) => value.startsWith('/uploads/') || z.string().url().safeParse(value).success,
    'Invalid category image URL'
  );

const categoryBodySchema = z.object({
  name: z.string().trim().min(2).max(80),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must use lowercase letters, numbers, and hyphens')
    .optional(),
  description: z.string().trim().max(500).nullable().optional(),
  imageUrl: categoryImageSchema.nullable().optional(),
});

const createCategorySchema = z.object({
  body: categoryBodySchema,
});

const updateCategorySchema = z.object({
  params: categoryIdParamsSchema,
  body: categoryBodySchema.partial().refine((data) => Object.keys(data).length > 0, {
    message: 'At least one category field is required',
  }),
});

const categoryParamsSchema = z.object({
  params: categoryIdParamsSchema,
});

module.exports = {
  createCategorySchema,
  updateCategorySchema,
  categoryParamsSchema,
};
