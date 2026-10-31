import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma.js';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';
import { calculateMRR, computeNextPeriod } from '../utils/billingEngine.js';

const router = Router();

// GET /api/subscriptions - List subscriptions
router.get('/', requireAuth, async (req: AuthenticatedRequest, res): Promise<void> => {
  try {
    const user = req.user!;
    const isCustomer = user.role === 'CUSTOMER';
    const where = isCustomer ? { customerId: user.customerId || 'none' } : {};

    const subscriptions = await prisma.subscription.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: {
          select: { id: true, code: true, name: true, company: true },
        },
        plan: {
          include: { product: true },
        },
      },
    });

    res.json({ subscriptions });
  } catch (err: any) {
    console.error('List subscriptions error:', err);
    res.status(500).json({ error: 'Failed to list subscriptions' });
  }
});

// GET /api/subscriptions/:id
router.get('/:id', requireAuth, async (req: AuthenticatedRequest, res): Promise<void> => {
  try {
    const user = req.user!;
    const subscription = await prisma.subscription.findUnique({
      where: { id: req.params.id },
      include: {
        customer: true,
        plan: { include: { product: true } },
        invoices: { orderBy: { issueDate: 'desc' } },
      },
    });

    if (!subscription) {
      res.status(404).json({ error: 'Subscription not found' });
      return;
    }

    if (user.role === 'CUSTOMER' && subscription.customerId !== user.customerId) {
      res.status(404).json({ error: 'Subscription not found' });
      return;
    }

    res.json({ subscription });
  } catch (err: any) {
    console.error('Get subscription error:', err);
    res.status(500).json({ error: 'Failed to get subscription' });
  }
});

// POST /api/subscriptions - Create subscription
router.post('/', requireAuth, async (req: AuthenticatedRequest, res): Promise<void> => {
  try {
    const SubscriptionSchema = z.object({
      customerId: z.string().min(1),
      planId: z.string().min(1),
      startDate: z.string().optional(),
    });

    const parse = SubscriptionSchema.safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({ error: 'Validation failed', details: parse.error.format() });
      return;
    }

    const { customerId, planId } = parse.data;
    const plan = await prisma.plan.findUnique({
      where: { id: planId },
      include: { product: true },
    });

    if (!plan || !plan.isActive) {
      res.status(400).json({ error: 'Plan is invalid or inactive' });
      return;
    }

    const startDate = parse.data.startDate ? new Date(parse.data.startDate) : new Date();
    const { periodEnd: nextBillingDate } = computeNextPeriod(startDate, plan.billingCycle);

    // Default 1-year contract length
    const expiryDate = new Date(startDate);
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    const mrr = calculateMRR(plan.price, plan.billingCycle);
    const count = await prisma.subscription.count();
    const code = `SUB-2026-${String(count + 1).padStart(6, '0')}`;

    const subscription = await prisma.subscription.create({
      data: {
        code,
        customerId,
        planId,
        state: 'ACTIVE',
        startDate,
        expiryDate,
        nextBillingDate,
        total: plan.price,
        mrr,
        lines: JSON.stringify([{ productId: plan.productId, name: plan.product.name, qty: 1 }]),
      },
      include: {
        customer: true,
        plan: true,
      },
    });

    res.status(201).json({ subscription });
  } catch (err: any) {
    console.error('Create subscription error:', err);
    res.status(500).json({ error: 'Failed to create subscription' });
  }
});

// POST /api/subscriptions/:id/pause
router.post('/:id/pause', requireAuth, async (req: AuthenticatedRequest, res): Promise<void> => {
  try {
    const sub = await prisma.subscription.findUnique({
      where: { id: req.params.id },
      include: { plan: true },
    });

    if (!sub) {
      res.status(404).json({ error: 'Subscription not found' });
      return;
    }

    if (!sub.plan.allowPause) {
      res.status(400).json({ error: 'This subscription plan does not allow pausing.' });
      return;
    }

    const updated = await prisma.subscription.update({
      where: { id: req.params.id },
      data: {
        state: 'PAUSED',
        pausedAt: new Date(),
      },
    });

    res.json({ subscription: updated });
  } catch (err: any) {
    console.error('Pause subscription error:', err);
    res.status(500).json({ error: 'Failed to pause subscription' });
  }
});

// POST /api/subscriptions/:id/resume
router.post('/:id/resume', requireAuth, async (req: AuthenticatedRequest, res): Promise<void> => {
  try {
    const updated = await prisma.subscription.update({
      where: { id: req.params.id },
      data: {
        state: 'ACTIVE',
        pausedAt: null,
      },
    });

    res.json({ subscription: updated });
  } catch (err: any) {
    console.error('Resume subscription error:', err);
    res.status(500).json({ error: 'Failed to resume subscription' });
  }
});

// POST /api/subscriptions/:id/close
router.post('/:id/close', requireAuth, async (req: AuthenticatedRequest, res): Promise<void> => {
  try {
    const sub = await prisma.subscription.findUnique({
      where: { id: req.params.id },
      include: { plan: true },
    });

    if (!sub) {
      res.status(404).json({ error: 'Subscription not found' });
      return;
    }

    if (!sub.plan.allowEarlyClose && sub.state !== 'EXPIRED') {
      res.status(400).json({ error: 'This plan does not permit early closure.' });
      return;
    }

    const updated = await prisma.subscription.update({
      where: { id: req.params.id },
      data: {
        state: 'CLOSED',
        closedAt: new Date(),
        mrr: 0,
      },
    });

    res.json({ subscription: updated });
  } catch (err: any) {
    console.error('Close subscription error:', err);
    res.status(500).json({ error: 'Failed to close subscription' });
  }
});

export default router;

