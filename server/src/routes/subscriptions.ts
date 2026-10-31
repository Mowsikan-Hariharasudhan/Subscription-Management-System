import { Router } from 'express';
import { SubscriptionController } from '../controllers/subscriptionController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import { createSubscriptionSchema, updateSubscriptionSchema } from '../validators/orderValidators';

const router = Router();

router.use(authenticate);
router.use(authorize('ADMIN', 'STAFF'));

router.get('/', SubscriptionController.list);
router.get('/:id', SubscriptionController.getById);
router.post('/', validate(createSubscriptionSchema), SubscriptionController.create);
router.patch('/:id', validate(updateSubscriptionSchema), SubscriptionController.update);

router.post('/:id/confirm', SubscriptionController.confirm);
router.post('/:id/activate', SubscriptionController.activate);
router.post('/:id/pause', SubscriptionController.pause);
router.post('/:id/resume', SubscriptionController.resume);
router.post('/:id/close', SubscriptionController.close);
router.post('/:id/renew', SubscriptionController.renew);

export default router;

