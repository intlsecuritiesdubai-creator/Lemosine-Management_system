import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../shared/base.entity';
import { Vehicle } from './vehicle.entity';

@Entity('maintenance_records')
export class Maintenance extends BaseEntity {
  @Column()
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'date' })
  scheduledDate!: Date;

  @Column({ type: 'date', nullable: true })
  completedDate?: Date;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  cost!: number;

  @Column({ nullable: true })
  vendor?: string;

  @Column({ type: 'numeric', precision: 12, scale: 2, nullable: true })
  odometer?: number;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.maintenanceRecords, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vehicle_id' })
  vehicle!: Vehicle;
}
