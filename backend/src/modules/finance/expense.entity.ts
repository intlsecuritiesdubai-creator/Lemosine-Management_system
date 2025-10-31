import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../shared/base.entity';
import { ExpenseCategory, ExpenseStatus } from '../shared/enums';
import { Vehicle } from '../fleet/vehicle.entity';
import { Driver } from '../drivers/driver.entity';

@Entity('expenses')
export class Expense extends BaseEntity {
  @Column({ type: 'enum', enum: ExpenseCategory })
  category!: ExpenseCategory;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  amount!: number;

  @Column({ type: 'date' })
  incurredOn!: Date;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: ExpenseStatus, default: ExpenseStatus.PENDING })
  status!: ExpenseStatus;

  @Column({ nullable: true })
  receiptUrl?: string;

  @Column({ nullable: true })
  approvedBy?: string;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt?: Date;

  @Column({ nullable: true })
  notes?: string;

  @ManyToOne(() => Vehicle, { eager: true, nullable: true })
  @JoinColumn({ name: 'vehicle_id' })
  vehicle?: Vehicle;

  @ManyToOne(() => Driver, { eager: true, nullable: true })
  @JoinColumn({ name: 'driver_id' })
  driver?: Driver;
}
