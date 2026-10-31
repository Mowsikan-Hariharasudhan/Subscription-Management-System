import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma.js';
import { requireAuth, requireRole, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/customers - List customers (ADMIN & STAFF)
router.get('/', requireAuth, requireRole(['ADMIN', 'STAFF']), async (req, res): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.max(1, parseInt(req.query.limit as string) || 25);
    const search = (req.query.search as string || '').trim().toLowerCase();

    const where = search
      ? {
          OR: [
            { name: { contains: search } },
            { company: { contains: search } },
            { email: { contains: search } },
            { code: { contains: search } },
          ],
        }
      : {};

    const [total, customers] = await Promise.all([
      prisma.customer.count({ where }),
      prisma.customer.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { subscriptions: true, invoices: true },
          },
        },
      }),
    ]);

    res.json({
      customers: customers.map((c) => ({
        id: c.id,
        code: c.code,
        name: c.name,
        company: c.company,
        email: c.email,
        phone: c.phone,
        gstin: c.gstin,
        address: c.address,
        city: c.city,
        status: c.status,
        subscriptionsCount: c._count.subscriptions,
        invoicesCount: c._count.invoices,
        createdAt: c.createdAt,
      })),
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err: any) {
    console.error('List customers error:', err);
    res.status(500).json({ error: 'Failed to list customers' });
  }
});

// GET /api/customers/:id
router.get('/:id', requireAuth, async (req: AuthenticatedRequest, res): Promise<void> => {
  try {
    const user = req.user!;
    // Security check: CUSTOMER can only view own record. If accessing another, return 404 to avoid ID harvesting.
    if (user.role === 'CUSTOMER' && user.customerId !== req.params.id) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }

    const customer = await prisma.customer.findUnique({
      where: { id: req.params.id },
      include: {
        subscriptions: {
          include: { plan: true },
          orderBy: { createdAt: 'desc' },
        },
        invoices: {
          orderBy: { issueDate: 'desc' },
        },
      },
    });

    if (!customer) {
      res.status(404).json({ error: 'Customer not found' });
      return;
    }

    res.json({ customer });
  } catch (err: any) {
    console.error('Get customer error:', err);
    res.status(500).json({ error: 'Failed to retrieve customer' });
  }
});

// POST /api/customers
router.post('/', requireAuth, requireRole(['ADMIN', 'STAFF']), async (req, res): Promise<void> => {
  try {
    const CustomerSchema = z.object({
      name: z.string().min(2),
      company: z.string().min(2),
      email: z.string().email(),
      phone: z.string().optional(),
      gstin: z.string().optional(),
      address: z.string().optional(),
      city: z.string().optional(),
    });

    const parse = CustomerSchema.safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({ error: 'Validation failed', details: parse.error.format() });
      return;
    }

    const count = await prisma.customer.count();
    const code = `CUS-${String(count + 1).padStart(3, '0')}`;

    const customer = await prisma.customer.create({
      data: {
        ...parse.data,
        code,
        status: 'ACTIVE',
      },
    });

    res.status(201).json({ customer });
  } catch (err: any) {
    console.error('Create customer error:', err);
    res.status(500).json({ error: 'Failed to create customer' });
  }
});

// PUT /api/customers/:id
router.put('/:id', requireAuth, requireRole(['ADMIN', 'STAFF']), async (req, res): Promise<void> => {
  try {
    const customer = await prisma.customer.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json({ customer });
  } catch (err: any) {
    console.error('Update customer error:', err);
    res.status(500).json({ error: 'Failed to update customer' });
  }
});

export default router;
