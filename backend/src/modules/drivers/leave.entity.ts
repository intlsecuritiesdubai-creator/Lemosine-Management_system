import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../shared/base.entity';
import { Driver } from './driver.entity';
import { LeaveStatus, LeaveType } from '../shared/enums';

@Entity('driver_leaves')
export class LeaveRequest extends BaseEntity {
  @ManyToOne(() => Driver, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'driver_id' })
  driver!: Driver;

  @Column({ type: 'enum', enum: LeaveType })
  type!: LeaveType;

  @Column({ type: 'date' })
  startDate!: Date;

  @Column({ type: 'date' })
  endDate!: Date;

  @Column({ type: 'enum', enum: LeaveStatus, default: LeaveStatus.REQUESTED })
  status!: LeaveStatus;

  @Column({ nullable: true })
  reason?: string;

  @Column({ nullable: true })
  approvedBy?: string;
}
