import { Repository } from 'typeorm';
import { AppDataSource } from '../../database/data-source';
import { Salary } from './salary.entity';

export class HrRepository {
  private readonly repo: Repository<Salary>;

  constructor() {
    this.repo = AppDataSource.getRepository(Salary);
  }

  listSalaries() {
    return this.repo.find({ order: { periodEnd: 'DESC' } });
  }

  async createSalary(data: Partial<Salary>) {
    const salary = this.repo.create(data);
    return this.repo.save(salary);
  }

  getSalary(id: string) {
    return this.repo.findOneBy({ id });
  }

  saveSalary(salary: Salary) {
    return this.repo.save(salary);
  }

  listByDriver(driverId: string) {
    return this.repo.find({ where: { driver: { id: driverId } }, order: { periodEnd: 'DESC' } });
  }
}
