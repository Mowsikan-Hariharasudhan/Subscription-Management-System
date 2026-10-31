import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// Tax Rules
router.get('/tax-rules', requireAuth, async (_req, res): Promise<void> => {
  try {
    const rules = await prisma.taxRule.findMany({
      orderBy: { rate: 'asc' },
    });
    res.json({ rules });
  } catch (err: any) {
    console.error('List tax rules error:', err);
    res.status(500).json({ error: 'Failed to list tax rules' });
  }
});

router.post('/tax-rules', requireAuth, requireRole(['ADMIN']), async (req, res): Promise<void> => {
  try {
    const TaxSchema = z.object({
      name: z.string().min(2),
      rate: z.number().positive(),
      type: z.enum(['IGST', 'CGST_SGST']).default('IGST'),
      effectiveFrom: z.string(),
      effectiveTo: z.string(),
    });

    const parse = TaxSchema.safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({ error: 'Validation failed', details: parse.error.format() });
      return;
    }

    const rule = await prisma.taxRule.create({
      data: {
        ...parse.data,
        effectiveFrom: new Date(parse.data.effectiveFrom),
        effectiveTo: new Date(parse.data.effectiveTo),
        isActive: true,
      },
    });

    res.status(201).json({ rule });
  } catch (err: any) {
    console.error('Create tax rule error:', err);
    res.status(500).json({ error: 'Failed to create tax rule' });
  }
});

// Discounts
router.get('/discounts', requireAuth, async (_req, res): Promise<void> => {
  try {
    const discounts = await prisma.discount.findMany({
      orderBy: { startsAt: 'desc' },
    });
    res.json({ discounts });
  } catch (err: any) {
    console.error('List discounts error:', err);
    res.status(500).json({ error: 'Failed to list discounts' });
  }
});

router.post('/discounts', requireAuth, requireRole(['ADMIN']), async (req, res): Promise<void> => {
  try {
    const DiscountSchema = z.object({
      name: z.string().min(2),
      type: z.enum(['PERCENT', 'FIXED']),
      value: z.number().int().positive(), // Percent int or paise
      minQty: z.number().int().default(1),
      minPurchase: z.number().int().default(0), // Paise
      maxUses: z.number().int().default(100),
      scope: z.enum(['SUBSCRIPTION', 'PRODUCTS']).default('SUBSCRIPTION'),
      startsAt: z.string(),
      endsAt: z.string(),
    });

    const parse = DiscountSchema.safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({ error: 'Validation failed', details: parse.error.format() });
      return;
    }

    const discount = await prisma.discount.create({
      data: {
        ...parse.data,
        startsAt: new Date(parse.data.startsAt),
        endsAt: new Date(parse.data.endsAt),
        isActive: true,
      },
    });

    res.status(201).json({ discount });
  } catch (err: any) {
    console.error('Create discount error:', err);
    res.status(500).json({ error: 'Failed to create discount' });
  }
});

export default router;
