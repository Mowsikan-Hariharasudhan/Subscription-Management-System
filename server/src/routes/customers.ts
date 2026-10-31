import { Router } from 'express';
import { CustomerController } from '../controllers/customerController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import { customerSchema, updateCustomerSchema } from '../validators/entityValidators';

const router = Router();

router.use(authenticate);
router.use(authorize('ADMIN', 'STAFF'));

router.get('/', CustomerController.list);
router.post('/', validate(customerSchema), CustomerController.create);
router.get('/:id', CustomerController.getById);
router.patch('/:id', validate(updateCustomerSchema), CustomerController.update);
router.get('/:id/subscriptions', CustomerController.getSubscriptions);
router.get('/:id/invoices', CustomerController.getInvoices);
router.get('/:id/payments', CustomerController.getPayments);

export default router;

