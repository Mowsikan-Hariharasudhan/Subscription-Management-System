import { prisma } from '../config/prisma';
import { createAuditLog } from '../utils/auditLog';

export class QuotationTemplateService {
  static async listTemplates(includeInactive = false) {
    return prisma.quotationTemplate.findMany({
      where: includeInactive ? {} : { isActive: true },
      include: {
        plan: true,
        lines: {
          include: { product: true, taxRule: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getTemplateById(id: string) {
    const template = await prisma.quotationTemplate.findUnique({
      where: { id },
      include: {
        plan: true,
        lines: {
          include: { product: { include: { variants: true } }, taxRule: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
    });
    if (!template) {
      throw new Error('Quotation template not found');
    }
    return template;
  }

  static async createTemplate(data: any, userId?: string) {
    const template = await prisma.quotationTemplate.create({
      data: {
        name: data.name,
        planId: data.planId || null,
        validityDays: data.validityDays ?? 30,
        paymentTerms: data.paymentTerms,
        isActive: data.isActive ?? true,
        lines: {
          create: data.lines.map((l: any, idx: number) => ({
            productId: l.productId,
            taxRuleId: l.taxRuleId || null,
            quantity: l.quantity || 1,
            unitPrice: l.unitPrice,
            sortOrder: l.sortOrder ?? idx,
          })),
        },
      },
      include: {
        lines: { include: { product: true, taxRule: true } },
      },
    });

    await createAuditLog({
      userId,
      action: 'QUOTATION_TEMPLATE_CREATED',
      entity: 'QuotationTemplate',
      entityId: template.id,
      details: { name: template.name },
    });

    return template;
  }

  static async updateTemplate(id: string, data: any, userId?: string) {
    const template = await prisma.$transaction(async (tx) => {
      if (data.lines) {
        await tx.quotationTemplateLine.deleteMany({
          where: { templateId: id },
        });
      }

      return tx.quotationTemplate.update({
        where: { id },
        data: {
          ...(data.name && { name: data.name }),
          ...(data.planId !== undefined && { planId: data.planId }),
          ...(data.validityDays !== undefined && { validityDays: data.validityDays }),
          ...(data.paymentTerms !== undefined && { paymentTerms: data.paymentTerms }),
          ...(data.isActive !== undefined && { isActive: data.isActive }),
          ...(data.lines && {
            lines: {
              create: data.lines.map((l: any, idx: number) => ({
                productId: l.productId,
                taxRuleId: l.taxRuleId || null,
                quantity: l.quantity || 1,
                unitPrice: l.unitPrice,
                sortOrder: l.sortOrder ?? idx,
              })),
            },
          }),
        },
        include: {
          lines: { include: { product: true, taxRule: true } },
        },
      });
    });

    await createAuditLog({
      userId,
      action: 'QUOTATION_TEMPLATE_UPDATED',
      entity: 'QuotationTemplate',
      entityId: id,
      details: data,
    });

    return template;
  }

  static async deleteTemplate(id: string, userId?: string) {
    const template = await prisma.quotationTemplate.update({
      where: { id },
      data: { isActive: false },
    });

    await createAuditLog({
      userId,
      action: 'QUOTATION_TEMPLATE_DEACTIVATED',
      entity: 'QuotationTemplate',
      entityId: id,
    });

    return template;
  }
}

