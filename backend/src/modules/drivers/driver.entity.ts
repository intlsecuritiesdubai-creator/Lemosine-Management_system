import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../shared/base.entity';
import { User } from '../users/user.entity';
import { Vehicle } from '../fleet/vehicle.entity';
import { Trip } from '../fleet/trip.entity';
import { Accident } from '../accidents/accident.entity';
import { AttendanceRecord } from './attendance.entity';
import { LeaveRequest } from './leave.entity';
import { PerformanceReview } from './performance.entity';
import { Document } from '../shared/document.entity';

@Entity('drivers')
export class Driver extends BaseEntity {
  @Column()
  emiratesId!: string;

  @Column()
  licenseNumber!: string;

  @Column({ type: 'date' })
  licenseExpiry!: Date;

  @Column({ type: 'date', nullable: true })
  visaExpiry?: Date;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  baseSalary!: number;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  overtimeRate!: number;

  @Column({ default: true })
  isActive!: boolean;

  @ManyToOne(() => User, (user) => user.drivers, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Vehicle, { eager: true, nullable: true })
  @JoinColumn({ name: 'assigned_vehicle_id' })
  assignedVehicle?: Vehicle;

  @OneToMany(() => Trip, (trip) => trip.driver)
  trips!: Trip[];

  @OneToMany(() => Accident, (accident) => accident.driver)
  accidents!: Accident[];

  @OneToMany(() => AttendanceRecord, (attendance) => attendance.driver)
  attendanceRecords!: AttendanceRecord[];

  @OneToMany(() => LeaveRequest, (leave) => leave.driver)
  leaves!: LeaveRequest[];

  @OneToMany(() => PerformanceReview, (review) => review.driver)
  performanceReviews!: PerformanceReview[];

  @OneToMany(() => Document, (document) => document.driver)
  documents!: Document[];
}
