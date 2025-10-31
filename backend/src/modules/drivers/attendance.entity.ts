import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../shared/base.entity';
import { Driver } from './driver.entity';
import { AttendanceStatus } from '../shared/enums';

@Entity('driver_attendance')
export class AttendanceRecord extends BaseEntity {
  @ManyToOne(() => Driver, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'driver_id' })
  driver!: Driver;

  @Column({ type: 'date' })
  date!: Date;

  @Column({ type: 'enum', enum: AttendanceStatus })
  status!: AttendanceStatus;

  @Column({ type: 'time', nullable: true })
  checkIn?: string;

  @Column({ type: 'time', nullable: true })
  checkOut?: string;

  @Column({ nullable: true })
  notes?: string;
}
