import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    role: z.enum(['ADMIN', 'STAFF', 'CUSTOMER']).default('CUSTOMER'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    companyName: z.string().optional(),
    phone: z.string().optional(),
    billingAddress: z.string().optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Reset token is required'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  }),
});

export const createUserSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    role: z.enum(['ADMIN', 'STAFF', 'CUSTOMER']),
    isActive: z.boolean().default(true),
    // If customer, optional profile fields
    name: z.string().optional(),
    companyName: z.string().optional(),
    phone: z.string().optional(),
    billingAddress: z.string().optional(),
  }),
});

export const updateUserSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address').optional(),
    password: z.string().min(8, 'Password must be at least 8 characters').optional(),
    role: z.enum(['ADMIN', 'STAFF', 'CUSTOMER']).optional(),
    isActive: z.boolean().optional(),
  }),
});

