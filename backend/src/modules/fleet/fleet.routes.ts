import { Router } from 'express';
import { FleetController } from './fleet.controller';
import { authenticate, authorize } from '../auth/auth.middleware';
import { UserRole } from '../shared/enums';

const router = Router();

router.use(authenticate);
router.get('/', authorize([UserRole.SUPER_ADMIN, UserRole.FLEET_MANAGER, UserRole.CLIENT_MANAGER, UserRole.VIEWER]), FleetController.listVehicles);
router.post('/', authorize([UserRole.SUPER_ADMIN, UserRole.FLEET_MANAGER]), FleetController.createVehicle);
router.get('/:id', authorize([UserRole.SUPER_ADMIN, UserRole.FLEET_MANAGER, UserRole.CLIENT_MANAGER, UserRole.VIEWER]), FleetController.getVehicle);
router.put('/:id', authorize([UserRole.SUPER_ADMIN, UserRole.FLEET_MANAGER]), FleetController.updateVehicle);
router.delete('/:id', authorize([UserRole.SUPER_ADMIN]), FleetController.deleteVehicle);
router.post('/:id/maintenance', authorize([UserRole.SUPER_ADMIN, UserRole.FLEET_MANAGER]), FleetController.addMaintenance);
router.post('/:id/trips', authorize([UserRole.SUPER_ADMIN, UserRole.FLEET_MANAGER]), FleetController.addTrip);
router.get('/:id/documents', authorize([UserRole.SUPER_ADMIN, UserRole.FLEET_MANAGER, UserRole.CLIENT_MANAGER, UserRole.VIEWER]), FleetController.listDocuments);
router.post('/:id/documents', authorize([UserRole.SUPER_ADMIN, UserRole.FLEET_MANAGER]), FleetController.addDocument);
router.get('/:id/assignments', authorize([UserRole.SUPER_ADMIN, UserRole.FLEET_MANAGER, UserRole.VIEWER]), FleetController.listAssignments);
router.post('/:id/assignments', authorize([UserRole.SUPER_ADMIN, UserRole.FLEET_MANAGER]), FleetController.assignDriver);
router.post('/:id/assignments/release', authorize([UserRole.SUPER_ADMIN, UserRole.FLEET_MANAGER]), FleetController.releaseDriver);

export default router;
