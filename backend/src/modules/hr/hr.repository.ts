import { Repository } from 'typeorm';
import { AppDataSource } from '../../database/data-source';
import { Salary } from './salary.entity';

export class HrRepository {
  private readonly repo: Repository<Salary>;

  constructor() {
    this.repo = AppDataSource.getRepository(Salary);
  }

  listSalaries() {
    return this.repo.find();
  }

  async createSalary(data: Partial<Salary>) {
    const salary = this.repo.create(data);
    return this.repo.save(salary);
  }
}
