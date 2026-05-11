const { z } = require('zod');

const roleSchema = z.enum(['USER', 'ADMIN', 'SELLER']);
const orderStatusSchema = z.enum(['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']);

const paginationQuerySchema = {
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
};

const listUsersSchema = z.object({
  query: z.object({
    ...paginationQuerySchema,
    role: roleSchema.optional(),
    search: z.string().trim().min(1).max(100).optional(),
  }),
});

const userParamsSchema = z.object({
  params: z.object({
    userId: z.string().uuid(),
  }),
});

const updateUserRoleSchema = z.object({
  params: z.object({
    userId: z.string().uuid(),
  }),
  body: z.object({
    role: roleSchema,
  }),
});

const listAdminProductsSchema = z.object({
  query: z.object({
    ...paginationQuerySchema,
    search: z.string().trim().min(1).max(100).optional(),
    categoryId: z.string().uuid().optional(),
    sellerId: z.string().uuid().optional(),
    isActive: z.coerce.boolean().optional(),
  }),
});

const productParamsSchema = z.object({
  params: z.object({
    productId: z.string().uuid(),
  }),
});

const updateProductModerationSchema = z.object({
  params: z.object({
    productId: z.string().uuid(),
  }),
  body: z
    .object({
      isActive: z.boolean().optional(),
      stock: z.coerce.number().int().min(0).optional(),
      price: z.coerce.number().positive().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one product field is required',
    }),
});

const listAdminOrdersSchema = z.object({
  query: z.object({
    ...paginationQuerySchema,
    status: orderStatusSchema.optional(),
    userId: z.string().uuid().optional(),
  }),
});

const orderParamsSchema = z.object({
  params: z.object({
    orderId: z.string().uuid(),
  }),
});

const updateOrderStatusSchema = z.object({
  params: z.object({
    orderId: z.string().uuid(),
  }),
  body: z.object({
    status: orderStatusSchema,
  }),
});

module.exports = {
  listUsersSchema,
  userParamsSchema,
  updateUserRoleSchema,
  listAdminProductsSchema,
  productParamsSchema,
  updateProductModerationSchema,
  listAdminOrdersSchema,
  orderParamsSchema,
  updateOrderStatusSchema,
};
