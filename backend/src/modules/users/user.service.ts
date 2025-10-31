import { UserRepository } from './user.repository';
import { RoleRepository } from './role.repository';
import { createUserSchema, updateUserSchema } from './dto';
import { hashPassword } from '../../core/utils/password';
import { UserRole } from '../shared/enums';

export class UserService {
  private readonly userRepository = new UserRepository();
  private readonly roleRepository = new RoleRepository();

  async listUsers() {
    return this.userRepository.findAll();
  }

  async getUser(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw Object.assign(new Error('User not found'), { status: 404 });
    }
    return user;
  }

  async createUser(payload: unknown, actorId: string) {
    const data = createUserSchema.parse(payload);
    const existing = await this.userRepository.findByEmail(data.email);
    if (existing) {
      throw Object.assign(new Error('Email already registered'), { status: 409 });
    }
    const role = await this.roleRepository.findByName(data.role);
    if (!role) {
      throw Object.assign(new Error('Role not found'), { status: 400 });
    }
    const user = this.userRepository.create({
      email: data.email,
      fullName: data.fullName,
      password: await hashPassword(data.password),
      phone: data.phone,
      role,
      createdBy: actorId,
      updatedBy: actorId
    });
    return this.userRepository.save(user);
  }

  async updateUser(id: string, payload: unknown, actorId: string) {
    const data = updateUserSchema.parse(payload);
    const user = await this.getUser(id);
    if (data.email && data.email !== user.email) {
      const existing = await this.userRepository.findByEmail(data.email);
      if (existing) {
        throw Object.assign(new Error('Email already registered'), { status: 409 });
      }
      user.email = data.email;
    }
    if (data.fullName) {
      user.fullName = data.fullName;
    }
    if (data.phone) {
      user.phone = data.phone;
    }
    if (data.role) {
      const role = await this.roleRepository.findByName(data.role);
      if (!role) {
        throw Object.assign(new Error('Role not found'), { status: 400 });
      }
      user.role = role;
    }
    user.updatedBy = actorId;
    return this.userRepository.save(user);
  }

  async deleteUser(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw Object.assign(new Error('User not found'), { status: 404 });
    }
    if (user.role?.name === UserRole.SUPER_ADMIN) {
      throw Object.assign(new Error('Cannot delete super admin'), { status: 400 });
    }
    await this.userRepository.delete(id);
  }

  async ensureSystemRoles() {
    const roles = await this.roleRepository.findAll();
    if (roles.length === 0) {
      await this.roleRepository.seedDefaults();
    }
  }
}
