import { Router } from 'express';
import { DriverController } from './driver.controller';
import { authenticate, authorize } from '../auth/auth.middleware';
import { UserRole } from '../shared/enums';

const router = Router();

router.use(authenticate);
router.get('/', authorize([UserRole.SUPER_ADMIN, UserRole.FLEET_MANAGER, UserRole.FINANCE_OFFICER]), DriverController.list);
router.post('/', authorize([UserRole.SUPER_ADMIN, UserRole.FLEET_MANAGER]), DriverController.create);
router.get('/:id', authorize([UserRole.SUPER_ADMIN, UserRole.FLEET_MANAGER, UserRole.FINANCE_OFFICER, UserRole.CLIENT_MANAGER]), DriverController.get);
router.put('/:id', authorize([UserRole.SUPER_ADMIN, UserRole.FLEET_MANAGER]), DriverController.update);

export default router;
