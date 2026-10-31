import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../prisma.js';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'brightloop_enterprise_jwt_secret_paise_2026';

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post('/login', async (req, res): Promise<void> => {
  try {
    const parse = LoginSchema.safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({ error: 'Invalid email or password format' });
      return;
    }

    const { email, password } = parse.data;
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user || !user.isActive) {
      res.status(401).json({ error: 'Invalid credentials or inactive account' });
      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      res.status(401).json({ error: 'Invalid credentials or inactive account' });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set HTTP-only secure cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Update lastLoginAt
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        customerId: user.customerId,
      },
    });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error during authentication' });
  }
});

router.post('/logout', (_req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

router.get('/me', requireAuth, (req: AuthenticatedRequest, res) => {
  res.json({ user: req.user });
});

router.post('/register', async (req, res): Promise<void> => {
  try {
    const RegisterSchema = z.object({
      name: z.string().min(2),
      email: z.string().email(),
      password: z.string().min(6),
      company: z.string().min(2),
    });

    const parse = RegisterSchema.safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({ error: 'Invalid registration details' });
      return;
    }

    const { name, email, password, company } = parse.data;
    const existing = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existing) {
      res.status(409).json({ error: 'An account with this email already exists' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Create Customer record and link user to it
    const customerCount = await prisma.customer.count();
    const customerCode = `CUS-${String(customerCount + 1).padStart(3, '0')}`;

    const result = await prisma.$transaction(async (tx) => {
      const customer = await tx.customer.create({
        data: {
          code: customerCode,
          name,
          email: email.toLowerCase(),
          company,
          status: 'ACTIVE',
        },
      });

      const user = await tx.user.create({
        data: {
          name,
          email: email.toLowerCase(),
          passwordHash,
          role: 'CUSTOMER',
          customerId: customer.id,
          isActive: true,
        },
      });

      return { user, customer };
    });

    const token = jwt.sign(
      { userId: result.user.id, role: result.user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      token,
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        role: result.user.role,
        customerId: result.user.customerId,
      },
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Internal server error during registration' });
  }
});

export default router;
