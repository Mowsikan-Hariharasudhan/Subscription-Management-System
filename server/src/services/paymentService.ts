import { prisma } from '../config/prisma';
import { getPaginationParams } from '../utils/pagination';
import { createAuditLog } from '../utils/auditLog';
import { PaymentMethod } from '../types';

export interface RecordPaymentDTO {
  invoiceId: string;
  amount: number; // in paise
  method: PaymentMethod;
  notes?: string;
  paymentDate?: string;
}

export class PaymentService {
  static async recordPayment(dto: RecordPaymentDTO, userId: string) {
    if (dto.amount <= 0) {
      throw new Error('Payment amount must be greater than zero');
    }

    const invoice = await prisma.invoice.findUnique({
      where: { id: dto.invoiceId },
      include: { customer: true, payments: true },
    });

    if (!invoice) {
      throw new Error('Invoice not found');
    }

    if (invoice.status !== 'CONFIRMED') {
      throw new Error(`Payments can only be recorded against CONFIRMED invoices. Current status: ${invoice.status}`);
    }

    if (dto.amount > invoice.outstanding) {
      throw new Error(
        `Payment amount (₹${(dto.amount / 100).toFixed(2)}) cannot exceed outstanding balance (₹${(invoice.outstanding / 100).toFixed(2)})`
      );
    }

    const paymentDate = dto.paymentDate ? new Date(dto.paymentDate) : new Date();

    const payment = await prisma.$transaction(async (tx) => {
      const newPayment = await tx.payment.create({
        data: {
          invoiceId: dto.invoiceId,
          createdById: userId,
          method: dto.method as any,
          amount: dto.amount,
          paymentDate,
          notes: dto.notes,
        },
        include: {
          invoice: { include: { customer: true } },
          createdBy: { select: { id: true, email: true } },
        },
      });

      const newAmountPaid = invoice.amountPaid + dto.amount;
      const newOutstanding = invoice.total - newAmountPaid;
      const isPaid = newOutstanding === 0;

      await tx.invoice.update({
        where: { id: dto.invoiceId },
        data: {
          amountPaid: newAmountPaid,
          outstanding: Math.max(0, newOutstanding),
          status: isPaid ? 'PAID' : 'CONFIRMED',
        },
      });

      return newPayment;
    });

    await createAuditLog({
      userId,
      action: 'PAYMENT_RECORDED',
      entity: 'Payment',
      entityId: payment.id,
      details: {
        invoiceId: dto.invoiceId,
        invoiceNumber: invoice.number,
        amount: dto.amount,
        method: dto.method,
      },
    });

    return payment;
  }

  static async listPayments(query: any) {
    const { page, limit, skip } = getPaginationParams(query);
    const invoiceId = query.invoiceId ? String(query.invoiceId) : undefined;
    const customerId = query.customerId ? String(query.customerId) : undefined;
    const method = query.method ? String(query.method) : undefined;
    const search = query.search ? String(query.search).trim() : undefined;

    const where: any = {
      ...(invoiceId && { invoiceId }),
      ...(customerId && { invoice: { customerId } }),
      ...(method && { method }),
      ...(search && {
        OR: [
          { invoice: { number: { contains: search } } },
          { invoice: { customer: { name: { contains: search } } } },
          { invoice: { customer: { companyName: { contains: search } } } },
        ],
      }),
    };

    const [total, payments] = await Promise.all([
      prisma.payment.count({ where }),
      prisma.payment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { paymentDate: 'desc' },
        include: {
          invoice: {
            include: { customer: true },
          },
          createdBy: {
            select: { id: true, email: true },
          },
        },
      }),
    ]);

    return { payments, total, page, limit };
  }

  static async getPaymentById(id: string) {
    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        invoice: {
          include: { customer: true, subscription: { include: { plan: true } } },
        },
        createdBy: {
          select: { id: true, email: true },
        },
      },
    });

    if (!payment) {
      throw new Error('Payment not found');
    }

    return payment;
  }
}

