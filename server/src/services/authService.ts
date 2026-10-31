import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { prisma } from '../config/prisma';
import { env } from '../config/env';
import { JwtPayload, UserRole } from '../types';
import { createAuditLog } from '../utils/auditLog';

export interface RegisterDTO {
  email: string;
  password: string;
  role?: UserRole;
  name: string;
  companyName?: string;
  phone?: string;
  billingAddress?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export class AuthService {
  private static transporter = nodemailer.createTransport({
    host: env.SMTP_HOST || 'smtp.ethereal.email',
    port: env.SMTP_PORT || 587,
    secure: false,
    auth: env.SMTP_USER ? {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    } : undefined,
  });

  static async register(dto: RegisterDTO) {
    const existing = await prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
    });

    if (existing) {
      throw new Error('An account with this email address already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const role = dto.role || 'CUSTOMER';

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: dto.email.toLowerCase().trim(),
          password: hashedPassword,
          role: role as any,
          isActive: true,
        },
      });

      let customer = null;
      if (role === 'CUSTOMER') {
        customer = await tx.customer.create({
          data: {
            userId: user.id,
            name: dto.name,
            companyName: dto.companyName,
            phone: dto.phone,
            billingAddress: dto.billingAddress,
            isActive: true,
          },
        });
      }

      return { user, customer };
    });

    await createAuditLog({
      userId: result.user.id,
      action: 'USER_REGISTERED',
      entity: 'User',
      entityId: result.user.id,
      details: { email: result.user.email, role: result.user.role },
    });

    const tokenPayload: JwtPayload = {
      userId: result.user.id,
      email: result.user.email,
      role: result.user.role as UserRole,
      customerId: result.customer?.id,
    };

    const token = jwt.sign(tokenPayload, env.JWT_SECRET as jwt.Secret, {
      expiresIn: env.JWT_EXPIRES_IN as any,
    });

    return {
      token,
      user: {
        id: result.user.id,
        email: result.user.email,
        role: result.user.role,
        customer: result.customer,
      },
    };
  }

  static async login(dto: LoginDTO) {
    const user = await prisma.user.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
      include: { customer: true },
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    if (!user.isActive) {
      throw new Error('Account has been deactivated. Please contact support.');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    const tokenPayload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role as UserRole,
      customerId: user.customer?.id,
    };

    const token = jwt.sign(tokenPayload, env.JWT_SECRET as jwt.Secret, {
      expiresIn: env.JWT_EXPIRES_IN as any,
    });

    await createAuditLog({
      userId: user.id,
      action: 'USER_LOGIN',
      entity: 'User',
      entityId: user.id,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        customer: user.customer,
      },
    };
  }

  static async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      // Return success without revealing if user exists (security best practice)
      return { message: 'If that email address exists in our system, a password reset link has been sent.' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token: resetToken,
        expiresAt,
      },
    });

    const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    if (env.SMTP_HOST && env.SMTP_USER) {
      try {
        await this.transporter.sendMail({
          from: env.SMTP_FROM,
          to: user.email,
          subject: 'Password Reset Request - Brightloop',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Reset Your Password</h2>
              <p>You requested a password reset for your Brightloop account.</p>
              <p>Click the link below to set a new password. This link is valid for 1 hour:</p>
              <a href="${resetUrl}" style="display:inline-block; padding: 12px 24px; background-color: #724B68; color: white; text-decoration: none; border-radius: 4px;">Reset Password</a>
              <p style="margin-top: 24px; color: #777;">If you did not request this, you can safely ignore this email.</p>
            </div>
          `,
        });
      } catch (err) {
        console.error('Failed to send reset email:', err);
      }
    } else {
      console.log(`\n======================================================`);
      console.log(`[DEV EMAIL] Password reset requested for: ${user.email}`);
      console.log(`[DEV EMAIL] Reset link: ${resetUrl}`);
      console.log(`======================================================\n`);
    }

    await createAuditLog({
      userId: user.id,
      action: 'PASSWORD_RESET_REQUESTED',
      entity: 'User',
      entityId: user.id,
    });

    return { message: 'If that email address exists in our system, a password reset link has been sent.' };
  }

  static async resetPassword(token: string, newPass: string) {
    const record = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!record || record.usedAt || record.expiresAt < new Date()) {
      throw new Error('Reset link is invalid or has expired');
    }

    const hashedPassword = await bcrypt.hash(newPass, 10);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: record.userId },
        data: { password: hashedPassword },
      }),
      prisma.passwordResetToken.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      }),
    ]);

    await createAuditLog({
      userId: record.userId,
      action: 'PASSWORD_RESET_COMPLETED',
      entity: 'User',
      entityId: record.userId,
    });

    return { message: 'Password has been successfully reset. You may now log in.' };
  }

  static async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { customer: true },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      customer: user.customer,
      createdAt: user.createdAt,
    };
  }
}
