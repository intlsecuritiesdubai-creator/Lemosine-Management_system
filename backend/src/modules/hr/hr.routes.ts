import { Router } from 'express';
import { HrController } from './hr.controller';
import { authenticate, authorize } from '../auth/auth.middleware';
import { UserRole } from '../shared/enums';

const router = Router();

router.use(authenticate);
router.get('/', authorize([UserRole.SUPER_ADMIN, UserRole.FINANCE_OFFICER]), HrController.list);
router.post('/', authorize([UserRole.SUPER_ADMIN, UserRole.FINANCE_OFFICER]), HrController.create);
router.patch('/:id/status', authorize([UserRole.SUPER_ADMIN, UserRole.FINANCE_OFFICER]), HrController.updateStatus);
router.get('/drivers/:id', authorize([UserRole.SUPER_ADMIN, UserRole.FINANCE_OFFICER, UserRole.CLIENT_MANAGER]), HrController.listByDriver);
router.get('/:id/slip', authorize([UserRole.SUPER_ADMIN, UserRole.FINANCE_OFFICER, UserRole.CLIENT_MANAGER, UserRole.DRIVER]), HrController.salarySlip);

export default router;
