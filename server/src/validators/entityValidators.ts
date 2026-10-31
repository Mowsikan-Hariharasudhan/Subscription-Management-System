import { z } from 'zod';

export const productSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Product name is required'),
    type: z.string().default('SERVICE'),
    salesPrice: z.number().int().min(0, 'Sales price in paise must be >= 0'),
    costPrice: z.number().int().min(0).default(0),
    notes: z.string().optional().nullable(),
    isActive: z.boolean().default(true),
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    type: z.string().optional(),
    salesPrice: z.number().int().min(0).optional(),
    costPrice: z.number().int().min(0).optional(),
    notes: z.string().optional().nullable(),
    isActive: z.boolean().optional(),
  }),
});

export const productVariantSchema = z.object({
  body: z.object({
    productId: z.string().min(1, 'Product ID is required'),
    name: z.string().min(1, 'Variant name is required'),
    attributeName: z.string().optional().nullable(),
    additionalPrice: z.number().int().min(0, 'Additional price must be >= 0').default(0),
    isActive: z.boolean().default(true),
  }),
});

export const updateProductVariantSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    attributeName: z.string().optional().nullable(),
    additionalPrice: z.number().int().min(0).optional(),
    isActive: z.boolean().optional(),
  }),
});

export const subscriptionPlanSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Plan name is required'),
    description: z.string().optional().nullable(),
    billingFrequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']),
    minimumQuantity: z.number().int().min(1).default(1),
    availableFrom: z.string().datetime().optional().nullable(),
    availableUntil: z.string().datetime().optional().nullable(),
    autoClose: z.boolean().default(false),
    allowEarlyClosure: z.boolean().default(true),
    allowPause: z.boolean().default(false),
    allowRenewal: z.boolean().default(true),
    isActive: z.boolean().default(true),
  }),
});

export const updateSubscriptionPlanSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional().nullable(),
    billingFrequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']).optional(),
    minimumQuantity: z.number().int().min(1).optional(),
    availableFrom: z.string().datetime().optional().nullable(),
    availableUntil: z.string().datetime().optional().nullable(),
    autoClose: z.boolean().optional(),
    allowEarlyClosure: z.boolean().optional(),
    allowPause: z.boolean().optional(),
    allowRenewal: z.boolean().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const taxRuleSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Tax rule name is required'),
    rate: z.number().int().min(0, 'Tax rate in basis points must be >= 0'),
    description: z.string().optional().nullable(),
    isActive: z.boolean().default(true),
    effectiveFrom: z.string().datetime().optional().nullable(),
    effectiveTo: z.string().datetime().optional().nullable(),
  }),
});

export const updateTaxRuleSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    rate: z.number().int().min(0).optional(),
    description: z.string().optional().nullable(),
    isActive: z.boolean().optional(),
    effectiveFrom: z.string().datetime().optional().nullable(),
    effectiveTo: z.string().datetime().optional().nullable(),
  }),
});

export const customerSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Customer name is required'),
    companyName: z.string().optional().nullable(),
    phone: z.string().optional().nullable(),
    billingAddress: z.string().optional().nullable(),
    email: z.string().email('Invalid email address').optional(),
    password: z.string().min(8).optional(),
    isActive: z.boolean().default(true),
  }),
});

export const updateCustomerSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    companyName: z.string().optional().nullable(),
    phone: z.string().optional().nullable(),
    billingAddress: z.string().optional().nullable(),
    isActive: z.boolean().optional(),
  }),
});

