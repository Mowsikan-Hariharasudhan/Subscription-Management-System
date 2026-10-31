import { Router } from 'express';
import { PaymentController } from '../controllers/paymentController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import { recordPaymentSchema } from '../validators/paymentValidators';

const router = Router();

router.use(authenticate);
router.use(authorize('ADMIN', 'STAFF'));

router.get('/', PaymentController.list);
router.get('/:id', PaymentController.getById);
router.post('/', validate(recordPaymentSchema), PaymentController.record);

export default router;

