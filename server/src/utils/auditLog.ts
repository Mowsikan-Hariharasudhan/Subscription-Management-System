import { prisma } from '../config/prisma';

export interface AuditLogParams {
  userId?: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  details?: any;
}

export const createAuditLog = async ({
  userId,
  action,
  entity,
  entityId,
  details,
}: AuditLogParams): Promise<void> => {
  try {
    const detailsStr = typeof details === 'string' ? details : details ? JSON.stringify(details) : null;
    await prisma.auditLog.create({
      data: {
        userId: userId || null,
        action,
        entity,
        entityId: entityId || null,
        details: detailsStr,
      },
    });
  } catch (err) {
    console.error('Failed to create audit log:', err);
  }
};

