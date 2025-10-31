import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../shared/base.entity';
import { VehicleStatus } from '../shared/enums';
import { Maintenance } from './maintenance.entity';
import { Trip } from './trip.entity';

@Entity('vehicles')
export class Vehicle extends BaseEntity {
  @Column({ unique: true })
  plateNumber!: string;

  @Column()
  brand!: string;

  @Column()
  model!: string;

  @Column()
  year!: number;

  @Column({ type: 'enum', enum: VehicleStatus, default: VehicleStatus.ACTIVE })
  status!: VehicleStatus;

  @Column({ nullable: true })
  insuranceExpiry?: Date;

  @Column({ nullable: true })
  registrationExpiry?: Date;

  @Column({ nullable: true })
  permitExpiry?: Date;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  mileage!: number;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  fuelUsage!: number;

  @OneToMany(() => Maintenance, (maintenance) => maintenance.vehicle)
  maintenanceRecords!: Maintenance[];

  @OneToMany(() => Trip, (trip) => trip.vehicle)
  trips!: Trip[];
}
