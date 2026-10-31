import { Router } from 'express';
import { QuotationController } from '../controllers/quotationController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import { createQuotationSchema, updateQuotationSchema } from '../validators/orderValidators';

const router = Router();

router.use(authenticate);
router.use(authorize('ADMIN', 'STAFF'));

router.get('/', QuotationController.list);
router.get('/:id', QuotationController.getById);
router.post('/', validate(createQuotationSchema), QuotationController.create);
router.patch('/:id', validate(updateQuotationSchema), QuotationController.update);

router.post('/:id/confirm', QuotationController.confirm);
router.post('/:id/accept', QuotationController.accept);
router.post('/:id/decline', QuotationController.decline);
router.post('/:id/convert', QuotationController.convert);

export default router;

