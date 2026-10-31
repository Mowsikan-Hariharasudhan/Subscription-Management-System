import { z } from 'zod';

export const discountRuleSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Discount name is required'),
    type: z.enum(['FIXED', 'PERCENTAGE']),
    value: z.number().int().min(1, 'Value must be > 0'),
    minPurchaseAmount: z.number().int().min(0).default(0),
    minQuantity: z.number().int().min(1).default(1),
    startDate: z.string().datetime().optional().nullable(),
    endDate: z.string().datetime().optional().nullable(),
    maxUsageCount: z.number().int().min(1).optional().nullable(),
    isActive: z.boolean().default(true),
    productIds: z.array(z.string()).optional(),
  }),
});

export const updateDiscountRuleSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    type: z.enum(['FIXED', 'PERCENTAGE']).optional(),
    value: z.number().int().min(1).optional(),
    minPurchaseAmount: z.number().int().min(0).optional(),
    minQuantity: z.number().int().min(1).optional(),
    startDate: z.string().datetime().optional().nullable(),
    endDate: z.string().datetime().optional().nullable(),
    maxUsageCount: z.number().int().min(1).optional().nullable(),
    isActive: z.boolean().optional(),
    productIds: z.array(z.string()).optional(),
  }),
});

export const manualBillingSchema = z.object({
  body: z.object({
    subscriptionId: z.string().optional(),
  }),
});

