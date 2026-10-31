import { Router } from 'express';
import { prisma } from '../prisma.js';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

router.get('/stats', requireAuth, async (req: AuthenticatedRequest, res): Promise<void> => {
  try {
    const user = req.user!;
    const isCustomer = user.role === 'CUSTOMER';
    const customerFilter = isCustomer ? { customerId: user.customerId || 'none' } : {};

    // 1. Subscriptions stats
    const activeSubs = await prisma.subscription.findMany({
      where: {
        state: 'ACTIVE',
        ...customerFilter,
      },
      select: {
        mrr: true,
      },
    });

    const mrr = activeSubs.reduce((acc, sub) => acc + sub.mrr, 0);
    const arr = mrr * 12;
    const activeCount = activeSubs.length;

    // 2. Overdue invoices
    const overdueInvoices = await prisma.invoice.findMany({
      where: {
        state: 'OVERDUE',
        ...customerFilter,
      },
      select: {
        total: true,
        amountPaid: true,
      },
    });

    const overdueAmount = overdueInvoices.reduce(
      (acc, inv) => acc + (inv.total - inv.amountPaid),
      0
    );

    // 3. Needs Attention list (Overdue or Partially Paid)
    const needsAttentionInvoices = await prisma.invoice.findMany({
      where: {
        state: { in: ['OVERDUE', 'PARTIALLY_PAID'] },
        ...customerFilter,
      },
      include: {
        customer: {
          select: { name: true, company: true, code: true },
        },
      },
      orderBy: { dueDate: 'asc' },
      take: 10,
    });

    // 4. Monthly revenue trend (Paid invoices)
    const paidInvoices = await prisma.invoice.findMany({
      where: {
        state: 'PAID',
        ...customerFilter,
      },
      select: {
        total: true,
        issueDate: true,
      },
    });

    // Aggregate by month (e.g. Jan, Feb, Mar...)
    const monthsMap: Record<string, number> = {
      'Jan': 0, 'Feb': 0, 'Mar': 0, 'Apr': 0, 'May': 0, 'Jun': 0,
    };

    paidInvoices.forEach((inv) => {
      const monthName = inv.issueDate.toLocaleString('default', { month: 'short' });
      if (monthsMap[monthName] !== undefined) {
        monthsMap[monthName] += inv.total;
      } else {
        monthsMap[monthName] = inv.total;
      }
    });

    const revenueTrend = Object.entries(monthsMap).map(([month, paise]) => ({
      month,
      revenuePaise: paise,
      revenueRupees: paise / 100,
    }));

    res.json({
      mrrPaise: mrr,
      arrPaise: arr,
      activeSubscriptions: activeCount,
      overduePaise: overdueAmount,
      revenueTrend,
      needsAttention: needsAttentionInvoices.map((inv) => ({
        id: inv.id,
        code: inv.code,
        customerName: inv.customer?.name || inv.customer?.company || 'Unknown',
        customerCompany: inv.customer?.company,
        amountPaise: inv.total,
        amountPaidPaise: inv.amountPaid,
        remainingPaise: inv.total - inv.amountPaid,
        dueDate: inv.dueDate.toISOString().split('T')[0],
        status: inv.state,
      })),
    });
  } catch (err: any) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({ error: 'Failed to retrieve dashboard analytics' });
  }
});

export default router;

