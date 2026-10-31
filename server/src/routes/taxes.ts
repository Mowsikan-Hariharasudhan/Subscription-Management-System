import { Router } from 'express';
import { TaxController } from '../controllers/taxController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import { taxRuleSchema, updateTaxRuleSchema } from '../validators/entityValidators';

const router = Router();

router.get('/', TaxController.list);
router.get('/:id', TaxController.getById);

router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  validate(taxRuleSchema),
  TaxController.create
);

router.patch(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  validate(updateTaxRuleSchema),
  TaxController.update
);

router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN'),
  TaxController.delete
);

export default router;

