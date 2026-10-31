import { addDays, addWeeks, addMonths, addYears } from 'date-fns';
import { prisma } from '../config/prisma';
import { getPaginationParams } from '../utils/pagination';
import { calculateTaxAmount } from '../utils/currency';
import { createAuditLog } from '../utils/auditLog';

export class QuotationService {
  private static async generateQuotationNumber(): Promise<string> {
    const yearMonth = `${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}`;
    const count = await prisma.quotation.count();
    const sequence = String(count + 1).padStart(4, '0');
    return `QT-${yearMonth}-${sequence}`;
  }

  static async listQuotations(query: any) {
    const { page, limit, skip } = getPaginationParams(query);
    const customerId = query.customerId ? String(query.customerId) : undefined;
    const status = query.status ? String(query.status) : undefined;
    const search = query.search ? String(query.search).trim() : undefined;

    const where: any = {
      ...(customerId && { customerId }),
      ...(status && { status }),
      ...(search && {
        OR: [
          { number: { contains: search } },
          { customer: { name: { contains: search } } },
          { customer: { companyName: { contains: search } } },
        ],
      }),
    };

    const [total, quotations] = await Promise.all([
      prisma.quotation.count({ where }),
      prisma.quotation.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          customer: true,
          plan: true,
          subscription: { select: { id: true, number: true, status: true } },
          _count: { select: { lines: true } },
        },
      }),
    ]);

    return { quotations, total, page, limit };
  }

  static async getQuotationById(id: string) {
    const quotation = await prisma.quotation.findUnique({
      where: { id },
      include: {
        customer: true,
        plan: true,
        template: true,
        subscription: true,
        lines: {
          include: {
            product: true,
            variant: true,
            taxRule: true,
          },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!quotation) {
      throw new Error('Quotation not found');
    }

    return quotation;
  }

  static async createQuotation(data: any, userId?: string) {
    let subtotal = 0;
    let taxAmount = 0;

    // Fetch tax rules if needed
    const taxRuleIds = data.lines.map((l: any) => l.taxRuleId).filter(Boolean);
    const taxRules = await prisma.taxRule.findMany({
      where: { id: { in: taxRuleIds } },
    });
    const taxRuleMap = new Map(taxRules.map((t) => [t.id, t.rate]));

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
        taxAmount: lineTax,
        lineTotal,
        sortOrder: line.sortOrder ?? idx,
      };
    });

    const discountAmt = Math.min(subtotal, data.discountAmt || 0);
    const total = Math.max(0, subtotal - discountAmt + taxAmount);
    const number = await this.generateQuotationNumber();

    const quotation = await prisma.quotation.create({
      data: {
        number,
        customerId: data.customerId,
        planId: data.planId || null,
        templateId: data.templateId || null,
        status: 'DRAFT',
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
        paymentTerms: data.paymentTerms,
        notes: data.notes,
        subtotal,
        discountAmt,
        taxAmount,
        total,
        lines: {
          create: computedLines,
        },
      },
      include: {
        customer: true,
        plan: true,
        lines: { include: { product: true, variant: true, taxRule: true } },
      },
    });

    await createAuditLog({
      userId,
      action: 'QUOTATION_CREATED',
      entity: 'Quotation',
      entityId: quotation.id,
      details: { number: quotation.number, total: quotation.total },
    });

    return quotation;
  }

  static async updateQuotation(id: string, data: any, userId?: string) {
    const existing = await prisma.quotation.findUnique({
      where: { id },
      include: { lines: true },
    });

    if (!existing) {
      throw new Error('Quotation not found');
    }

    if (existing.status !== 'DRAFT' && existing.status !== 'SENT') {
      throw new Error(`Cannot update quotation in status: ${existing.status}`);
    }

    const updated = await prisma.$transaction(async (tx) => {
      let subtotal = existing.subtotal;
      let taxAmount = existing.taxAmount;

      if (data.lines) {
        await tx.quotationLine.deleteMany({ where: { quotationId: id } });

        const taxRuleIds = data.lines.map((l: any) => l.taxRuleId).filter(Boolean);
        const taxRules = await tx.taxRule.findMany({
          where: { id: { in: taxRuleIds } },
        });
        const taxRuleMap = new Map(taxRules.map((t) => [t.id, t.rate]));

        subtotal = 0;
        taxAmount = 0;

        const computedLines = data.lines.map((line: any, idx: number) => {
          const lineSubtotal = line.quantity * line.unitPrice;
          const taxRate = line.taxRuleId ? taxRuleMap.get(line.taxRuleId) || 0 : 0;
          const lineTax = calculateTaxAmount(lineSubtotal, taxRate);
          const lineTotal = lineSubtotal + lineTax;

          subtotal += lineSubtotal;
          taxAmount += lineTax;

          return {
            quotationId: id,
            productId: line.productId,
            variantId: line.variantId || null,
            taxRuleId: line.taxRuleId || null,
            description: line.description || null,
            quantity: line.quantity,
            unitPrice: line.unitPrice,
            taxRate,
            taxAmount: lineTax,
            lineTotal,
            sortOrder: line.sortOrder ?? idx,
          };
        });

        await tx.quotationLine.createMany({ data: computedLines });
      }

      const discountAmt = data.discountAmt !== undefined ? data.discountAmt : existing.discountAmt;
      const total = Math.max(0, subtotal - discountAmt + taxAmount);

      return tx.quotation.update({
        where: { id },
        data: {
          ...(data.planId !== undefined && { planId: data.planId }),
          ...(data.expiryDate !== undefined && { expiryDate: data.expiryDate ? new Date(data.expiryDate) : null }),
          ...(data.paymentTerms !== undefined && { paymentTerms: data.paymentTerms }),
          ...(data.notes !== undefined && { notes: data.notes }),
          subtotal,
          discountAmt,
          taxAmount,
          total,
        },
        include: {
          customer: true,
          plan: true,
          lines: { include: { product: true, variant: true, taxRule: true } },
        },
      });
    });

    await createAuditLog({
      userId,
      action: 'QUOTATION_UPDATED',
      entity: 'Quotation',
      entityId: id,
      details: data,
    });

    return updated;
  }

  static async confirmQuotation(id: string, userId?: string) {
    const quotation = await prisma.quotation.findUnique({ where: { id } });
    if (!quotation) throw new Error('Quotation not found');
    if (quotation.status !== 'DRAFT') {
      throw new Error(`Quotation must be in DRAFT to confirm, currently: ${quotation.status}`);
    }

    const updated = await prisma.quotation.update({
      where: { id },
      data: { status: 'SENT' },
      include: { customer: true, plan: true },
    });

    await createAuditLog({
      userId,
      action: 'QUOTATION_CONFIRMED',
      entity: 'Quotation',
      entityId: id,
    });

    return updated;
  }

  static async acceptQuotation(id: string, userId?: string) {
    const quotation = await prisma.quotation.findUnique({ where: { id } });
    if (!quotation) throw new Error('Quotation not found');
    if (quotation.status !== 'SENT') {
      throw new Error(`Quotation must be in SENT to accept, currently: ${quotation.status}`);
    }

    const updated = await prisma.quotation.update({
      where: { id },
      data: { status: 'ACCEPTED' },
      include: { customer: true, plan: true },
    });

    await createAuditLog({
      userId,
      action: 'QUOTATION_ACCEPTED',
      entity: 'Quotation',
      entityId: id,
    });

    return updated;
  }

  static async declineQuotation(id: string, userId?: string) {
    const quotation = await prisma.quotation.findUnique({ where: { id } });
    if (!quotation) throw new Error('Quotation not found');

    const updated = await prisma.quotation.update({
      where: { id },
      data: { status: 'DECLINED' },
    });

    await createAuditLog({
      userId,
      action: 'QUOTATION_DECLINED',
      entity: 'Quotation',
      entityId: id,
    });

    return updated;
  }

  static async convertToSubscription(id: string, userId?: string) {
    const quotation = await prisma.quotation.findUnique({
      where: { id },
      include: {
        plan: true,
        lines: {
          include: { product: true, variant: true, taxRule: true },
        },
      },
    });

    if (!quotation) {
      throw new Error('Quotation not found');
    }

    if (quotation.status !== 'ACCEPTED') {
      throw new Error('Only ACCEPTED quotations can be converted to subscriptions');
    }

    if (!quotation.planId || !quotation.plan) {
      throw new Error('Cannot convert quotation without an associated Subscription Plan');
    }

    // Check if already converted
    const existingSub = await prisma.subscription.findUnique({
      where: { quotationId: id },
    });
    if (existingSub) {
      throw new Error(`Quotation already converted to subscription: ${existingSub.number}`);
    }

    const startDate = new Date();
    let nextBillingDate: Date;

    switch (quotation.plan.billingFrequency) {
      case 'DAILY':
        nextBillingDate = addDays(startDate, 1);
        break;
      case 'WEEKLY':
        nextBillingDate = addWeeks(startDate, 1);
        break;
      case 'YEARLY':
        nextBillingDate = addYears(startDate, 1);
        break;
      case 'MONTHLY':
      default:
        nextBillingDate = addMonths(startDate, 1);
        break;
    }

    const subNumberYearMonth = `${startDate.getFullYear()}${String(startDate.getMonth() + 1).padStart(2, '0')}`;
    const subCount = await prisma.subscription.count();
    const subNumber = `SUB-${subNumberYearMonth}-${String(subCount + 1).padStart(4, '0')}`;

    const subscription = await prisma.$transaction(async (tx) => {
      const sub = await tx.subscription.create({
        data: {
          number: subNumber,
          customerId: quotation.customerId,
          planId: quotation.planId!,
          quotationId: quotation.id,
          status: 'ACTIVE',
          startDate,
          nextBillingDate,
          paymentTerms: quotation.paymentTerms,
          notes: quotation.notes,
          subtotal: quotation.subtotal,
          taxAmount: quotation.taxAmount,
          total: quotation.total,
          lines: {
            create: quotation.lines.map((l) => ({
              productId: l.productId,
              variantId: l.variantId,
              taxRuleId: l.taxRuleId,
              description: l.description,
              quantity: l.quantity,
              unitPrice: l.unitPrice,
              taxRate: l.taxRate,
              lineTotal: l.lineTotal,
              sortOrder: l.sortOrder,
            })),
          },
        },
        include: {
          plan: true,
          customer: true,
          lines: { include: { product: true, variant: true, taxRule: true } },
        },
      });

      return sub;
    });

    await createAuditLog({
      userId,
      action: 'QUOTATION_CONVERTED_TO_SUBSCRIPTION',
      entity: 'Subscription',
      entityId: subscription.id,
      details: { quotationId: id, subscriptionNumber: subscription.number },
    });

    return subscription;
  }
}

