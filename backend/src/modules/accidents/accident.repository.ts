import { Repository } from 'typeorm';
import { AppDataSource } from '../../database/data-source';
import { Accident } from './accident.entity';

export class AccidentRepository {
  private readonly repo: Repository<Accident>;

  constructor() {
    this.repo = AppDataSource.getRepository(Accident);
  }

  list() {
    return this.repo.find();
  }

  create(data: Partial<Accident>) {
    return this.repo.save(this.repo.create(data));
  }
}
