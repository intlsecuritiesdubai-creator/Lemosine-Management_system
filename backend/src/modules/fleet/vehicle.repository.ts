import { Repository } from 'typeorm';
import { AppDataSource } from '../../database/data-source';
import { Vehicle } from './vehicle.entity';
import { Maintenance } from './maintenance.entity';
import { Trip } from './trip.entity';

export class VehicleRepository {
  private readonly repo: Repository<Vehicle>;
  private readonly maintenanceRepo: Repository<Maintenance>;
  private readonly tripRepo: Repository<Trip>;

  constructor() {
    this.repo = AppDataSource.getRepository(Vehicle);
    this.maintenanceRepo = AppDataSource.getRepository(Maintenance);
    this.tripRepo = AppDataSource.getRepository(Trip);
  }

  findAll() {
    return this.repo.find({ relations: ['maintenanceRecords', 'trips'] });
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id }, relations: ['maintenanceRecords', 'trips'] });
  }

  async getVehicle(id: string) {
    const vehicle = await this.findById(id);
    if (!vehicle) {
      throw Object.assign(new Error('Vehicle not found'), { status: 404 });
    }
    return vehicle;
  }

  findByPlate(plateNumber: string) {
    return this.repo.findOne({ where: { plateNumber } });
  }

  create(data: Partial<Vehicle>) {
    return this.repo.create(data);
  }

  save(vehicle: Vehicle) {
    return this.repo.save(vehicle);
  }

  async delete(id: string) {
    await this.repo.delete({ id });
  }

  async addMaintenance(entry: Maintenance) {
    return this.maintenanceRepo.save(entry);
  }

  async addTrip(entry: Trip) {
    return this.tripRepo.save(entry);
  }
}
