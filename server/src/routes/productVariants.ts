import { Router } from 'express';
import { ProductController } from '../controllers/productController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import { productVariantSchema, updateProductVariantSchema } from '../validators/entityValidators';

const router = Router();

router.get('/', ProductController.listVariants);

router.post(
  '/',
  authenticate,
  authorize('ADMIN', 'STAFF'),
  validate(productVariantSchema),
  ProductController.createVariant
);

router.patch(
  '/:id',
  authenticate,
  authorize('ADMIN', 'STAFF'),
  validate(updateProductVariantSchema),
  ProductController.updateVariant
);

router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN', 'STAFF'),
  ProductController.deleteVariant
);

export default router;

