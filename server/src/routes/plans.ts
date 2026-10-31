import { Router } from 'express';
import { PlanController } from '../controllers/planController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import { subscriptionPlanSchema, updateSubscriptionPlanSchema } from '../validators/entityValidators';

const router = Router();

router.get('/', PlanController.list);
router.get('/:id', PlanController.getById);

router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  validate(subscriptionPlanSchema),
  PlanController.create
);

router.patch(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate(updateSubscriptionPlanSchema),
  PlanController.update
);

router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  PlanController.delete
);

export default router;

