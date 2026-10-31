import { addDays, addWeeks, addMonths, addYears } from 'date-fns';
import { prisma } from '../config/prisma';
import { calculateTaxAmount, calculateDiscountAmount } from '../utils/currency';
import { createAuditLog } from '../utils/auditLog';

export interface BillingRunResult {
  processed: number;
  invoicesCreated: number;
  skipped: number;
  errors: string[];
  invoiceIds: string[];
}

export class BillingService {
  private static calculatePeriodEnd(start: Date, frequency: string): Date {
    switch (frequency) {
      case 'DAILY':
        return start;
      case 'WEEKLY':
        return addDays(addWeeks(start, 1), -1);
      case 'YEARLY':
        return addDays(addYears(start, 1), -1);
      case 'MONTHLY':
      default:
        return addDays(addMonths(start, 1), -1);
    }
  }

  private static calculateNextBillingDate(current: Date, frequency: string): Date {
    switch (frequency) {
      case 'DAILY':
        return addDays(current, 1);
      case 'WEEKLY':
        return addWeeks(current, 1);
      case 'YEARLY':
        return addYears(current, 1);
      case 'MONTHLY':
      default:
        return addMonths(current, 1);
    }
  }

  private static async generateInvoiceNumber(): Promise<string> {
    const yearMonth = `${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}`;
    const count = await prisma.invoice.count();
    const sequence = String(count + 1).padStart(4, '0');
    return `INV-${yearMonth}-${sequence}`;
  }

