import { Repository } from 'typeorm';
import { AppDataSource } from '../../database/data-source';
import { Driver } from './driver.entity';

export class DriverRepository {
  private readonly repo: Repository<Driver>;

  constructor() {
    this.repo = AppDataSource.getRepository(Driver);
  }

  findAll() {
    return this.repo.find({ relations: ['assignedVehicle', 'trips', 'accidents'] });
  }

  findByUserId(userId: string) {
    return this.repo.find({ where: { user: { id: userId } }, relations: ['assignedVehicle'] });
  }

  async getDriver(id: string) {
    const driver = await this.repo.findOne({ where: { id }, relations: ['assignedVehicle', 'trips', 'accidents'] });
    if (!driver) {
      throw Object.assign(new Error('Driver not found'), { status: 404 });
    }
    return driver;
  }

  create(data: Partial<Driver>) {
    return this.repo.create(data);
  }

  save(driver: Driver) {
    return this.repo.save(driver);
  }
}
