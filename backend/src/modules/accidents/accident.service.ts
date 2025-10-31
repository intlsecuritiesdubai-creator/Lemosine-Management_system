import { AccidentRepository } from './accident.repository';
import { accidentSchema } from './accident.dto';
import { VehicleRepository } from '../fleet/vehicle.repository';
import { DriverRepository } from '../drivers/driver.repository';
import { AuditService } from '../shared/audit.service';
import { NotificationService } from '../shared/notification.service';
import { NotificationType } from '../shared/enums';

export class AccidentService {
  private readonly repo = new AccidentRepository();
  private readonly vehicles = new VehicleRepository();
  private readonly drivers = new DriverRepository();
  private readonly audit = new AuditService();
  private readonly notifications = new NotificationService();

  listAccidents() {
    return this.repo.list();
  }

  async getAccident(id: string) {
    const accident = await this.repo.get(id);
    if (!accident) {
      throw Object.assign(new Error('Accident not found'), { status: 404 });
    }
    return accident;
  }

  async createAccident(payload: unknown) {
    const data = accidentSchema.parse(payload);
    const vehicle = await this.vehicles.getVehicle(data.vehicleId);
    const driver = await this.drivers.getDriver(data.driverId);
    const accident = await this.repo.create({
      vehicle,
      driver,
      occurredOn: data.occurredOn,
      description: data.description,
      damageCost: data.damageCost,
      policeReportNumber: data.policeReportNumber,
      notes: data.notes,
      attachments: data.attachments,
      insuranceClaim: data.insuranceClaim,
      deductedFromSalary: data.deductedFromSalary
    });
    await this.audit.log('CREATE', 'Accident', accident.id, driver.user.id, data as Record<string, unknown>);
    await this.notifications.create({
      type: NotificationType.INCIDENT,
      message: `Accident reported for ${vehicle.plateNumber}`,
      metadata: { accidentId: accident.id, vehicleId: vehicle.id, driverId: driver.id }
    });
    return accident;
  }
}
