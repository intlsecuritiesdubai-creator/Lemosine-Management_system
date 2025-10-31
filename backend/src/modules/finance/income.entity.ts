import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../shared/base.entity';
import { IncomeSource } from '../shared/enums';
import { Vehicle } from '../fleet/vehicle.entity';
import { Driver } from '../drivers/driver.entity';

@Entity('income_records')
export class Income extends BaseEntity {
  @Column({ type: 'enum', enum: IncomeSource })
  source!: IncomeSource;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  amount!: number;

  @Column({ type: 'date' })
  receivedOn!: Date;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @ManyToOne(() => Vehicle, { eager: true, nullable: true })
  @JoinColumn({ name: 'vehicle_id' })
  vehicle?: Vehicle;

  @ManyToOne(() => Driver, { eager: true, nullable: true })
  @JoinColumn({ name: 'driver_id' })
  driver?: Driver;
}
