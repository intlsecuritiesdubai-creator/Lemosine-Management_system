import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../shared/base.entity';
import { AuditableEntity } from '../shared/audit.entity';
import { Role } from './role.entity';
import { Driver } from '../drivers/driver.entity';

@Entity('users')
export class User extends BaseEntity implements AuditableEntity {
  @Column({ unique: true })
  email!: string;

  @Column()
  fullName!: string;

  @Column()
  password!: string;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  createdBy?: string;

  @Column({ nullable: true })
  updatedBy?: string;

  @ManyToOne(() => Role, (role) => role.users, { eager: true })
  @JoinColumn({ name: 'role_id' })
  role!: Role;

  @OneToMany(() => Driver, (driver) => driver.user)
  drivers!: Driver[];
}
