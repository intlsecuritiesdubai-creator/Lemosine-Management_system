import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';
import { NotificationType, UserRole } from './enums';

@Entity('notifications')
export class Notification extends BaseEntity {
  @Column({ type: 'enum', enum: NotificationType })
  type!: NotificationType;

  @Column()
  message!: string;

  @Column({ default: false })
  isRead!: boolean;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, unknown>;

  @Column({ type: 'enum', enum: UserRole, nullable: true })
  targetRole?: UserRole;

  @Column({ nullable: true })
  targetUserId?: string;

  @Column({ type: 'timestamp', nullable: true })
  acknowledgedAt?: Date;
}
