import { Router } from 'express';
import { DiscountController } from '../controllers/discountController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import { discountRuleSchema, updateDiscountRuleSchema } from '../validators/billingValidators';

const router = Router();

router.use(authenticate);

router.get('/', authorize('ADMIN', 'STAFF'), DiscountController.list);
router.get('/:id', authorize('ADMIN', 'STAFF'), DiscountController.getById);
router.get('/:id/redemptions', authorize('ADMIN', 'STAFF'), DiscountController.getRedemptions);

router.post('/', authorize('ADMIN'), validate(discountRuleSchema), DiscountController.create);
router.patch('/:id', authorize('ADMIN'), validate(updateDiscountRuleSchema), DiscountController.update);
router.delete('/:id', authorize('ADMIN'), DiscountController.delete);

export default router;
