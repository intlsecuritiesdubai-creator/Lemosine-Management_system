import { VehicleRepository } from './vehicle.repository';
import { createVehicleSchema, maintenanceSchema, tripSchema, updateVehicleSchema } from './fleet.dto';
import { DriverRepository } from '../drivers/driver.repository';
import { Maintenance } from './maintenance.entity';
import { Trip } from './trip.entity';

export class VehicleService {
  private readonly vehicles = new VehicleRepository();
  private readonly drivers = new DriverRepository();

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
    return this.vehicles.save(vehicle);
  }

  async updateVehicle(id: string, payload: unknown) {
    const vehicle = await this.vehicles.getVehicle(id);
    const data = updateVehicleSchema.parse(payload);
    Object.assign(vehicle, data);
    return this.vehicles.save(vehicle);
  }

  async deleteVehicle(id: string) {
    await this.vehicles.getVehicle(id);
    await this.vehicles.delete(id);
  }

  async addMaintenance(id: string, payload: unknown) {
    const vehicle = await this.vehicles.getVehicle(id);
    const data = maintenanceSchema.parse(payload);
    const entry = Object.assign(new Maintenance(), data, { vehicle });
    return this.vehicles.addMaintenance(entry);
  }

  async addTrip(id: string, payload: unknown) {
    const vehicle = await this.vehicles.getVehicle(id);
    const data = tripSchema.parse(payload);
    const driver = await this.drivers.getDriver(data.driverId);
    const entry = Object.assign(new Trip(), data, { vehicle, driver });
    return this.vehicles.addTrip(entry);
  }
}
