import { Router } from 'express';
import { UserController } from './user.controller';
import { authenticate, authorize } from '../auth/auth.middleware';
import { UserRole } from '../shared/enums';

const router = Router();

router.use(authenticate);
router.use(authorize([UserRole.SUPER_ADMIN]));

router.get('/', UserController.list);
router.post('/', UserController.create);
router.get('/:id', UserController.get);
router.put('/:id', UserController.update);
router.delete('/:id', UserController.remove);

export default router;
