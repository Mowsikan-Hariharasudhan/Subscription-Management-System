import { Router } from 'express';
import { prisma } from '../prisma.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// GET /api/reports/financial (ADMIN & STAFF)
router.get('/financial', requireAuth, requireRole(['ADMIN', 'STAFF']), async (_req, res): Promise<void> => {
  try {
    const activeSubs = await prisma.subscription.findMany({
      where: { state: 'ACTIVE' },
      select: { mrr: true, total: true },
    });

    const mrr = activeSubs.reduce((acc, sub) => acc + sub.mrr, 0);
    const arr = mrr * 12;

    const invoices = await prisma.invoice.findMany({
      select: {
        total: true,
        amountPaid: true,
        state: true,
        issueDate: true,
      },
    });

    const totalInvoiced = invoices.reduce((acc, inv) => acc + inv.total, 0);
    const totalCollected = invoices.reduce((acc, inv) => acc + inv.amountPaid, 0);
    const totalOutstanding = totalInvoiced - totalCollected;

    const customerCount = await prisma.customer.count({
      where: { status: 'ACTIVE' },
    });

    // ARPU (Average Revenue Per User) in paise
    const arpu = customerCount > 0 ? Math.round(mrr / customerCount) : 0;

    res.json({
      mrrPaise: mrr,
      arrPaise: arr,
      totalInvoicedPaise: totalInvoiced,
      totalCollectedPaise: totalCollected,
      totalOutstandingPaise: totalOutstanding,
      activeCustomerCount: customerCount,
      activeSubscriptionCount: activeSubs.length,
      arpuPaise: arpu,
    });
  } catch (err: any) {
    console.error('Reports error:', err);
    res.status(500).json({ error: 'Failed to generate financial reports' });
  }
});

export default router;
