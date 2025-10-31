import { DriverRepository } from './driver.repository';
import { createDriverSchema, updateDriverSchema } from './driver.dto';
import { UserRepository } from '../users/user.repository';
import { VehicleRepository } from '../fleet/vehicle.repository';

export class DriverService {
  private readonly drivers = new DriverRepository();
  private readonly users = new UserRepository();
  private readonly vehicles = new VehicleRepository();

  listDrivers() {
    return this.drivers.findAll();
  }

  async getDriver(id: string) {
    return this.drivers.getDriver(id);
  }

  async createDriver(payload: unknown) {
    const data = createDriverSchema.parse(payload);
    const user = await this.users.findById(data.userId);
    if (!user) {
      throw Object.assign(new Error('User not found'), { status: 404 });
    }
    const driver = this.drivers.create({
      user,
      emiratesId: data.emiratesId,
      licenseNumber: data.licenseNumber,
      licenseExpiry: data.licenseExpiry,
      visaExpiry: data.visaExpiry,
      baseSalary: data.baseSalary,
      overtimeRate: data.overtimeRate
    });
    if (data.assignedVehicleId) {
      const vehicle = await this.vehicles.findById(data.assignedVehicleId);
      if (!vehicle) {
        throw Object.assign(new Error('Vehicle not found'), { status: 404 });
      }
      driver.assignedVehicle = vehicle;
    }
    return this.drivers.save(driver);
  }

  async updateDriver(id: string, payload: unknown) {
    const driver = await this.drivers.getDriver(id);
    const data = updateDriverSchema.parse(payload);
    if (data.userId) {
      const user = await this.users.findById(data.userId);
      if (!user) {
        throw Object.assign(new Error('User not found'), { status: 404 });
      }
      driver.user = user;
    }
    if (data.assignedVehicleId) {
      const vehicle = await this.vehicles.findById(data.assignedVehicleId);
      if (!vehicle) {
        throw Object.assign(new Error('Vehicle not found'), { status: 404 });
      }
      driver.assignedVehicle = vehicle;
    }
    Object.assign(driver, {
      emiratesId: data.emiratesId ?? driver.emiratesId,
      licenseNumber: data.licenseNumber ?? driver.licenseNumber,
      licenseExpiry: data.licenseExpiry ?? driver.licenseExpiry,
      visaExpiry: data.visaExpiry ?? driver.visaExpiry,
      baseSalary: data.baseSalary ?? driver.baseSalary,
      overtimeRate: data.overtimeRate ?? driver.overtimeRate
    });
    return this.drivers.save(driver);
  }
}
