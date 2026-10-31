import { Router } from 'express';
import { QuotationTemplateController } from '../controllers/quotationTemplateController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import { quotationTemplateSchema } from '../validators/orderValidators';

const router = Router();

router.use(authenticate);
router.use(authorize('ADMIN', 'STAFF'));

router.get('/', QuotationTemplateController.list);
router.get('/:id', QuotationTemplateController.getById);
router.post('/', validate(quotationTemplateSchema), QuotationTemplateController.create);
router.patch('/:id', QuotationTemplateController.update);
router.delete('/:id', QuotationTemplateController.delete);

export default router;

