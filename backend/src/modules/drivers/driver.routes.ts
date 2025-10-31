import { Router } from 'express';
import { DriverController } from './driver.controller';
import { authenticate, authorize } from '../auth/auth.middleware';
import { UserRole } from '../shared/enums';

const router = Router();

router.use(authenticate);

router.get('/', authorize([UserRole.SUPER_ADMIN, UserRole.FLEET_MANAGER, UserRole.FINANCE_OFFICER]), DriverController.list);
router.post('/', authorize([UserRole.SUPER_ADMIN, UserRole.FLEET_MANAGER]), DriverController.create);
router.get(
  '/:id',
  authorize([
    UserRole.SUPER_ADMIN,
    UserRole.FLEET_MANAGER,
    UserRole.FINANCE_OFFICER,
    UserRole.CLIENT_MANAGER,
    UserRole.VIEWER
  ]),
  DriverController.get
);
router.put('/:id', authorize([UserRole.SUPER_ADMIN, UserRole.FLEET_MANAGER]), DriverController.update);

router.post(
  '/:id/attendance',
  authorize([UserRole.SUPER_ADMIN, UserRole.FLEET_MANAGER, UserRole.DRIVER]),
  DriverController.logAttendance
);
router.get(
  '/:id/attendance',
  authorize([UserRole.SUPER_ADMIN, UserRole.FLEET_MANAGER, UserRole.CLIENT_MANAGER]),
  DriverController.listAttendance
);

router.post('/:id/leaves', authorize([UserRole.SUPER_ADMIN, UserRole.FLEET_MANAGER, UserRole.DRIVER]), DriverController.requestLeave);
router.get(
  '/:id/leaves',
  authorize([UserRole.SUPER_ADMIN, UserRole.FLEET_MANAGER, UserRole.CLIENT_MANAGER]),
  DriverController.listLeaves
);
router.patch('/:id/leaves/:leaveId', authorize([UserRole.SUPER_ADMIN, UserRole.FLEET_MANAGER]), DriverController.decideLeave);

router.post('/:id/performance', authorize([UserRole.SUPER_ADMIN, UserRole.FLEET_MANAGER]), DriverController.addPerformance);
router.get(
  '/:id/performance',
  authorize([UserRole.SUPER_ADMIN, UserRole.FLEET_MANAGER, UserRole.CLIENT_MANAGER]),
  DriverController.listPerformance
);

router.get(
  '/:id/documents',
  authorize([UserRole.SUPER_ADMIN, UserRole.FLEET_MANAGER, UserRole.CLIENT_MANAGER]),
  DriverController.listDocuments
);
router.post('/:id/documents', authorize([UserRole.SUPER_ADMIN, UserRole.FLEET_MANAGER]), DriverController.addDocument);

export default router;
