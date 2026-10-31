import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma';
import { getPaginationParams } from '../utils/pagination';
import { createAuditLog } from '../utils/auditLog';

export class CustomerService {
  static async listCustomers(query: any) {
    const { page, limit, skip } = getPaginationParams(query);
    const search = query.search ? String(query.search).trim() : undefined;
    const isActive = query.isActive !== undefined ? query.isActive === 'true' : undefined;

    const where: any = {
      ...(isActive !== undefined && { isActive }),
      ...(search && {
        OR: [
          { name: { contains: search } },
          { companyName: { contains: search } },
          { phone: { contains: search } },
          { user: { email: { contains: search } } },
        ],
      }),
    };

    const [total, customers] = await Promise.all([
      prisma.customer.count({ where }),
      prisma.customer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, email: true, role: true, isActive: true },
          },
          _count: {
            select: {
              subscriptions: true,
              invoices: true,
              quotations: true,
            },
          },
        },
      }),
    ]);

    return { customers, total, page, limit };
  }

  static async getCustomerById(id: string) {
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, email: true, role: true, isActive: true, createdAt: true },
        },
        subscriptions: {
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: { plan: true },
        },
        invoices: {
          take: 5,
          orderBy: { issueDate: 'desc' },
        },
        quotations: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!customer) {
      throw new Error('Customer not found');
    }

    return customer;
  }

  static async createCustomer(data: any, createdById?: string) {
    const email = data.email ? data.email.toLowerCase().trim() : null;
    let userId = data.userId;

    if (!userId && email) {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      const defaultPassword = data.password || 'Customer@1234';
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);

      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role: 'CUSTOMER',
          isActive: true,
        },
      });
      userId = newUser.id;
    } else if (!userId) {
      // Auto-generate placeholder email for customer without portal user
      const uniqueSuffix = Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
      const tempEmail = `customer_${uniqueSuffix}@brightloop.internal`;
      const hashedPassword = await bcrypt.hash('Customer@1234', 10);

      const newUser = await prisma.user.create({
        data: {
          email: tempEmail,
          password: hashedPassword,
          role: 'CUSTOMER',
          isActive: true,
        },
      });
      userId = newUser.id;
    }

    const customer = await prisma.customer.create({
      data: {
        userId,
        name: data.name,
        companyName: data.companyName,
        phone: data.phone,
        billingAddress: data.billingAddress,
        isActive: data.isActive ?? true,
      },
      include: { user: true },
    });

    await createAuditLog({
      userId: createdById,
      action: 'CUSTOMER_CREATED',
      entity: 'Customer',
      entityId: customer.id,
      details: { name: customer.name, email: customer.user.email },
    });

    return customer;
  }

  static async updateCustomer(id: string, data: any, updatedById?: string) {
    const customer = await prisma.customer.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.companyName !== undefined && { companyName: data.companyName }),
        ...(data.phone !== undefined && { phone: data.phone }),
        ...(data.billingAddress !== undefined && { billingAddress: data.billingAddress }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
      include: { user: true },
    });

    await createAuditLog({
      userId: updatedById,
      action: 'CUSTOMER_UPDATED',
      entity: 'Customer',
      entityId: id,
      details: data,
    });

    return customer;
  }

  static async getCustomerSubscriptions(customerId: string) {
    return prisma.subscription.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
      include: {
        plan: true,
        lines: {
          include: { product: true, variant: true, taxRule: true },
        },
      },
    });
  }

  static async getCustomerInvoices(customerId: string) {
    return prisma.invoice.findMany({
      where: { customerId },
      orderBy: { issueDate: 'desc' },
      include: {
        subscription: { include: { plan: true } },
        payments: true,
      },
    });
  }

  static async getCustomerPayments(customerId: string) {
    return prisma.payment.findMany({
      where: {
        invoice: { customerId },
      },
      orderBy: { paymentDate: 'desc' },
      include: {
        invoice: true,
        createdBy: { select: { id: true, email: true } },
      },
    });
  }
}

