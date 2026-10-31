import { z } from 'zod';

const templateLineSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  taxRuleId: z.string().optional().nullable(),
  quantity: z.number().int().min(1).default(1),
  unitPrice: z.number().int().min(0, 'Unit price in paise must be >= 0'),
  sortOrder: z.number().int().default(0),
});

export const quotationTemplateSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Template name is required'),
    planId: z.string().optional().nullable(),
    validityDays: z.number().int().min(1).default(30),
    paymentTerms: z.string().optional().nullable(),
    isActive: z.boolean().default(true),
    lines: z.array(templateLineSchema).min(1, 'At least one line is required'),
  }),
});

const quotationLineSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  variantId: z.string().optional().nullable(),
  taxRuleId: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  quantity: z.number().int().min(1).default(1),
  unitPrice: z.number().int().min(0, 'Unit price in paise must be >= 0'),
  sortOrder: z.number().int().default(0),
});

export const createQuotationSchema = z.object({
  body: z.object({
    customerId: z.string().min(1, 'Customer ID is required'),
    planId: z.string().optional().nullable(),
    templateId: z.string().optional().nullable(),
    expiryDate: z.string().datetime().optional().nullable(),
    paymentTerms: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
    discountAmt: z.number().int().min(0).default(0),
    lines: z.array(quotationLineSchema).min(1, 'At least one line is required'),
  }),
});

export const updateQuotationSchema = z.object({
  body: z.object({
    planId: z.string().optional().nullable(),
    expiryDate: z.string().datetime().optional().nullable(),
    paymentTerms: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
    discountAmt: z.number().int().min(0).optional(),
    lines: z.array(quotationLineSchema).optional(),
  }),
});

const subscriptionLineInputSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  variantId: z.string().optional().nullable(),
  taxRuleId: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  quantity: z.number().int().min(1).default(1),
  unitPrice: z.number().int().min(0),
  sortOrder: z.number().int().default(0),
});

export const createSubscriptionSchema = z.object({
  body: z.object({
    customerId: z.string().min(1, 'Customer ID is required'),
    planId: z.string().min(1, 'Plan ID is required'),
    startDate: z.string().datetime(),
    expiryDate: z.string().datetime().optional().nullable(),
    paymentTerms: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
    lines: z.array(subscriptionLineInputSchema).min(1, 'At least one line is required'),
  }),
});

export const updateSubscriptionSchema = z.object({
  body: z.object({
    planId: z.string().optional(),
    expiryDate: z.string().datetime().optional().nullable(),
    paymentTerms: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
  }),
});

