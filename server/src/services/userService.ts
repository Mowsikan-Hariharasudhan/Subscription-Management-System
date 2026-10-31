import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma';
import { getPaginationParams } from '../utils/pagination';
import { createAuditLog } from '../utils/auditLog';
import { UserRole } from '../types';

export class UserService {
  static async listUsers(query: any) {
    const { page, limit, skip } = getPaginationParams(query);
    const search = query.search ? String(query.search).trim() : undefined;
    const role = query.role ? (String(query.role) as UserRole) : undefined;
    const isActive = query.isActive !== undefined ? query.isActive === 'true' : undefined;

    const where: any = {
      ...(role && { role }),
      ...(isActive !== undefined && { isActive }),
      ...(search && {
        OR: [
          { email: { contains: search } },
          { customer: { name: { contains: search } } },
          { customer: { companyName: { contains: search } } },
        ],
      }),
    };

    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          customer: {
            select: {
              id: true,
              name: true,
              companyName: true,
              phone: true,
            },
          },
        },
      }),
    ]);

    return { users, total, page, limit };
  }

  static async createUser(data: any, createdById?: string) {
    const existing = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase().trim() },
    });
    if (existing) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: data.email.toLowerCase().trim(),
          password: hashedPassword,
          role: data.role,
          isActive: data.isActive ?? true,
        },
      });

      if (data.role === 'CUSTOMER' && data.name) {
        await tx.customer.create({
          data: {
            userId: newUser.id,
            name: data.name,
            companyName: data.companyName,
            phone: data.phone,
            billingAddress: data.billingAddress,
          },
        });
      }

      return newUser;
    });

    await createAuditLog({
      userId: createdById,
      action: 'USER_CREATED',
      entity: 'User',
      entityId: user.id,
      details: { email: user.email, role: user.role },
    });

    return user;
  }

  static async updateUser(id: string, data: any, updatedById?: string) {
    const updateData: any = {};
    if (data.email) updateData.email = data.email.toLowerCase().trim();
    if (data.role) updateData.role = data.role;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    await createAuditLog({
      userId: updatedById,
      action: 'USER_UPDATED',
      entity: 'User',
      entityId: id,
      details: updateData,
    });

    return updated;
  }

  static async deleteUser(id: string, deletedById?: string) {
    // Soft delete: set isActive to false
    const deactivated = await prisma.user.update({
      where: { id },
      data: { isActive: false },
      select: { id: true, email: true, isActive: true },
    });

    await createAuditLog({
      userId: deletedById,
      action: 'USER_DEACTIVATED',
      entity: 'User',
      entityId: id,
    });

    return deactivated;
  }
}

