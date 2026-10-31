import { prisma } from '../config/prisma';
import { SubscriptionService } from './subscriptionService';
import { PaymentService } from './paymentService';
import { createAuditLog } from '../utils/auditLog';

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

    const [customer, activeSubscriptions, unpaidInvoices, recentInvoices, totalInvoices, recentPayments] = await Promise.all([
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
      prisma.invoice.findMany({
        where: { customerId },
        take: 5,
        orderBy: { issueDate: 'desc' },
        include: { subscription: { include: { plan: true } } },
      }),
      prisma.invoice.count({
        where: { customerId },
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
      outstandingAmount: totalOutstanding,
      totalInvoices,
      activeSubscriptions,
      unpaidInvoices,
      recentInvoices,
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

  static async pauseSubscription(userId: string, subscriptionId: string) {
    const customerId = await this.getCustomerIdForUser(userId);
    const sub = await prisma.subscription.findFirst({
      where: { id: subscriptionId, customerId },
      include: { plan: true },
    });
    if (!sub) throw new Error('Subscription not found or not owned by you');
    return SubscriptionService.pause(subscriptionId, userId);
  }

  static async resumeSubscription(userId: string, subscriptionId: string) {
    const customerId = await this.getCustomerIdForUser(userId);
    const sub = await prisma.subscription.findFirst({
      where: { id: subscriptionId, customerId },
      include: { plan: true },
    });
    if (!sub) throw new Error('Subscription not found or not owned by you');
    return SubscriptionService.resume(subscriptionId, userId);
  }

  static async cancelSubscription(userId: string, subscriptionId: string) {
    const customerId = await this.getCustomerIdForUser(userId);
    const sub = await prisma.subscription.findFirst({
      where: { id: subscriptionId, customerId },
      include: { plan: true },
    });
    if (!sub) throw new Error('Subscription not found or not owned by you');
    return SubscriptionService.close(subscriptionId, userId);
  }

  static async subscribeNew(
    userId: string,
    data: { planId: string; productId: string; variantId?: string; quantity?: number; notes?: string }
  ) {
    const customerId = await this.getCustomerIdForUser(userId);
    const plan = await prisma.subscriptionPlan.findUnique({ where: { id: data.planId } });
    if (!plan || !plan.isActive) throw new Error('Selected plan is invalid or inactive');

    const product = await prisma.product.findUnique({
      where: { id: data.productId },
      include: { variants: true },
    });
    if (!product || !product.isActive) throw new Error('Selected product is invalid or inactive');

    let unitPrice = product.salesPrice;
    if (data.variantId) {
      const variant = product.variants.find((v) => v.id === data.variantId);
      if (variant && variant.additionalPrice) {
        unitPrice += variant.additionalPrice;
      }
    }

    const qty = data.quantity && data.quantity > 0 ? data.quantity : 1;
    const lineTotal = unitPrice * qty;

    const count = await prisma.subscription.count();
    const yearMonth = `${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}`;
    const seq = String(count + 1).padStart(4, '0');
    const subNumber = `SUB-${yearMonth}-${seq}`;

    const nextBillingDate = SubscriptionService.calculateNextBillingDate(new Date(), plan.billingFrequency);

    const subscription = await prisma.subscription.create({
      data: {
        number: subNumber,
        customerId,
        planId: plan.id,
        status: 'ACTIVE',
        startDate: new Date(),
        nextBillingDate,
        paymentTerms: 'IMMEDIATE',
        notes: data.notes || 'Subscribed via Customer Self-Service Portal',
        subtotal: lineTotal,
        taxAmount: 0,
        total: lineTotal,
        lines: {
          create: [
            {
              productId: product.id,
              variantId: data.variantId || null,
              quantity: qty,
              unitPrice,
              lineTotal,
              description: `${product.name} subscription (${plan.name})`,
              sortOrder: 0,
            },
          ],
        },
      },
      include: {
        plan: true,
        lines: { include: { product: true, variant: true } },
      },
    });

    await createAuditLog({
      userId,
      action: 'CUSTOMER_PORTAL_SUBSCRIBED',
      entity: 'Subscription',
      entityId: subscription.id,
      details: { plan: plan.name, product: product.name, total: lineTotal },
    });

    return subscription;
  }

  static async payInvoice(userId: string, invoiceId: string, data: { method?: string; notes?: string }) {
    const customerId = await this.getCustomerIdForUser(userId);
    const invoice = await prisma.invoice.findFirst({
      where: { id: invoiceId, customerId },
    });
    if (!invoice) throw new Error('Invoice not found or not owned by you');
    if (invoice.outstanding <= 0) throw new Error('This invoice is already fully paid');

    return PaymentService.recordPayment(
      {
        invoiceId,
        amount: invoice.outstanding,
        method: (data.method as any) || 'CARD',
        notes: data.notes || 'Paid via Customer Portal Online Checkout',
      },
      userId
    );
  }
}
