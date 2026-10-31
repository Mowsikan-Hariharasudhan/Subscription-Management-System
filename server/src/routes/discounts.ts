import { Router } from 'express';
import { DiscountController } from '../controllers/discountController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import { discountRuleSchema, updateDiscountRuleSchema } from '../validators/billingValidators';

const router = Router();

router.use(authenticate);
router.use(authorize('ADMIN', 'STAFF'));

router.get('/', DiscountController.list);
router.get('/:id', DiscountController.getById);
router.get('/:id/redemptions', DiscountController.getRedemptions);

router.post('/', validate(discountRuleSchema), DiscountController.create);
router.patch('/:id', validate(updateDiscountRuleSchema), DiscountController.update);
router.delete('/:id', DiscountController.delete);

export default router;

