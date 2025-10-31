import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('audit_logs')
export class AuditLog extends BaseEntity {
  @Column()
  entityName!: string;

  @Column()
  entityId!: string;

  @Column()
  action!: string;

  @Column({ nullable: true })
  actorId?: string;

  @Column({ type: 'jsonb', nullable: true })
  changes?: Record<string, unknown>;
}
