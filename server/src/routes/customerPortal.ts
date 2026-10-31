import { Router } from 'express';
import { PortalController } from '../controllers/portalController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import { updateCustomerAccountSchema } from '../validators/paymentValidators';

const router = Router();

router.use(authenticate);
router.use(authorize('CUSTOMER'));

router.get('/overview', PortalController.getOverview);
router.get('/subscriptions', PortalController.getSubscriptions);
router.get('/subscriptions/:id', PortalController.getSubscriptionById);
router.get('/invoices', PortalController.getInvoices);
router.get('/invoices/:id', PortalController.getInvoiceById);
router.get('/payments', PortalController.getPayments);
router.get('/account', PortalController.getAccount);
router.patch('/account', validate(updateCustomerAccountSchema), PortalController.updateAccount);

export default router;

