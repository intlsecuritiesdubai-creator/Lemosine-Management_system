import { VehicleRepository } from './vehicle.repository';
import { createVehicleSchema, maintenanceSchema, tripSchema, updateVehicleSchema, documentSchema, assignDriverSchema } from './fleet.dto';
import { DriverRepository } from '../drivers/driver.repository';
import { Maintenance } from './maintenance.entity';
import { Trip } from './trip.entity';
import { NotificationService } from '../shared/notification.service';
import { NotificationType, DocumentType } from '../shared/enums';
import { AuditService } from '../shared/audit.service';

export class VehicleService {
  private readonly vehicles = new VehicleRepository();
  private readonly drivers = new DriverRepository();
  private readonly notifications = new NotificationService();
  private readonly audit = new AuditService();

  async listVehicles() {
    return this.vehicles.findAll();
  }

  async getVehicle(id: string) {
    return this.vehicles.getVehicle(id);
  }

  async createVehicle(payload: unknown) {
    const data = createVehicleSchema.parse(payload);
    const existing = await this.vehicles.findByPlate(data.plateNumber);
    if (existing) {
      throw Object.assign(new Error('Plate number already exists'), { status: 409 });
    }
    const vehicle = this.vehicles.create(data);
    const saved = await this.vehicles.save(vehicle);
    await this.audit.log('CREATE', 'Vehicle', saved.id, undefined, data as Record<string, unknown>);
    if (saved.insuranceExpiry) {
      await this.notifications.create({
        type: NotificationType.INSURANCE_EXPIRY,
        message: `Insurance for ${saved.plateNumber} expires on ${saved.insuranceExpiry.toDateString()}`,
        metadata: { vehicleId: saved.id, insuranceExpiry: saved.insuranceExpiry }
      });
    }
    return saved;
  }

  async updateVehicle(id: string, payload: unknown) {
    const vehicle = await this.vehicles.getVehicle(id);
    const data = updateVehicleSchema.parse(payload);
    Object.assign(vehicle, data);
    const saved = await this.vehicles.save(vehicle);
    await this.audit.log('UPDATE', 'Vehicle', saved.id, undefined, data as Record<string, unknown>);
    return saved;
  }

  async deleteVehicle(id: string) {
    await this.vehicles.getVehicle(id);
    await this.vehicles.delete(id);
    await this.audit.log('DELETE', 'Vehicle', id);
  }

  async addMaintenance(id: string, payload: unknown) {
    const vehicle = await this.vehicles.getVehicle(id);
    const data = maintenanceSchema.parse(payload);
    const entry = Object.assign(new Maintenance(), data, { vehicle });
    const saved = await this.vehicles.addMaintenance(entry);
    await this.notifications.create({
      type: NotificationType.MAINTENANCE_DUE,
      message: `Maintenance scheduled for ${vehicle.plateNumber} on ${data.scheduledDate.toDateString()}`,
      metadata: { vehicleId: vehicle.id, scheduledDate: data.scheduledDate }
    });
    await this.audit.log('CREATE', 'Maintenance', saved.id, undefined, data as Record<string, unknown>);
    return saved;
  }

  async addTrip(id: string, payload: unknown) {
    const vehicle = await this.vehicles.getVehicle(id);
    const data = tripSchema.parse(payload);
    const driver = await this.drivers.getDriver(data.driverId);
    const entry = Object.assign(new Trip(), data, { vehicle, driver });
    const saved = await this.vehicles.addTrip(entry);
    await this.audit.log('CREATE', 'Trip', saved.id, driver.user?.id, data as Record<string, unknown>);
    return saved;
  }

  async addDocument(id: string, payload: unknown) {
    const vehicle = await this.vehicles.getVehicle(id);
    const data = documentSchema.parse(payload);
    const saved = await this.vehicles.addDocument({ ...data, vehicle });
    if (data.expiryDate) {
      const type =
        data.type === DocumentType.INSURANCE || data.type === DocumentType.PERMIT || data.type === DocumentType.REGISTRATION
          ? NotificationType.INSURANCE_EXPIRY
          : NotificationType.PAYMENT_PENDING;
      await this.notifications.create({
        type,
        message: `${data.type} for ${vehicle.plateNumber} expires on ${data.expiryDate.toDateString()}`,
        metadata: { vehicleId: vehicle.id, documentId: saved.id, expiryDate: data.expiryDate }
      });
    }
    await this.audit.log('CREATE', 'Document', saved.id, undefined, data as Record<string, unknown>);
    return saved;
  }

  listDocuments(id: string) {
    return this.vehicles.listDocuments(id);
  }

  async assignDriver(vehicleId: string, payload: unknown) {
    const vehicle = await this.vehicles.getVehicle(vehicleId);
    const data = assignDriverSchema.parse(payload);
    const driver = await this.drivers.getDriver(data.driverId);
    await this.vehicles.closeAssignmentsForVehicle(vehicleId);
    driver.assignedVehicle = vehicle;
    await this.drivers.save(driver);
    const assignment = await this.vehicles.createAssignment({
      vehicle,
      driver,
      assignedAt: data.assignedAt ?? new Date(),
      notes: data.notes
    });
    await this.audit.log('ASSIGN', 'Vehicle', vehicle.id, driver.user?.id, { driverId: driver.id });
    return assignment;
  }

  listAssignments(vehicleId: string) {
    return this.vehicles.listAssignments(vehicleId);
  }

  async releaseDriver(vehicleId: string) {
    const vehicle = await this.vehicles.getVehicle(vehicleId);
    const assignments = await this.vehicles.closeAssignmentsForVehicle(vehicleId);
    for (const assignment of assignments) {
      assignment.driver.assignedVehicle = undefined;
      await this.drivers.save(assignment.driver);
      await this.audit.log('RELEASE', 'Vehicle', vehicle.id, assignment.driver.user?.id, { assignmentId: assignment.id });
    }
    return assignments;
  }
}
