import { prisma } from '../config/prisma';
import { createAuditLog } from '../utils/auditLog';

export class PlanService {
  static async listPlans(includeInactive = false) {
    return prisma.subscriptionPlan.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { subscriptions: true },
        },
      },
    });
  }

  static async getPlanById(id: string) {
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id },
      include: {
        _count: {
          select: { subscriptions: true, quotations: true },
        },
      },
    });
    if (!plan) {
      throw new Error('Subscription plan not found');
    }
    return plan;
  }

  static async createPlan(data: any, userId?: string) {
    const plan = await prisma.subscriptionPlan.create({
      data: {
        name: data.name,
        description: data.description,
        billingFrequency: data.billingFrequency,
        minimumQuantity: data.minimumQuantity ?? 1,
        availableFrom: data.availableFrom ? new Date(data.availableFrom) : null,
        availableUntil: data.availableUntil ? new Date(data.availableUntil) : null,
        autoClose: data.autoClose ?? false,
        allowEarlyClosure: data.allowEarlyClosure ?? true,
        allowPause: data.allowPause ?? false,
        allowRenewal: data.allowRenewal ?? true,
        isActive: data.isActive ?? true,
      },
    });

    await createAuditLog({
      userId,
      action: 'PLAN_CREATED',
      entity: 'SubscriptionPlan',
      entityId: plan.id,
      details: plan,
    });

    return plan;
  }

  static async updatePlan(id: string, data: any, userId?: string) {
    const updateData: any = { ...data };
    if (data.availableFrom !== undefined) {
      updateData.availableFrom = data.availableFrom ? new Date(data.availableFrom) : null;
    }
    if (data.availableUntil !== undefined) {
      updateData.availableUntil = data.availableUntil ? new Date(data.availableUntil) : null;
    }

    const plan = await prisma.subscriptionPlan.update({
      where: { id },
      data: updateData,
    });

    await createAuditLog({
      userId,
      action: 'PLAN_UPDATED',
      entity: 'SubscriptionPlan',
      entityId: id,
      details: data,
    });

    return plan;
  }

  static async deletePlan(id: string, userId?: string) {
    const plan = await prisma.subscriptionPlan.update({
      where: { id },
      data: { isActive: false },
    });

    await createAuditLog({
      userId,
      action: 'PLAN_DEACTIVATED',
      entity: 'SubscriptionPlan',
      entityId: id,
    });

    return plan;
  }
}

