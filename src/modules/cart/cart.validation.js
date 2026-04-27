const { z } = require('zod');

const productParamsSchema = z.object({
  productId: z.string().uuid(),
});

const addCartItemSchema = z.object({
  body: z.object({
    productId: z.string().uuid(),
    quantity: z.coerce.number().int().positive().max(100),
  }),
});

const updateCartItemSchema = z.object({
  params: productParamsSchema,
  body: z.object({
    quantity: z.coerce.number().int().positive().max(100),
  }),
});

const cartItemParamsSchema = z.object({
  params: productParamsSchema,
});

module.exports = {
  addCartItemSchema,
  updateCartItemSchema,
  cartItemParamsSchema,
};
