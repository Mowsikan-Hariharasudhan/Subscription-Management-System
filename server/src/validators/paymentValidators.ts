import { z } from 'zod';

export const recordPaymentSchema = z.object({
  body: z.object({
    invoiceId: z.string().min(1, 'Invoice ID is required'),
    amount: z.number().int().min(1, 'Payment amount must be greater than 0'),
    method: z.enum(['CASH', 'BANK_TRANSFER', 'UPI', 'CARD', 'OTHER']).default('CASH'),
    notes: z.string().optional().nullable(),
    paymentDate: z.string().datetime().optional(),
  }),
});

export const updateCustomerAccountSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    companyName: z.string().optional().nullable(),
    phone: z.string().optional().nullable(),
    billingAddress: z.string().optional().nullable(),
  }),
});

