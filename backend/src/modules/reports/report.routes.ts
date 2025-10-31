import { Router } from 'express';
import { ReportController } from './report.controller';
import { authenticate, authorize } from '../auth/auth.middleware';
import { UserRole } from '../shared/enums';

const router = Router();

router.use(authenticate);
router.get('/dashboard', authorize([UserRole.SUPER_ADMIN, UserRole.FLEET_MANAGER, UserRole.FINANCE_OFFICER, UserRole.CLIENT_MANAGER]), ReportController.dashboard);
router.get('/renewals', authorize([UserRole.SUPER_ADMIN, UserRole.FLEET_MANAGER]), ReportController.renewals);
router.get('/financial', authorize([UserRole.SUPER_ADMIN, UserRole.FINANCE_OFFICER]), ReportController.financial);

export default router;
