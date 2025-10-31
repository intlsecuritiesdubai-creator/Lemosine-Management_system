import { Repository } from 'typeorm';
import { AppDataSource } from '../../database/data-source';
import { Role } from './role.entity';
import { UserRole } from '../shared/enums';

const DEFAULT_PERMISSIONS: Record<UserRole, Record<string, boolean>> = {
  [UserRole.SUPER_ADMIN]: {
    manageUsers: true,
    manageFleet: true,
    manageFinance: true,
    manageHR: true,
    viewReports: true
  },
  [UserRole.FLEET_MANAGER]: {
    manageUsers: false,
    manageFleet: true,
    manageFinance: false,
    manageHR: false,
    viewReports: true
  },
  [UserRole.FINANCE_OFFICER]: {
    manageUsers: false,
    manageFleet: false,
    manageFinance: true,
    manageHR: true,
    viewReports: true
  },
  [UserRole.DRIVER]: {
    manageUsers: false,
    manageFleet: false,
    manageFinance: false,
    manageHR: false,
    viewReports: true
  },
  [UserRole.CLIENT_MANAGER]: {
    manageUsers: false,
    manageFleet: false,
    manageFinance: false,
    manageHR: false,
    viewReports: true
  },
  [UserRole.VIEWER]: {
    manageUsers: false,
    manageFleet: false,
    manageFinance: false,
    manageHR: false,
    viewReports: true
  }
};

export class RoleRepository {
  private readonly repo: Repository<Role>;

  constructor() {
    this.repo = AppDataSource.getRepository(Role);
  }

  findAll() {
    return this.repo.find();
  }

  findByName(name: string) {
    return this.repo.findOne({ where: { name } });
  }

  create(role: Partial<Role>) {
    return this.repo.create(role);
  }

  save(role: Role) {
    return this.repo.save(role);
  }

  async seedDefaults() {
    const roles = Object.entries(DEFAULT_PERMISSIONS).map(([name, permissions]) =>
      this.repo.create({ name, permissions })
    );
    await this.repo.save(roles);
  }
}