  static async runBillingCycle(opts?: { subscriptionId?: string }): Promise<BillingRunResult> {
    const now = new Date();
    const result: BillingRunResult = {
      processed: 0,
      invoicesCreated: 0,
      skipped: 0,
      errors: [],
      invoiceIds: [],
    };

    const where: any = {
      status: 'ACTIVE',
      nextBillingDate: { lte: now },
      ...(opts?.subscriptionId && { id: opts.subscriptionId }),
    };

    // Query active subscriptions in batches
    const subscriptions = await prisma.subscription.findMany({
      where,
      take: 100,
      include: {
        plan: true,
        customer: true,
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

    for (const subscription of subscriptions) {
      result.processed++;
      const periodStart = subscription.nextBillingDate || subscription.startDate;
      const periodEnd = this.calculatePeriodEnd(periodStart, subscription.plan.billingFrequency);
      const dueDate = addDays(periodEnd, 15); // Net 15 terms default

      // 1. Check idempotency: no existing invoice for (subscriptionId, periodStart)
      const existing = await prisma.invoice.findUnique({
        where: {
          subscriptionId_periodStart: {
            subscriptionId: subscription.id,
            periodStart,
          },
        },
      });

      if (existing) {
        result.skipped++;
        // Advance billing date if it was somehow stuck
        const advancedDate = this.calculateNextBillingDate(periodStart, subscription.plan.billingFrequency);
        await prisma.subscription.update({
          where: { id: subscription.id },
          data: { nextBillingDate: advancedDate },
        });
        continue;
      }

      try {
        await prisma.$transaction(async (tx) => {
          let subtotal = 0;
          let taxAmount = 0;
          let totalQty = 0;
          const productIdsInSub: string[] = [];

          // Compute lines
          const invoiceLinesData = subscription.lines.map((line, idx) => {
            const unitPrice = line.unitPrice;
            const variantPrice = line.variant?.additionalPrice || 0;
            const taxRate = line.taxRule?.rate || line.taxRate || 0;
            const basePrice = line.quantity * (unitPrice + variantPrice);
            const lineTax = calculateTaxAmount(basePrice, taxRate);
            const lineTotal = basePrice + lineTax;

            subtotal += basePrice;
            taxAmount += lineTax;
            totalQty += line.quantity;
            productIdsInSub.push(line.productId);

            return {
              productId: line.productId,
              variantId: line.variantId,
              taxRuleId: line.taxRuleId,
              description: line.description || `${line.product.name}${line.variant ? ` (${line.variant.name})` : ''}`,
              quantity: line.quantity,
              unitPrice,
              variantPrice,
              taxRate,
              taxAmount: lineTax,
              lineTotal,
              sortOrder: line.sortOrder ?? idx,
            };
          });

          // Check eligible discounts
          const eligibleDiscounts = await tx.discountRule.findMany({
            where: {
              isActive: true,
              OR: [
                { startDate: null },
                { startDate: { lte: now } },
              ],
              AND: [
                {
                  OR: [
                    { endDate: null },
                    { endDate: { gte: now } },
                  ],
                },
              ],
            },
            include: { applicableProducts: true },
          });

          let totalDiscount = 0;
          const redemptionsToCreate: { discountRuleId: string; amountApplied: number }[] = [];
          const rulesToIncrement: string[] = [];

          for (const rule of eligibleDiscounts) {
            // Check max usage
            if (rule.maxUsageCount && rule.currentUsageCount >= rule.maxUsageCount) {
              continue;
            }

            // Check min purchase amount & quantity
            if (subtotal < rule.minPurchaseAmount || totalQty < rule.minQuantity) {
              continue;
            }

            // Check applicable products
            if (rule.applicableProducts.length > 0) {
              const ruleProductIds = rule.applicableProducts.map((p) => p.productId);
              const hasMatch = productIdsInSub.some((pid) => ruleProductIds.includes(pid));
              if (!hasMatch) continue;
            }

            const discount = calculateDiscountAmount(subtotal, rule.type, rule.value);
            if (discount > 0 && totalDiscount + discount <= subtotal) {
              totalDiscount += discount;
              redemptionsToCreate.push({
                discountRuleId: rule.id,
                amountApplied: discount,
              });
              rulesToIncrement.push(rule.id);
            }
          }

          const invoiceTotal = Math.max(0, subtotal - totalDiscount + taxAmount);
          const invNumber = await this.generateInvoiceNumber();

          const invoice = await tx.invoice.create({
            data: {
              number: invNumber,
              customerId: subscription.customerId,
              subscriptionId: subscription.id,
              status: 'CONFIRMED',
              periodStart,
              periodEnd,
              issueDate: now,
              dueDate,
              subtotal,
              discountAmt: totalDiscount,
              taxAmount,
              total: invoiceTotal,
              amountPaid: 0,
              outstanding: invoiceTotal,
              lines: {
                create: invoiceLinesData,
              },
            },
          });

          // Record discount redemptions & increment rule usage
          for (const redemption of redemptionsToCreate) {
            await tx.discountRedemption.create({
              data: {
                discountRuleId: redemption.discountRuleId,
                invoiceId: invoice.id,
                amountApplied: redemption.amountApplied,
              },
            });
          }

          for (const ruleId of rulesToIncrement) {
            await tx.discountRule.update({
              where: { id: ruleId },
              data: { currentUsageCount: { increment: 1 } },
            });
          }

          // Advance subscription nextBillingDate
          const nextBillingDate = this.calculateNextBillingDate(periodStart, subscription.plan.billingFrequency);
          
          // Check auto close condition
          let newStatus = subscription.status;
          if (
            subscription.plan.autoClose &&
            subscription.expiryDate &&
            nextBillingDate >= subscription.expiryDate
          ) {
            newStatus = 'CLOSED';
          }

          await tx.subscription.update({
            where: { id: subscription.id },
            data: {
              nextBillingDate,
              status: newStatus,
            },
          });

          result.invoicesCreated++;
          result.invoiceIds.push(invoice.id);
        });

        await createAuditLog({
          action: 'BILLING_CYCLE_INVOICE_GENERATED',
          entity: 'Subscription',
          entityId: subscription.id,
          details: { periodStart, periodEnd },
        });
      } catch (err: any) {
        console.error(`Billing error for subscription ${subscription.id}:`, err);
        result.errors.push(`Subscription ${subscription.id}: ${err.message}`);
      }
    }

    return result;
  }
}

