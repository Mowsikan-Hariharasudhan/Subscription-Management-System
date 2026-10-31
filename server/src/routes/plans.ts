import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// GET /api/plans - List plans
router.get('/', requireAuth, async (_req, res): Promise<void> => {
  try {
    const plans = await prisma.plan.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        product: {
          select: { id: true, name: true, code: true },
        },
      },
    });

    res.json({ plans });
  } catch (err: any) {
    console.error('List plans error:', err);
    res.status(500).json({ error: 'Failed to list plans' });
  }
});

// POST /api/plans - Create plan
router.post('/', requireAuth, requireRole(['ADMIN']), async (req, res): Promise<void> => {
  try {
    const PlanSchema = z.object({
      productId: z.string().min(1),
      name: z.string().min(2),
      price: z.number().int().nonnegative(), // Integer paise
      billingCycle: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']).default('MONTHLY'),
      minQty: z.number().int().default(1),
      allowPause: z.boolean().default(true),
      allowRenew: z.boolean().default(true),
      allowEarlyClose: z.boolean().default(true),
      autoClose: z.boolean().default(false),
    });

    const parse = PlanSchema.safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({ error: 'Validation failed', details: parse.error.format() });
      return;
    }

    const count = await prisma.plan.count();
    const code = `PLN-${String(count + 1).padStart(3, '0')}`;

    const plan = await prisma.plan.create({
      data: {
        ...parse.data,
        code,
        isActive: true,
      },
      include: {
        product: true,
      },
    });

    res.status(201).json({ plan });
  } catch (err: any) {
    console.error('Create plan error:', err);
    res.status(500).json({ error: 'Failed to create plan' });
  }
});

// PUT /api/plans/:id - Update plan
router.put('/:id', requireAuth, requireRole(['ADMIN']), async (req, res): Promise<void> => {
  try {
    const plan = await prisma.plan.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json({ plan });
  } catch (err: any) {
    console.error('Update plan error:', err);
    res.status(500).json({ error: 'Failed to update plan' });
  }
});

export default router;
