import { prisma } from '../config/prisma';
import { getPaginationParams } from '../utils/pagination';
import { createAuditLog } from '../utils/auditLog';

export class InvoiceService {
  static async listInvoices(query: any) {
    const { page, limit, skip } = getPaginationParams(query);
    const customerId = query.customerId ? String(query.customerId) : undefined;
    const subscriptionId = query.subscriptionId ? String(query.subscriptionId) : undefined;
    const status = query.status ? String(query.status) : undefined;
    const search = query.search ? String(query.search).trim() : undefined;
    const startDate = query.startDate ? new Date(query.startDate) : undefined;
    const endDate = query.endDate ? new Date(query.endDate) : undefined;

    const where: any = {
      ...(customerId && { customerId }),
      ...(subscriptionId && { subscriptionId }),
      ...(status && { status }),
      ...(startDate && endDate && {
        issueDate: {
          gte: startDate,
          lte: endDate,
        },
      }),
      ...(search && {
        OR: [
          { number: { contains: search } },
          { customer: { name: { contains: search } } },
          { customer: { companyName: { contains: search } } },
          { subscription: { number: { contains: search } } },
        ],
      }),
    };

    const [total, invoices] = await Promise.all([
      prisma.invoice.count({ where }),
      prisma.invoice.findMany({
        where,
        skip,
        take: limit,
        orderBy: { issueDate: 'desc' },
        include: {
          customer: true,
          subscription: {
            include: { plan: true },
          },
          payments: true,
          _count: { select: { lines: true, payments: true } },
        },
      }),
    ]);

    return { invoices, total, page, limit };
  }

  static async getInvoiceById(id: string) {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        customer: true,
        subscription: {
          include: { plan: true },
        },
        lines: {
          include: { product: true, variant: true, taxRule: true },
          orderBy: { sortOrder: 'asc' },
        },
        payments: {
          orderBy: { paymentDate: 'desc' },
          include: { createdBy: { select: { id: true, email: true } } },
        },
        redemptions: {
          include: { discountRule: true },
        },
      },
    });

    if (!invoice) {
      throw new Error('Invoice not found');
    }

    return invoice;
  }

  static async confirmInvoice(id: string, userId?: string) {
    const invoice = await prisma.invoice.findUnique({ where: { id } });
    if (!invoice) throw new Error('Invoice not found');
    if (invoice.status !== 'DRAFT') {
      throw new Error(`Invoice already in status: ${invoice.status}`);
    }

    const updated = await prisma.invoice.update({
      where: { id },
      data: { status: 'CONFIRMED' },
    });

    await createAuditLog({
      userId,
      action: 'INVOICE_CONFIRMED',
      entity: 'Invoice',
      entityId: id,
    });

    return updated;
  }

  static async cancelInvoice(id: string, userId?: string) {
    const invoice = await prisma.invoice.findUnique({
      where: { id },
      include: { payments: true },
    });
    if (!invoice) throw new Error('Invoice not found');
    if (invoice.status === 'PAID') {
      throw new Error('Cannot cancel a fully paid invoice');
    }
    if (invoice.payments.length > 0) {
      throw new Error('Cannot cancel an invoice with recorded payments');
    }

    const updated = await prisma.invoice.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });

    await createAuditLog({
      userId,
      action: 'INVOICE_CANCELLED',
      entity: 'Invoice',
      entityId: id,
    });

    return updated;
  }
}

