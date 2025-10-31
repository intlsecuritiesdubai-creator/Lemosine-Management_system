import { Repository } from 'typeorm';
import { AppDataSource } from '../../database/data-source';
import { User } from './user.entity';

export class UserRepository {
  private readonly repo: Repository<User>;

  constructor() {
    this.repo = AppDataSource.getRepository(User);
  }

  findAll() {
    return this.repo.find();
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  create(user: Partial<User>) {
    return this.repo.create(user);
  }

  save(user: User) {
    return this.repo.save(user);
  }

  async delete(id: string) {
    await this.repo.delete({ id });
  }
}
