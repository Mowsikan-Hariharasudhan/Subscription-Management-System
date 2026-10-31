import { Router } from 'express';
import { DashboardController } from '../controllers/dashboardController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';

const router = Router();

router.use(authenticate);
router.use(authorize('ADMIN', 'STAFF'));

router.get('/kpis', DashboardController.getKpis);
router.get('/monthly-revenue', DashboardController.getMonthlyRevenue);
router.get('/subscription-growth', DashboardController.getSubscriptionGrowth);
router.get('/payment-distribution', DashboardController.getPaymentDistribution);
router.get('/recent-subscriptions', DashboardController.getRecentSubscriptions);
router.get('/recent-invoices', DashboardController.getRecentInvoices);
router.get('/recent-payments', DashboardController.getRecentPayments);
router.get('/overdue-invoices', DashboardController.getOverdueInvoices);

export default router;

