import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import cron from 'node-cron';
import dotenv from 'dotenv';

import authRouter from './routes/auth.js';
import dashboardRouter from './routes/dashboard.js';
import customersRouter from './routes/customers.js';
import productsRouter from './routes/products.js';
import plansRouter from './routes/plans.js';
import subscriptionsRouter from './routes/subscriptions.js';
import invoicesRouter from './routes/invoices.js';
import paymentsRouter from './routes/payments.js';
import quotationsRouter from './routes/quotations.js';
import taxDiscountRouter from './routes/tax-discount.js';
import reportsRouter from './routes/reports.js';
import settingsRouter from './routes/settings.js';
import { processRecurringBillingRun } from './utils/billingEngine.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Enable CORS for frontend Vite dev server (port 5173) and allow cookies
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
}));

app.use(cookieParser());
app.use(express.json());

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/customers', customersRouter);
app.use('/api/products', productsRouter);
app.use('/api/plans', plansRouter);
app.use('/api/subscriptions', subscriptionsRouter);
app.use('/api/invoices', invoicesRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/quotations', quotationsRouter);
app.use('/api', taxDiscountRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/settings', settingsRouter);

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'Brightloop Enterprise Backend',
    timestamp: new Date().toISOString(),
  });
});

// Daily recurring billing cron job at 00:00 (Midnight)
cron.schedule('0 0 * * *', async () => {
  console.log('⏰ [Cron] Running automated recurring billing sweep...');
  try {
    const summary = await processRecurringBillingRun();
    console.log('✅ [Cron] Sweep finished:', summary);
  } catch (err) {
    console.error('❌ [Cron] Sweep failed:', err);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Brightloop Enterprise API server running on http://localhost:${PORT}`);
});
