const { z } = require('zod');

const updateProfileSchema = z.object({
  body: z
    .object({
      name: z.string().trim().min(2).max(80).optional(),
      phone: z.string().trim().min(7).max(20).nullable().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one profile field is required',
    }),
});

const addressBodySchema = z.object({
  label: z.string().trim().min(2).max(40),
  line1: z.string().trim().min(3).max(120),
  line2: z.string().trim().max(120).optional(),
  city: z.string().trim().min(2).max(80),
  state: z.string().trim().max(80).optional(),
  postalCode: z.string().trim().min(2).max(20),
  country: z.string().trim().min(2).max(80),
  isDefault: z.boolean().optional().default(false),
});

const addressIdParamsSchema = z.object({
  addressId: z.string().uuid(),
});

const createAddressSchema = z.object({
  body: addressBodySchema,
});

const updateAddressSchema = z.object({
  params: addressIdParamsSchema,
  body: addressBodySchema.partial().refine((data) => Object.keys(data).length > 0, {
    message: 'At least one address field is required',
  }),
});

const addressParamsSchema = z.object({
  params: addressIdParamsSchema,
});

module.exports = {
  updateProfileSchema,
  createAddressSchema,
  updateAddressSchema,
  addressParamsSchema,
};
