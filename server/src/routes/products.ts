import { Router } from 'express';
import { ProductController } from '../controllers/productController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import { productSchema, updateProductSchema } from '../validators/entityValidators';

const router = Router();

// Public / Authenticated list & detail
router.get('/', ProductController.list);
router.get('/:id', ProductController.getById);

// Admin & Staff operations
router.post(
  '/',
  authenticate,
  authorize('ADMIN', 'STAFF'),
  validate(productSchema),
  ProductController.create
);

router.patch(
  '/:id',
  authenticate,
  authorize('ADMIN', 'STAFF'),
  validate(updateProductSchema),
  ProductController.update
);

router.delete(
  '/:id',
  authenticate,
  authorize('ADMIN', 'STAFF'),
  ProductController.delete
);

export default router;

