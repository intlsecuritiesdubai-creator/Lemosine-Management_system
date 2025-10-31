import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../shared/base.entity';
import { Driver } from './driver.entity';

@Entity('driver_performance_reviews')
export class PerformanceReview extends BaseEntity {
  @ManyToOne(() => Driver, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'driver_id' })
  driver!: Driver;

  @Column({ nullable: true })
  reviewerId?: string;

  @Column({ type: 'date' })
  periodStart!: Date;

  @Column({ type: 'date' })
  periodEnd!: Date;

  @Column({ type: 'numeric', precision: 5, scale: 2 })
  score!: number;

  @Column({ nullable: true })
  comments?: string;
}
