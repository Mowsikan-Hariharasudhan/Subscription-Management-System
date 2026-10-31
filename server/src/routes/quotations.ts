import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma.js';
import { requireAuth, requireRole, AuthenticatedRequest } from '../middleware/auth.js';
import { calculateMRR, computeNextPeriod } from '../utils/billingEngine.js';

const router = Router();

// GET /api/quotations - List quotations
router.get('/', requireAuth, async (req: AuthenticatedRequest, res): Promise<void> => {
  try {
    const user = req.user!;
    const isCustomer = user.role === 'CUSTOMER';
    const where = isCustomer ? { customerId: user.customerId || 'none' } : {};

    const quotations = await prisma.quotation.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: {
          select: { id: true, code: true, name: true, company: true },
        },
      },
    });

    res.json({ quotations });
  } catch (err: any) {
    console.error('List quotations error:', err);
    res.status(500).json({ error: 'Failed to list quotations' });
  }
});

// POST /api/quotations - Create quotation
router.post('/', requireAuth, requireRole(['ADMIN', 'STAFF']), async (req, res): Promise<void> => {
  try {
    const QuotationSchema = z.object({
      customerId: z.string().min(1),
      validUntil: z.string(),
      lines: z.array(z.object({
        productId: z.string(),
        productName: z.string(),
        quantity: z.number().int().positive(),
        unitPrice: z.number().int().nonnegative(), // Paise
        total: z.number().int().nonnegative(),     // Paise
      })),
    });

    const parse = QuotationSchema.safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({ error: 'Validation failed', details: parse.error.format() });
      return;
    }

    const { customerId, validUntil, lines } = parse.data;
    const totalPaise = lines.reduce((acc, line) => acc + line.total, 0);

    const count = await prisma.quotation.count();
    const number = `QTN-2026-${String(count + 1).padStart(4, '0')}`;

    const quotation = await prisma.quotation.create({
      data: {
        number,
        customerId,
        state: 'QUOTATION',
        validUntil: new Date(validUntil),
        lines: JSON.stringify(lines),
        total: totalPaise,
      },
      include: {
        customer: true,
      },
    });

    res.status(201).json({ quotation });
  } catch (err: any) {
    console.error('Create quotation error:', err);
    res.status(500).json({ error: 'Failed to create quotation' });
  }
});

// POST /api/quotations/:id/convert - Convert confirmed quotation to subscription
router.post('/:id/convert', requireAuth, requireRole(['ADMIN', 'STAFF']), async (req, res): Promise<void> => {
  try {
    const quotationId = req.params.id;

    const result = await prisma.$transaction(async (tx) => {
      const qtn = await tx.quotation.findUnique({
        where: { id: quotationId },
      });

      if (!qtn) {
        throw new Error('Quotation not found');
      }

      // Find any default active monthly plan for this subscription
      const defaultPlan = await tx.plan.findFirst({
        where: { isActive: true },
        include: { product: true },
      });

      if (!defaultPlan) {
        throw new Error('No active subscription plans available for conversion');
      }

      const startDate = new Date();
      const { periodEnd: nextBillingDate } = computeNextPeriod(startDate, defaultPlan.billingCycle);

      const expiryDate = new Date(startDate);
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);

      const subCount = await tx.subscription.count();
      const code = `SUB-2026-${String(subCount + 1).padStart(6, '0')}`;

      const subscription = await tx.subscription.create({
        data: {
          code,
          customerId: qtn.customerId,
          planId: defaultPlan.id,
          state: 'ACTIVE',
          startDate,
          expiryDate,
          nextBillingDate,
          total: qtn.total,
          mrr: calculateMRR(qtn.total, defaultPlan.billingCycle),
          lines: qtn.lines,
        },
      });

      await tx.quotation.update({
        where: { id: quotationId },
        data: { state: 'CONFIRMED' },
      });

      await tx.auditLog.create({
        data: {
          action: 'QUOTATION_CONVERTED_TO_SUBSCRIPTION',
          entity: 'Quotation',
          entityId: qtn.number,
          changes: JSON.stringify({ subscriptionCode: code, total: qtn.total }),
        },
      });

      return subscription;
    });

    res.status(201).json({ subscription: result });
  } catch (err: any) {
    console.error('Quotation conversion error:', err);
    res.status(400).json({ error: err.message || 'Failed to convert quotation' });
  }
});

export default router;
