import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../shared/base.entity';
import { Driver } from '../drivers/driver.entity';

@Entity('salary_records')
export class Salary extends BaseEntity {
  @Column({ type: 'date' })
  periodStart!: Date;

  @Column({ type: 'date' })
  periodEnd!: Date;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  grossAmount!: number;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  deductions!: number;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  netAmount!: number;

  @Column({ default: 'PENDING' })
  status!: string;

  @Column({ nullable: true })
  paymentDate?: Date;

  @ManyToOne(() => Driver, { eager: true })
  @JoinColumn({ name: 'driver_id' })
  driver!: Driver;
}
