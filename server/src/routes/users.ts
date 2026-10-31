import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import { createUserSchema, updateUserSchema } from '../validators/authValidators';

const router = Router();

router.use(authenticate);
router.use(authorize('ADMIN'));

router.get('/', UserController.list);
router.post('/', validate(createUserSchema), UserController.create);
router.patch('/:id', validate(updateUserSchema), UserController.update);
router.delete('/:id', UserController.delete);

export default router;

