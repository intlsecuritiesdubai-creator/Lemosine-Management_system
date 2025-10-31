import { AccidentRepository } from './accident.repository';
import { accidentSchema } from './accident.dto';
import { VehicleRepository } from '../fleet/vehicle.repository';
import { DriverRepository } from '../drivers/driver.repository';

export class AccidentService {
  private readonly repo = new AccidentRepository();
  private readonly vehicles = new VehicleRepository();
  private readonly drivers = new DriverRepository();

  listAccidents() {
    return this.repo.list();
  }

  async createAccident(payload: unknown) {
    const data = accidentSchema.parse(payload);
    const vehicle = await this.vehicles.getVehicle(data.vehicleId);
    const driver = await this.drivers.getDriver(data.driverId);
    return this.repo.create({
      vehicle,
      driver,
      occurredOn: data.occurredOn,
      description: data.description,
      damageCost: data.damageCost,
      policeReportNumber: data.policeReportNumber,
      notes: data.notes
    });
  }
}
