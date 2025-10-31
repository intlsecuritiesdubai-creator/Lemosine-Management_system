import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../shared/base.entity';
import { Vehicle } from './vehicle.entity';
import { Driver } from '../drivers/driver.entity';

@Entity('vehicle_assignments')
export class VehicleAssignment extends BaseEntity {
  @ManyToOne(() => Vehicle, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vehicle_id' })
  vehicle!: Vehicle;

  @ManyToOne(() => Driver, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'driver_id' })
  driver!: Driver;

  @Column({ type: 'timestamp' })
  assignedAt!: Date;

  @Column({ type: 'timestamp', nullable: true })
  releasedAt?: Date;

  @Column({ nullable: true })
  notes?: string;
}
