import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { DocumentType } from './enums';
import { Vehicle } from '../fleet/vehicle.entity';
import { Driver } from '../drivers/driver.entity';

@Entity('documents')
export class Document extends BaseEntity {
  @Column()
  title!: string;

  @Column({ type: 'enum', enum: DocumentType })
  type!: DocumentType;

  @Column()
  url!: string;

  @Column({ type: 'date', nullable: true })
  issuedAt?: Date;

  @Column({ type: 'date', nullable: true })
  expiryDate?: Date;

  @ManyToOne(() => Vehicle, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vehicle_id' })
  vehicle?: Vehicle;

  @ManyToOne(() => Driver, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'driver_id' })
  driver?: Driver;
}
