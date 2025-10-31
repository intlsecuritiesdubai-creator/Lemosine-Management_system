import { Column } from 'typeorm';

export abstract class AuditableEntity {
  @Column({ nullable: true })
  createdBy?: string;

  @Column({ nullable: true })
  updatedBy?: string;
}
