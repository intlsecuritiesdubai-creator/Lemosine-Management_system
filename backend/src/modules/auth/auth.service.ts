import { UserRepository } from '../users/user.repository';
import { RoleRepository } from '../users/role.repository';
import { comparePassword, hashPassword } from '../../core/utils/password';
import { signAccessToken, signRefreshToken } from '../../core/utils/token';
import { UserRole } from '../shared/enums';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(3)
});

export class AuthService {
  private readonly users = new UserRepository();
  private readonly roles = new RoleRepository();

  async login(payload: unknown) {
    const { email, password } = loginSchema.parse(payload);
    const user = await this.users.findByEmail(email);
    if (!user) {
      throw Object.assign(new Error('Invalid credentials'), { status: 401 });
    }
    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      throw Object.assign(new Error('Invalid credentials'), { status: 401 });
    }
    const accessToken = signAccessToken({ sub: user.id, role: user.role.name });
    const refreshToken = signRefreshToken({ sub: user.id, role: user.role.name });
    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role.name
      }
    };
  }

  async registerSuperAdmin() {
    await this.roles.seedDefaults();
    const existing = await this.users.findByEmail('admin@limousine.local');
    if (existing) {
      return existing;
    }
    const role = await this.roles.findByName(UserRole.SUPER_ADMIN);
    const admin = this.users.create({
      email: 'admin@limousine.local',
      fullName: 'System Administrator',
      password: await hashPassword('ChangeMe123!'),
      role,
      createdBy: 'system',
      updatedBy: 'system'
    });
    return this.users.save(admin);
  }

  async registerDriver(payload: unknown, roleName = UserRole.DRIVER) {
    const data = registerSchema.parse(payload);
    const existing = await this.users.findByEmail(data.email);
    if (existing) {
      throw Object.assign(new Error('Email already registered'), { status: 409 });
    }
    const role = await this.roles.findByName(roleName);
    if (!role) {
      throw Object.assign(new Error('Role not found'), { status: 400 });
    }
    const user = this.users.create({
      email: data.email,
      fullName: data.fullName,
      password: await hashPassword(data.password),
      role,
      createdBy: 'system',
      updatedBy: 'system'
    });
    return this.users.save(user);
  }
}
