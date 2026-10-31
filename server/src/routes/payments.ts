import { Router } from 'express';
import { prisma } from '../prisma.js';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/payments - List payments
router.get('/', requireAuth, async (req: AuthenticatedRequest, res): Promise<void> => {
  try {
    const user = req.user!;
    const isCustomer = user.role === 'CUSTOMER';
    const where = isCustomer ? { invoice: { customerId: user.customerId || 'none' } } : {};

    const payments = await prisma.payment.findMany({
      where,
      orderBy: { paidAt: 'desc' },
      include: {
        invoice: {
          include: {
            customer: {
              select: { code: true, name: true, company: true },
            },
          },
        },
      },
    });

    res.json({ payments });
  } catch (err: any) {
    console.error('List payments error:', err);
    res.status(500).json({ error: 'Failed to list payments' });
  }
});

export default router;

