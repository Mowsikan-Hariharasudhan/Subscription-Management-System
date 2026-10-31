import { prisma } from '../config/prisma';

export class DashboardService {
  static async getKpis() {
    const now = new Date();

    const [
      activeSubscriptions,
      totalCustomers,
      paymentAggregate,
      invoicesAggregate,
      outstandingAggregate,
      overdueInvoicesCount,
    ] = await Promise.all([
      prisma.subscription.count({
        where: { status: 'ACTIVE' },
      }),
      prisma.customer.count({
        where: { isActive: true },
      }),
      prisma.payment.aggregate({
        _sum: { amount: true },
      }),
      prisma.invoice.aggregate({
        where: { status: { in: ['CONFIRMED', 'PAID'] } },
        _sum: { total: true },
      }),
      prisma.invoice.aggregate({
        where: { status: 'CONFIRMED' },
        _sum: { outstanding: true },
      }),
      prisma.invoice.count({
        where: {
          status: 'CONFIRMED',
          dueDate: { lt: now },
          outstanding: { gt: 0 },
        },
      }),
    ]);

    return {
      activeSubscriptions,
      totalCustomers,
      collectedRevenue: paymentAggregate._sum.amount || 0,
      totalInvoiced: invoicesAggregate._sum.total || 0,
      outstandingAmount: outstandingAggregate._sum.outstanding || 0,
      overdueInvoices: overdueInvoicesCount,
    };
  }

  static async getMonthlyRevenue(year?: number) {
    const targetYear = year || new Date().getFullYear();
    const payments = await prisma.payment.findMany({
      where: {
        paymentDate: {
          gte: new Date(targetYear, 0, 1),
          lte: new Date(targetYear, 11, 31, 23, 59, 59),
        },
      },
      select: {
        amount: true,
        paymentDate: true,
      },
    });

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyMap = new Map<number, number>();
    for (let i = 0; i < 12; i++) {
      monthlyMap.set(i, 0);
    }

    payments.forEach((p) => {
      const month = p.paymentDate.getMonth();
      monthlyMap.set(month, (monthlyMap.get(month) || 0) + p.amount);
    });

    return monthNames.map((name, index) => ({
      month: name,
      revenuePaise: monthlyMap.get(index) || 0,
      revenueRupees: Number(((monthlyMap.get(index) || 0) / 100).toFixed(2)),
    }));
  }

  static async getSubscriptionGrowth() {
    const subscriptions = await prisma.subscription.findMany({
      select: {
        createdAt: true,
        status: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    // Group last 6 months
    const growth: Record<string, number> = {};
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
      growth[key] = 0;
    }

    subscriptions.forEach((s) => {
      const key = `${monthNames[s.createdAt.getMonth()]} ${s.createdAt.getFullYear()}`;
      if (growth[key] !== undefined) {
        growth[key]++;
      }
    });

    return Object.entries(growth).map(([month, count]) => ({
      month,
      newSubscriptions: count,
    }));
  }

  static async getPaymentStatusDistribution() {
    const invoices = await prisma.invoice.groupBy({
      by: ['status'],
      _count: { id: true },
      _sum: { total: true },
    });

    return invoices.map((inv) => ({
      status: inv.status,
      count: inv._count.id,
      totalPaise: inv._sum.total || 0,
      totalRupees: Number(((inv._sum.total || 0) / 100).toFixed(2)),
    }));
  }

  static async getRecentSubscriptions(limit = 5) {
    return prisma.subscription.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: true,
        plan: true,
      },
    });
  }

  static async getRecentInvoices(limit = 5) {
    return prisma.invoice.findMany({
      take: limit,
      orderBy: { issueDate: 'desc' },
      include: {
        customer: true,
        subscription: { include: { plan: true } },
      },
    });
  }

  static async getRecentPayments(limit = 5) {
    return prisma.payment.findMany({
      take: limit,
      orderBy: { paymentDate: 'desc' },
      include: {
        invoice: {
          include: { customer: true },
        },
      },
    });
  }

  static async getOverdueInvoices(limit = 5) {
    const now = new Date();
    return prisma.invoice.findMany({
      where: {
        status: 'CONFIRMED',
        dueDate: { lt: now },
        outstanding: { gt: 0 },
      },
      take: limit,
      orderBy: { dueDate: 'asc' },
      include: {
        customer: true,
        subscription: { include: { plan: true } },
      },
    });
  }
}

