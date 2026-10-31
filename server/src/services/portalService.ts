import { prisma } from '../config/prisma';

export class PortalService {
  private static async getCustomerIdForUser(userId: string): Promise<string> {
    const customer = await prisma.customer.findUnique({
      where: { userId },
    });
    if (!customer) {
      throw new Error('Customer profile not found for this user');
    }
    return customer.id;
  }

  static async getOverview(userId: string) {
    const customerId = await this.getCustomerIdForUser(userId);

    const [customer, activeSubscriptions, unpaidInvoices, recentPayments] = await Promise.all([
      prisma.customer.findUnique({
        where: { id: customerId },
        include: { user: { select: { email: true, createdAt: true } } },
      }),
      prisma.subscription.findMany({
        where: { customerId, status: 'ACTIVE' },
        include: {
          plan: true,
          lines: { include: { product: true, variant: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.invoice.findMany({
        where: { customerId, status: 'CONFIRMED' },
        include: { subscription: { include: { plan: true } } },
        orderBy: { dueDate: 'asc' },
      }),
      prisma.payment.findMany({
        where: { invoice: { customerId } },
        take: 5,
        orderBy: { paymentDate: 'desc' },
        include: { invoice: { select: { number: true, total: true } } },
      }),
    ]);

    const totalOutstanding = unpaidInvoices.reduce((acc, inv) => acc + inv.outstanding, 0);
    const totalPaid = recentPayments.reduce((acc, p) => acc + p.amount, 0);

    return {
      customer,
      kpis: {
        activeSubscriptionsCount: activeSubscriptions.length,
        unpaidInvoicesCount: unpaidInvoices.length,
        totalOutstanding,
        recentPaymentsTotal: totalPaid,
      },
      activeSubscriptions,
      unpaidInvoices,
      recentPayments,
    };
  }

  static async getSubscriptions(userId: string) {
    const customerId = await this.getCustomerIdForUser(userId);
    return prisma.subscription.findMany({
      where: { customerId },
      include: {
        plan: true,
        lines: { include: { product: true, variant: true, taxRule: true } },
        invoices: {
          take: 3,
          orderBy: { issueDate: 'desc' },
          select: { id: true, number: true, status: true, total: true, issueDate: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getSubscriptionById(userId: string, subscriptionId: string) {
    const customerId = await this.getCustomerIdForUser(userId);
    const sub = await prisma.subscription.findFirst({
      where: { id: subscriptionId, customerId },
      include: {
        plan: true,
        lines: { include: { product: true, variant: true, taxRule: true } },
        invoices: {
          orderBy: { issueDate: 'desc' },
          include: { payments: true },
        },
      },
    });

    if (!sub) {
      throw new Error('Subscription not found');
    }

    return sub;
  }

  static async getInvoices(userId: string) {
    const customerId = await this.getCustomerIdForUser(userId);
    return prisma.invoice.findMany({
      where: { customerId },
      include: {
        subscription: { include: { plan: true } },
        payments: true,
        lines: { include: { product: true } },
      },
      orderBy: { issueDate: 'desc' },
    });
  }

  static async getInvoiceById(userId: string, invoiceId: string) {
    const customerId = await this.getCustomerIdForUser(userId);
    const invoice = await prisma.invoice.findFirst({
      where: { id: invoiceId, customerId },
      include: {
        subscription: { include: { plan: true } },
        lines: { include: { product: true, variant: true, taxRule: true } },
        payments: true,
        redemptions: { include: { discountRule: true } },
      },
    });

    if (!invoice) {
      throw new Error('Invoice not found');
    }

    return invoice;
  }

  static async getPayments(userId: string) {
    const customerId = await this.getCustomerIdForUser(userId);
    return prisma.payment.findMany({
      where: { invoice: { customerId } },
      include: {
        invoice: {
          select: { id: true, number: true, total: true, issueDate: true },
        },
      },
      orderBy: { paymentDate: 'desc' },
    });
  }

  static async getAccount(userId: string) {
    const customer = await prisma.customer.findUnique({
      where: { userId },
      include: {
        user: { select: { id: true, email: true, role: true, createdAt: true } },
      },
    });

    if (!customer) {
      throw new Error('Customer account not found');
    }

    return customer;
  }

  static async updateAccount(userId: string, data: any) {
    const customer = await prisma.customer.findUnique({
      where: { userId },
    });

    if (!customer) {
      throw new Error('Customer account not found');
    }

    return prisma.customer.update({
      where: { id: customer.id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.companyName !== undefined && { companyName: data.companyName }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.billingAddress !== undefined && { billingAddress: data.billingAddress }),
      },
      include: {
        user: { select: { id: true, email: true, role: true } },
      },
    });
  }
}

