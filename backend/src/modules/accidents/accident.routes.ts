import { Router } from 'express';
import { AccidentController } from './accident.controller';
import { authenticate, authorize } from '../auth/auth.middleware';
import { UserRole } from '../shared/enums';

const router = Router();

router.use(authenticate);
router.get('/', authorize([UserRole.SUPER_ADMIN, UserRole.FLEET_MANAGER, UserRole.FINANCE_OFFICER, UserRole.VIEWER]), AccidentController.list);
router.post('/', authorize([UserRole.SUPER_ADMIN, UserRole.FLEET_MANAGER]), AccidentController.create);
router.get('/:id', authorize([UserRole.SUPER_ADMIN, UserRole.FLEET_MANAGER, UserRole.FINANCE_OFFICER, UserRole.CLIENT_MANAGER, UserRole.VIEWER]), AccidentController.get);

export default router;
