import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../shared/base.entity';
import { Driver } from '../drivers/driver.entity';
import { SalaryStatus } from '../shared/enums';

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

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  allowances!: number;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  overtimePay!: number;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  netAmount!: number;

  @Column({ type: 'enum', enum: SalaryStatus, default: SalaryStatus.DRAFT })
  status!: SalaryStatus;

  @Column({ nullable: true })
  paymentDate?: Date;

  @Column({ nullable: true })
  generatedBy?: string;

  @ManyToOne(() => Driver, { eager: true })
  @JoinColumn({ name: 'driver_id' })
  driver!: Driver;
}
