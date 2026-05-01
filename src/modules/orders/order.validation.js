const { z } = require('zod');

const orderIdParamsSchema = z.object({
  orderId: z.string().uuid(),
});

const shippingAddressSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(7).max(20),
  line1: z.string().trim().min(3).max(120),
  line2: z.string().trim().max(120).optional(),
  city: z.string().trim().min(2).max(80),
  state: z.string().trim().max(80).optional(),
  postalCode: z.string().trim().min(2).max(20),
  country: z.string().trim().min(2).max(80),
});

const placeOrderSchema = z.object({
  body: z.object({
    shippingAddress: shippingAddressSchema,
  }),
});

const listOrdersSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().max(100).optional().default(10),
    status: z
      .enum(['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'])
      .optional(),
  }),
});

const orderParamsSchema = z.object({
  params: orderIdParamsSchema,
});

module.exports = {
  placeOrderSchema,
  listOrdersSchema,
  orderParamsSchema,
};
