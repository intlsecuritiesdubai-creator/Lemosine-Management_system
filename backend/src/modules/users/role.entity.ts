import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../shared/base.entity';
import { User } from './user.entity';

@Entity('roles')
export class Role extends BaseEntity {
  @Column({ unique: true })
  name!: string;

  @Column({ type: 'jsonb', default: () => "'{}'::jsonb" })
  permissions!: Record<string, boolean>;

  @OneToMany(() => User, (user) => user.role)
  users!: User[];
}
