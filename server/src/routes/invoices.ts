import { Router } from 'express';
import { InvoiceController } from '../controllers/invoiceController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import { manualBillingSchema } from '../validators/billingValidators';

const router = Router();

router.use(authenticate);
router.use(authorize('ADMIN', 'STAFF'));

router.get('/', InvoiceController.list);
router.post('/billing/run', validate(manualBillingSchema), InvoiceController.runBilling);
router.get('/:id', InvoiceController.getById);
router.post('/:id/confirm', InvoiceController.confirm);
router.post('/:id/cancel', InvoiceController.cancel);

export default router;

