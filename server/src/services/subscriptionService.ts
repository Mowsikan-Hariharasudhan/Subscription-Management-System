import { addDays, addWeeks, addMonths, addYears } from 'date-fns';
import { prisma } from '../config/prisma';
import { getPaginationParams } from '../utils/pagination';
import { calculateTaxAmount } from '../utils/currency';
import { createAuditLog } from '../utils/auditLog';

export class SubscriptionService {
  private static async generateSubscriptionNumber(): Promise<string> {
    const yearMonth = `${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}`;
    const count = await prisma.subscription.count();
    const sequence = String(count + 1).padStart(4, '0');
    return `SUB-${yearMonth}-${sequence}`;
  }

  static calculateNextBillingDate(from: Date, frequency: string): Date {
    switch (frequency) {
      case 'DAILY':
        return addDays(from, 1);
      case 'WEEKLY':
        return addWeeks(from, 1);
      case 'YEARLY':
        return addYears(from, 1);
      case 'MONTHLY':
      default:
        return addMonths(from, 1);
    }
  }

  static async listSubscriptions(query: any) {
    const { page, limit, skip } = getPaginationParams(query);
    const customerId = query.customerId ? String(query.customerId) : undefined;
    const status = query.status ? String(query.status) : undefined;
    const planId = query.planId ? String(query.planId) : undefined;
    const search = query.search ? String(query.search).trim() : undefined;

    const where: any = {
      ...(customerId && { customerId }),
      ...(status && { status }),
      ...(planId && { planId }),
      ...(search && {
        OR: [
          { number: { contains: search } },
          { customer: { name: { contains: search } } },
          { customer: { companyName: { contains: search } } },
        ],
      }),
    };

    const [total, subscriptions] = await Promise.all([
      prisma.subscription.count({ where }),
      prisma.subscription.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: true,
          plan: true,
          _count: { select: { invoices: true, lines: true } },
        },
      }),
    ]);

    return { subscriptions, total, page, limit };
  }

  static async getSubscriptionById(id: string) {
    const subscription = await prisma.subscription.findUnique({
      where: { id },
      include: {
        customer: true,
        plan: true,
        quotation: true,
        lines: {
          include: {
            product: true,
            variant: true,
            taxRule: true,
          },
          orderBy: { sortOrder: 'asc' },
        },
        invoices: {
          orderBy: { issueDate: 'desc' },
          include: { payments: true },
        },
      },
    });

    if (!subscription) {
      throw new Error('Subscription not found');
    }

    return subscription;
  }

  static async createSubscription(data: any, userId?: string) {
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: data.planId },
    });
    if (!plan) throw new Error('Subscription plan not found');

    const taxRuleIds = data.lines.map((l: any) => l.taxRuleId).filter(Boolean);
    const taxRules = await prisma.taxRule.findMany({
      where: { id: { in: taxRuleIds } },
    });
    const taxRuleMap = new Map(taxRules.map((t) => [t.id, t.rate]));

    let subtotal = 0;
    let taxAmount = 0;

    const computedLines = data.lines.map((line: any, idx: number) => {
      const lineSubtotal = line.quantity * line.unitPrice;
      const taxRate = line.taxRuleId ? taxRuleMap.get(line.taxRuleId) || 0 : 0;
      const lineTax = calculateTaxAmount(lineSubtotal, taxRate);
      const lineTotal = lineSubtotal + lineTax;

      subtotal += lineSubtotal;
      taxAmount += lineTax;

      return {
        productId: line.productId,
        variantId: line.variantId || null,
        taxRuleId: line.taxRuleId || null,
        description: line.description || null,
        quantity: line.quantity,
        unitPrice: line.unitPrice,
        taxRate,
        lineTotal,
        sortOrder: line.sortOrder ?? idx,
      };
    });

    const total = subtotal + taxAmount;
    const number = await this.generateSubscriptionNumber();
    const startDate = new Date(data.startDate);
    const nextBillingDate = this.calculateNextBillingDate(startDate, plan.billingFrequency);

    const subscription = await prisma.subscription.create({
      data: {
        number,
        customerId: data.customerId,
        planId: data.planId,
        status: 'DRAFT',
        startDate,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
        nextBillingDate,
        paymentTerms: data.paymentTerms,
        notes: data.notes,
        subtotal,
        taxAmount,
        total,
        lines: { create: computedLines },
      },
      include: {
        customer: true,
        plan: true,
        lines: { include: { product: true, variant: true, taxRule: true } },
      },
    });

    await createAuditLog({
      userId,
      action: 'SUBSCRIPTION_CREATED',
      entity: 'Subscription',
      entityId: subscription.id,
      details: { number: subscription.number, total: subscription.total },
    });

    return subscription;
  }

  static async updateSubscription(id: string, data: any, userId?: string) {
    const subscription = await prisma.subscription.update({
      where: { id },
      data: {
        ...(data.planId && { planId: data.planId }),
        ...(data.expiryDate !== undefined && { expiryDate: data.expiryDate ? new Date(data.expiryDate) : null }),
        ...(data.paymentTerms !== undefined && { paymentTerms: data.paymentTerms }),
        ...(data.notes !== undefined && { notes: data.notes }),
      },
      include: { customer: true, plan: true, lines: true },
    });

    await createAuditLog({
      userId,
      action: 'SUBSCRIPTION_UPDATED',
      entity: 'Subscription',
      entityId: id,
      details: data,
    });

    return subscription;
  }

  // State Machine transitions
  static async confirm(id: string, userId?: string) {
    const sub = await prisma.subscription.findUnique({ where: { id } });
    if (!sub) throw new Error('Subscription not found');
    if (sub.status !== 'DRAFT') {
      throw new Error(`Can only confirm from DRAFT. Current status: ${sub.status}`);
    }

    const updated = await prisma.subscription.update({
      where: { id },
      data: { status: 'CONFIRMED' },
    });

    await createAuditLog({
      userId,
      action: 'SUBSCRIPTION_CONFIRMED',
      entity: 'Subscription',
      entityId: id,
    });

    return updated;
  }

  static async activate(id: string, userId?: string) {
    const sub = await prisma.subscription.findUnique({
      where: { id },
      include: { plan: true },
    });
    if (!sub) throw new Error('Subscription not found');
    if (sub.status !== 'CONFIRMED' && sub.status !== 'DRAFT') {
      throw new Error(`Can only activate from DRAFT or CONFIRMED. Current status: ${sub.status}`);
    }

    const updated = await prisma.subscription.update({
      where: { id },
      data: {
        status: 'ACTIVE',
        nextBillingDate: sub.nextBillingDate || this.calculateNextBillingDate(new Date(), sub.plan.billingFrequency),
      },
      include: { plan: true, customer: true },
    });

    await createAuditLog({
      userId,
      action: 'SUBSCRIPTION_ACTIVATED',
      entity: 'Subscription',
      entityId: id,
    });

    return updated;
  }

  static async pause(id: string, userId?: string) {
    const sub = await prisma.subscription.findUnique({
      where: { id },
      include: { plan: true },
    });
    if (!sub) throw new Error('Subscription not found');
    if (sub.status !== 'ACTIVE') {
      throw new Error(`Can only pause an ACTIVE subscription. Current: ${sub.status}`);
    }
    if (!sub.plan.allowPause) {
      throw new Error('Subscription plan does not permit pausing');
    }

    const updated = await prisma.subscription.update({
      where: { id },
      data: { status: 'PAUSED' },
    });

    await createAuditLog({
      userId,
      action: 'SUBSCRIPTION_PAUSED',
      entity: 'Subscription',
      entityId: id,
    });

    return updated;
  }

  static async resume(id: string, userId?: string) {
    const sub = await prisma.subscription.findUnique({
      where: { id },
      include: { plan: true },
    });
    if (!sub) throw new Error('Subscription not found');
    if (sub.status !== 'PAUSED') {
      throw new Error(`Can only resume a PAUSED subscription. Current: ${sub.status}`);
    }

    // Adjust next billing date if paused in the past
    const nextBillingDate = this.calculateNextBillingDate(new Date(), sub.plan.billingFrequency);

    const updated = await prisma.subscription.update({
      where: { id },
      data: {
        status: 'ACTIVE',
        nextBillingDate,
      },
    });

    await createAuditLog({
      userId,
      action: 'SUBSCRIPTION_RESUMED',
      entity: 'Subscription',
      entityId: id,
    });

    return updated;
  }

  static async close(id: string, userId?: string) {
    const sub = await prisma.subscription.findUnique({
      where: { id },
      include: { plan: true },
    });
    if (!sub) throw new Error('Subscription not found');
    if (sub.status === 'CLOSED') {
      throw new Error('Subscription is already closed');
    }

    // Check early closure rule if subscription is still before expiryDate
    if (sub.expiryDate && sub.expiryDate > new Date() && !sub.plan.allowEarlyClosure) {
      throw new Error('Plan does not permit early closure before expiration date');
    }

    const updated = await prisma.subscription.update({
      where: { id },
      data: { status: 'CLOSED' },
    });

    await createAuditLog({
      userId,
      action: 'SUBSCRIPTION_CLOSED',
      entity: 'Subscription',
      entityId: id,
    });

    return updated;
  }

  static async renew(id: string, userId?: string) {
    const sub = await prisma.subscription.findUnique({
      where: { id },
      include: { plan: true },
    });
    if (!sub) throw new Error('Subscription not found');
    if (!sub.plan.allowRenewal) {
      throw new Error('Subscription plan does not permit renewals');
    }

    const baseDate = sub.expiryDate && sub.expiryDate > new Date() ? sub.expiryDate : new Date();
    const newExpiry = this.calculateNextBillingDate(baseDate, sub.plan.billingFrequency);
    const newBilling = this.calculateNextBillingDate(new Date(), sub.plan.billingFrequency);

    const updated = await prisma.subscription.update({
      where: { id },
      data: {
        status: 'ACTIVE',
        expiryDate: newExpiry,
        nextBillingDate: newBilling,
      },
      include: { plan: true, customer: true },
    });

    await createAuditLog({
      userId,
      action: 'SUBSCRIPTION_RENEWED',
      entity: 'Subscription',
      entityId: id,
      details: { newExpiry, newBilling },
    });

    return updated;
  }
}

