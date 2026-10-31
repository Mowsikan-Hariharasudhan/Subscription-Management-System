import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import { initDbPragmas } from './config/prisma';
import { startBillingJob } from './jobs/billingJob';

// Route imports
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import productRoutes from './routes/products';
import productVariantRoutes from './routes/productVariants';
import planRoutes from './routes/plans';
import taxRoutes from './routes/taxes';
import customerRoutes from './routes/customers';
import quotationTemplateRoutes from './routes/quotationTemplates';
import quotationRoutes from './routes/quotations';
import subscriptionRoutes from './routes/subscriptions';
import invoiceRoutes from './routes/invoices';
import discountRoutes from './routes/discounts';
import paymentRoutes from './routes/payments';
import portalRoutes from './routes/customerPortal';
import dashboardRoutes from './routes/dashboard';

export const createApp = (): express.Application => {
  const app = express();

  // Security Middleware
  app.use(helmet());
  app.use(
    cors({
      origin: [env.FRONTEND_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
      credentials: true,
    })
  );

  // Rate Limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 1000 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Too many requests, please try again later.' },
  });
  app.use(limiter);

  // Body Parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Health check
  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Mount API Routes
  const apiRouter = express.Router();
  apiRouter.use('/auth', authRoutes);
  apiRouter.use('/users', userRoutes);
  apiRouter.use('/products', productRoutes);
  apiRouter.use('/product-variants', productVariantRoutes);
  apiRouter.use('/plans', planRoutes);
  apiRouter.use('/taxes', taxRoutes);
  apiRouter.use('/customers', customerRoutes);
  apiRouter.use('/quotation-templates', quotationTemplateRoutes);
  apiRouter.use('/quotations', quotationRoutes);
  apiRouter.use('/subscriptions', subscriptionRoutes);
  apiRouter.use('/invoices', invoiceRoutes);
  apiRouter.use('/discounts', discountRoutes);
  apiRouter.use('/payments', paymentRoutes);
  apiRouter.use('/customer-portal', portalRoutes);
  apiRouter.use('/dashboard', dashboardRoutes);

  app.use('/api/v1', apiRouter);

  // 404 Handler
  app.use((_req, res) => {
    res.status(404).json({ success: false, message: 'Endpoint not found' });
  });

  // Global Error Handler
  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('Unhandled Server Error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Internal Server Error',
    });
  });

  return app;
};

