import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma.js';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/invoices - List invoices
router.get('/', requireAuth, async (req: AuthenticatedRequest, res): Promise<void> => {
  try {
    const user = req.user!;
    const isCustomer = user.role === 'CUSTOMER';
    const status = req.query.status as string;

    const where: any = isCustomer ? { customerId: user.customerId || 'none' } : {};
    if (status && status !== 'ALL') {
      where.state = status;
    }

    const invoices = await prisma.invoice.findMany({
      where,
      orderBy: { issueDate: 'desc' },
      include: {
        customer: {
          select: { id: true, code: true, name: true, company: true },
        },
        subscription: {
          select: { id: true, code: true },
        },
      },
    });

    res.json({ invoices });
  } catch (err: any) {
    console.error('List invoices error:', err);
    res.status(500).json({ error: 'Failed to list invoices' });
  }
});

// GET /api/invoices/:id - Get invoice detail
router.get('/:id', requireAuth, async (req: AuthenticatedRequest, res): Promise<void> => {
  try {
    const user = req.user!;
    const invoice = await prisma.invoice.findUnique({
      where: { id: req.params.id },
      include: {
        customer: true,
        subscription: {
          include: { plan: true },
        },
        payments: {
          orderBy: { paidAt: 'desc' },
        },
      },
    });

    if (!invoice) {
      res.status(404).json({ error: 'Invoice not found' });
      return;
    }

    if (user.role === 'CUSTOMER' && invoice.customerId !== user.customerId) {
      res.status(404).json({ error: 'Invoice not found' });
      return;
    }

    res.json({ invoice });
  } catch (err: any) {
    console.error('Get invoice error:', err);
    res.status(500).json({ error: 'Failed to retrieve invoice' });
  }
});

// POST /api/invoices/:id/pay - Record payment on invoice (atomic Prisma transaction)
router.post('/:id/pay', requireAuth, async (req: AuthenticatedRequest, res): Promise<void> => {
  try {
    const PaymentSchema = z.object({
      amount: z.number().int().positive(), // Integer paise
      method: z.enum(['UPI', 'CASH', 'CARD', 'BANK_TRANSFER', 'OTHER']).default('UPI'),
      reference: z.string().min(1),
      notes: z.string().optional(),
    });

    const parse = PaymentSchema.safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({ error: 'Validation failed', details: parse.error.format() });
      return;
    }

    const { amount, method, reference, notes } = parse.data;
    const invoiceId = req.params.id;

    const result = await prisma.$transaction(async (tx) => {
      const invoice = await tx.invoice.findUnique({
        where: { id: invoiceId },
      });

      if (!invoice) {
        throw new Error('Invoice not found');
      }

      const remainingPaise = invoice.total - invoice.amountPaid;
      if (remainingPaise <= 0) {
        throw new Error('Invoice is already fully settled');
      }

      if (amount > remainingPaise) {
        throw new Error(`Amount ₹${(amount / 100).toFixed(2)} exceeds remaining balance ₹${(remainingPaise / 100).toFixed(2)}`);
      }

      const payCount = await tx.payment.count();
      const payNumber = `PAY-2026-${String(payCount + 1).padStart(6, '0')}`;

      const payment = await tx.payment.create({
        data: {
          number: payNumber,
          invoiceId,
          amount,
          method,
          reference,
          notes,
          paidAt: new Date(),
        },
      });

      const newAmountPaid = invoice.amountPaid + amount;
      const newState = newAmountPaid >= invoice.total ? 'PAID' : 'PARTIALLY_PAID';

      const updatedInvoice = await tx.invoice.update({
        where: { id: invoiceId },
        data: {
          amountPaid: newAmountPaid,
          state: newState,
        },
      });

      await tx.auditLog.create({
        data: {
          userId: req.user?.id,
          action: 'PAYMENT_RECORDED',
          entity: 'Payment',
          entityId: payment.id,
          changes: JSON.stringify({
            invoiceCode: invoice.code,
            amountPaise: amount,
            newInvoiceState: newState,
            method,
          }),
        },
      });

      return { payment, invoice: updatedInvoice };
    });

    res.status(201).json(result);
  } catch (err: any) {
    console.error('Record payment error:', err);
    res.status(400).json({ error: err.message || 'Failed to record payment' });
  }
});

export default router;
