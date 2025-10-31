import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../shared/base.entity';
import { Vehicle } from '../fleet/vehicle.entity';
import { Driver } from '../drivers/driver.entity';

@Entity('accidents')
export class Accident extends BaseEntity {
  @Column({ type: 'date' })
  occurredOn!: Date;

  @Column({ type: 'text' })
  description!: string;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  damageCost!: number;

  @Column({ nullable: true })
  policeReportNumber?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ManyToOne(() => Vehicle, { eager: true })
  @JoinColumn({ name: 'vehicle_id' })
  vehicle!: Vehicle;

  @ManyToOne(() => Driver, (driver) => driver.accidents, { eager: true })
  @JoinColumn({ name: 'driver_id' })
  driver!: Driver;
}
