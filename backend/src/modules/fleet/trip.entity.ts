import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../shared/base.entity';
import { Vehicle } from './vehicle.entity';
import { Driver } from '../drivers/driver.entity';

@Entity('trips')
export class Trip extends BaseEntity {
  @Column()
  clientName!: string;

  @Column({ type: 'timestamp' })
  startTime!: Date;

  @Column({ type: 'timestamp' })
  endTime!: Date;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  revenue!: number;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.trips, { eager: true })
  @JoinColumn({ name: 'vehicle_id' })
  vehicle!: Vehicle;

  @ManyToOne(() => Driver, (driver) => driver.trips, { eager: true })
  @JoinColumn({ name: 'driver_id' })
  driver!: Driver;
}
