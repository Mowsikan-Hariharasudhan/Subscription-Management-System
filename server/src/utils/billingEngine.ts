import { prisma } from '../prisma.js';

export function calculateMRR(pricePaise: number, billingCycle: string): number {
  switch (billingCycle) {
    case 'DAILY':
      return pricePaise * 30;
    case 'WEEKLY':
      return pricePaise * 4;
    case 'MONTHLY':
      return pricePaise;
    case 'YEARLY':
      return Math.round(pricePaise / 12);
    default:
      return pricePaise;
  }
}

export function computeNextPeriod(startDate: Date, billingCycle: string): { periodEnd: Date; nextBillingDate: Date } {
  const periodEnd = new Date(startDate);
  const nextBilling = new Date(startDate);

  switch (billingCycle) {
    case 'DAILY':
      periodEnd.setDate(periodEnd.getDate() + 1);
      nextBilling.setDate(nextBilling.getDate() + 1);
      break;
    case 'WEEKLY':
      periodEnd.setDate(periodEnd.getDate() + 7);
      nextBilling.setDate(nextBilling.getDate() + 7);
      break;
    case 'MONTHLY':
      periodEnd.setMonth(periodEnd.getMonth() + 1);
      nextBilling.setMonth(nextBilling.getMonth() + 1);
      break;
    case 'YEARLY':
      periodEnd.setFullYear(periodEnd.getFullYear() + 1);
      nextBilling.setFullYear(nextBilling.getFullYear() + 1);
      break;
    default:
      periodEnd.setMonth(periodEnd.getMonth() + 1);
      nextBilling.setMonth(nextBilling.getMonth() + 1);
  }

  return { periodEnd, nextBillingDate: nextBilling };
}

export async function processRecurringBillingRun(): Promise<{ generated: number; skipped: number; errors: number }> {
  const now = new Date();
  
  // Find all active subscriptions whose next billing date has arrived
  const dueSubscriptions = await prisma.subscription.findMany({
    where: {
      state: 'ACTIVE',
      nextBillingDate: { lte: now },
    },
    include: {
      customer: true,
      plan: {
        include: { product: true },
      },
    },
  });

  let generated = 0;
  let skipped = 0;
  let errors = 0;

  for (const sub of dueSubscriptions) {
    try {
      const periodStart = new Date(sub.nextBillingDate);
      const { periodEnd, nextBillingDate } = computeNextPeriod(periodStart, sub.plan.billingCycle);

      // Check if invoice already exists for this exact period (idempotency safety)
      const existing = await prisma.invoice.findFirst({
        where: {
          subscriptionId: sub.id,
          periodStart,
          periodEnd,
        },
      });

      if (existing) {
        skipped++;
        // Advance subscription nextBillingDate so it does not loop
        await prisma.subscription.update({
          where: { id: sub.id },
          data: { nextBillingDate },
        });
        continue;
      }

      await prisma.$transaction(async (tx) => {
        const invCount = await tx.invoice.count();
        const code = `INV-2026-${String(invCount + 1).padStart(6, '0')}`;

        // Standard 18% GST calculation in integer paise
        const subtotal = sub.total;
        const taxTotal = Math.round(subtotal * 0.18);
        const total = subtotal + taxTotal;

        const dueDate = new Date(periodStart);
        dueDate.setDate(dueDate.getDate() + 15); // 15-day payment term

        const lines = JSON.stringify([
          {
            description: `${sub.plan.name} (${periodStart.toLocaleDateString('en-IN')} - ${periodEnd.toLocaleDateString('en-IN')})`,
            amount: subtotal,
            tax: taxTotal,
            total,
          },
        ]);

        await tx.invoice.create({
          data: {
            code,
            subscriptionId: sub.id,
            customerId: sub.customerId,
            state: 'DRAFT',
            periodStart,
            periodEnd,
            issueDate: now,
            dueDate,
            subtotal,
            taxTotal,
            discountTotal: 0,
            total,
            amountPaid: 0,
            lines,
          },
        });

        // Advance subscription next billing date
        await tx.subscription.update({
          where: { id: sub.id },
          data: { nextBillingDate },
        });

        await tx.auditLog.create({
          data: {
            action: 'RECURRING_INVOICE_GENERATED',
            entity: 'Invoice',
            entityId: code,
            changes: JSON.stringify({ subscriptionId: sub.id, total }),
          },
        });
      });

      generated++;
    } catch (err: any) {
      console.error(`Billing error for subscription ${sub.code}:`, err);
      errors++;
    }
  }

  return { generated, skipped, errors };
}

