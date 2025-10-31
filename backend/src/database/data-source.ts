import { DataSource } from 'typeorm';
import { env } from '../config/env';
import { User } from '../modules/users/user.entity';
import { Role } from '../modules/users/role.entity';
import { Vehicle } from '../modules/fleet/vehicle.entity';
import { Driver } from '../modules/drivers/driver.entity';
import { Expense } from '../modules/finance/expense.entity';
import { Income } from '../modules/finance/income.entity';
import { Salary } from '../modules/hr/salary.entity';
import { Accident } from '../modules/accidents/accident.entity';
import { Trip } from '../modules/fleet/trip.entity';
import { Maintenance } from '../modules/fleet/maintenance.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.db.host,
  port: env.db.port,
  username: env.db.username,
  password: env.db.password,
  database: env.db.database,
  synchronize: false,
  logging: false,
  entities: [User, Role, Vehicle, Driver, Expense, Income, Salary, Accident, Trip, Maintenance],
  migrations: ['dist/migrations/*.js']
});
