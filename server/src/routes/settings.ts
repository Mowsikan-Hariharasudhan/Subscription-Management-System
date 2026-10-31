import { Router } from 'express';
import { prisma } from '../prisma.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { processRecurringBillingRun } from '../utils/billingEngine.js';

const router = Router();

// GET /api/settings
router.get('/', requireAuth, async (_req, res): Promise<void> => {
  try {
    const settings = await prisma.settings.findFirst({
      where: { id: 1 },
    });
    res.json({ settings });
  } catch (err: any) {
    console.error('Get settings error:', err);
    res.status(500).json({ error: 'Failed to retrieve settings' });
  }
});

// PUT /api/settings (ADMIN only)
router.put('/', requireAuth, requireRole(['ADMIN']), async (req, res): Promise<void> => {
  try {
    const settings = await prisma.settings.upsert({
      where: { id: 1 },
      update: req.body,
      create: {
        id: 1,
        ...req.body,
      },
    });
    res.json({ settings });
  } catch (err: any) {
    console.error('Update settings error:', err);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// GET /api/audit-logs (ADMIN only)
router.get('/audit-logs', requireAuth, requireRole(['ADMIN']), async (_req, res): Promise<void> => {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    res.json({ logs });
  } catch (err: any) {
    console.error('Audit logs error:', err);
    res.status(500).json({ error: 'Failed to retrieve audit logs' });
  }
});

// POST /api/billing/run-job (ADMIN only) - Manual invocation of recurring billing engine
router.post('/run-billing-job', requireAuth, requireRole(['ADMIN']), async (_req, res): Promise<void> => {
  try {
    const result = await processRecurringBillingRun();
    res.json({
      message: 'Recurring billing engine executed successfully',
      result,
    });
  } catch (err: any) {
    console.error('Manual billing job error:', err);
    res.status(500).json({ error: 'Failed to execute recurring billing run' });
  }
});

export default router;
