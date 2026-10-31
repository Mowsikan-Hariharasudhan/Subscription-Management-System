import { prisma } from '../config/prisma';
import { createAuditLog } from '../utils/auditLog';

export class DiscountService {
  static async listDiscounts(includeInactive = false) {
    return prisma.discountRule.findMany({
      where: includeInactive ? {} : { isActive: true },
      include: {
        applicableProducts: { include: { product: true } },
        _count: { select: { redemptions: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getDiscountById(id: string) {
    const discount = await prisma.discountRule.findUnique({
      where: { id },
      include: {
        applicableProducts: { include: { product: true } },
        redemptions: {
          take: 20,
          orderBy: { createdAt: 'desc' },
          include: { invoice: { include: { customer: true } } },
        },
      },
    });

    if (!discount) {
      throw new Error('Discount rule not found');
    }

    return discount;
  }

  static async createDiscount(data: any, userId?: string) {
    const discount = await prisma.discountRule.create({
      data: {
        name: data.name,
        type: data.type,
        value: data.value,
        minPurchaseAmount: data.minPurchaseAmount ?? 0,
        minQuantity: data.minQuantity ?? 1,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        maxUsageCount: data.maxUsageCount ?? null,
        isActive: data.isActive ?? true,
        applicableProducts: data.productIds?.length
          ? {
              create: data.productIds.map((productId: string) => ({ productId })),
            }
          : undefined,
      },
      include: {
        applicableProducts: { include: { product: true } },
      },
    });

    await createAuditLog({
      userId,
      action: 'DISCOUNT_RULE_CREATED',
      entity: 'DiscountRule',
      entityId: discount.id,
      details: discount,
    });

    return discount;
  }

  static async updateDiscount(id: string, data: any, userId?: string) {
    const updateData: any = { ...data };
    if (data.startDate !== undefined) {
      updateData.startDate = data.startDate ? new Date(data.startDate) : null;
    }
    if (data.endDate !== undefined) {
      updateData.endDate = data.endDate ? new Date(data.endDate) : null;
    }

    delete updateData.productIds;

    const discount = await prisma.$transaction(async (tx) => {
      if (data.productIds) {
        await tx.discountProduct.deleteMany({ where: { discountRuleId: id } });
        if (data.productIds.length > 0) {
          await tx.discountProduct.createMany({
            data: data.productIds.map((productId: string) => ({
              discountRuleId: id,
              productId,
            })),
          });
        }
      }

      return tx.discountRule.update({
        where: { id },
        data: updateData,
        include: {
          applicableProducts: { include: { product: true } },
        },
      });
    });

    await createAuditLog({
      userId,
      action: 'DISCOUNT_RULE_UPDATED',
      entity: 'DiscountRule',
      entityId: id,
      details: data,
    });

    return discount;
  }

  static async deleteDiscount(id: string, userId?: string) {
    const discount = await prisma.discountRule.update({
      where: { id },
      data: { isActive: false },
    });

    await createAuditLog({
      userId,
      action: 'DISCOUNT_RULE_DEACTIVATED',
      entity: 'DiscountRule',
      entityId: id,
    });

    return discount;
  }

  static async getRedemptions(id: string) {
    return prisma.discountRedemption.findMany({
      where: { discountRuleId: id },
      orderBy: { createdAt: 'desc' },
      include: {
        invoice: {
          include: { customer: true, subscription: { include: { plan: true } } },
        },
      },
    });
  }
}

