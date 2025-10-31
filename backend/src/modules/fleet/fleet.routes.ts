import { Router } from 'express';
import { FleetController } from './fleet.controller';
import { authenticate, authorize } from '../auth/auth.middleware';
import { UserRole } from '../shared/enums';

const router = Router();

router.use(authenticate);
router.get('/', authorize([UserRole.SUPER_ADMIN, UserRole.FLEET_MANAGER, UserRole.CLIENT_MANAGER]), FleetController.listVehicles);
router.post('/', authorize([UserRole.SUPER_ADMIN, UserRole.FLEET_MANAGER]), FleetController.createVehicle);
router.get('/:id', authorize([UserRole.SUPER_ADMIN, UserRole.FLEET_MANAGER, UserRole.CLIENT_MANAGER]), FleetController.getVehicle);
router.put('/:id', authorize([UserRole.SUPER_ADMIN, UserRole.FLEET_MANAGER]), FleetController.updateVehicle);
router.delete('/:id', authorize([UserRole.SUPER_ADMIN]), FleetController.deleteVehicle);
router.post('/:id/maintenance', authorize([UserRole.SUPER_ADMIN, UserRole.FLEET_MANAGER]), FleetController.addMaintenance);
router.post('/:id/trips', authorize([UserRole.SUPER_ADMIN, UserRole.FLEET_MANAGER]), FleetController.addTrip);

export default router;
