import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../prisma.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

// GET /api/products - List products
router.get('/', requireAuth, async (req, res): Promise<void> => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        variants: true,
        plans: true,
      },
    });

    res.json({ products });
  } catch (err: any) {
    console.error('List products error:', err);
    res.status(500).json({ error: 'Failed to list products' });
  }
});

// POST /api/products - Create product (ADMIN only)
router.post('/', requireAuth, requireRole(['ADMIN']), async (req, res): Promise<void> => {
  try {
    const ProductSchema = z.object({
      name: z.string().min(2),
      type: z.string().default('Software'),
      salesPrice: z.number().int().nonnegative(), // Integer paise
      costPrice: z.number().int().nonnegative(),  // Integer paise
      description: z.string().optional(),
      variants: z.array(z.object({
        name: z.string().min(1),
        priceDelta: z.number().int(), // Integer paise
      })).optional(),
    });

    const parse = ProductSchema.safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({ error: 'Validation failed', details: parse.error.format() });
      return;
    }

    const { name, type, salesPrice, costPrice, description, variants } = parse.data;
    const count = await prisma.product.count();
    const code = `PRD-${String(count + 1).padStart(3, '0')}`;

    const product = await prisma.product.create({
      data: {
        code,
        name,
        type,
        salesPrice,
        costPrice,
        description,
        status: 'ACTIVE',
        variants: variants && variants.length > 0 ? {
          create: variants.map((v) => ({
            name: v.name,
            priceDelta: v.priceDelta,
            isActive: true,
          })),
        } : undefined,
      },
      include: {
        variants: true,
      },
    });

    res.status(201).json({ product });
  } catch (err: any) {
    console.error('Create product error:', err);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// PUT /api/products/:id - Update product
router.put('/:id', requireAuth, requireRole(['ADMIN']), async (req, res): Promise<void> => {
  try {
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json({ product });
  } catch (err: any) {
    console.error('Update product error:', err);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE /api/products/:id - Soft archive product (DO NOT HARD DELETE)
router.delete('/:id', requireAuth, requireRole(['ADMIN']), async (req, res): Promise<void> => {
  try {
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: { status: 'ARCHIVED' },
    });
    res.json({ message: 'Product archived successfully', product });
  } catch (err: any) {
    console.error('Archive product error:', err);
    res.status(500).json({ error: 'Failed to archive product' });
  }
});

export default router;

