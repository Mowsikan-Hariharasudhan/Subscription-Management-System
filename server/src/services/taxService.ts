import { prisma } from '../config/prisma';
import { createAuditLog } from '../utils/auditLog';

export class TaxService {
  static async listTaxes(includeInactive = false) {
    return prisma.taxRule.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: { rate: 'asc' },
    });
  }

  static async getTaxById(id: string) {
    const tax = await prisma.taxRule.findUnique({
      where: { id },
    });
    if (!tax) {
      throw new Error('Tax rule not found');
    }
    return tax;
  }

  static async createTax(data: any, userId?: string) {
    const tax = await prisma.taxRule.create({
      data: {
        name: data.name,
        rate: data.rate,
        description: data.description,
        effectiveFrom: data.effectiveFrom ? new Date(data.effectiveFrom) : null,
        effectiveTo: data.effectiveTo ? new Date(data.effectiveTo) : null,
        isActive: data.isActive ?? true,
      },
    });

    await createAuditLog({
      userId,
      action: 'TAX_RULE_CREATED',
      entity: 'TaxRule',
      entityId: tax.id,
      details: tax,
    });

    return tax;
  }

  static async updateTax(id: string, data: any, userId?: string) {
    const updateData: any = { ...data };
    if (data.effectiveFrom !== undefined) {
      updateData.effectiveFrom = data.effectiveFrom ? new Date(data.effectiveFrom) : null;
    }
    if (data.effectiveTo !== undefined) {
      updateData.effectiveTo = data.effectiveTo ? new Date(data.effectiveTo) : null;
    }

    const tax = await prisma.taxRule.update({
      where: { id },
      data: updateData,
    });

    await createAuditLog({
      userId,
      action: 'TAX_RULE_UPDATED',
      entity: 'TaxRule',
      entityId: id,
      details: data,
    });

    return tax;
  }

  static async deleteTax(id: string, userId?: string) {
    const tax = await prisma.taxRule.update({
      where: { id },
      data: { isActive: false },
    });

    await createAuditLog({
      userId,
      action: 'TAX_RULE_DEACTIVATED',
      entity: 'TaxRule',
      entityId: id,
    });

    return tax;
  }
}

