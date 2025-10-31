import { z } from 'zod';
import { UserRole } from '../shared/enums';

export const createUserSchema = z.object({
  email: z.string().email(),
  fullName: z.string().min(3),
  password: z.string().min(8),
  phone: z.string().optional(),
  role: z.nativeEnum(UserRole)
});

export const updateUserSchema = createUserSchema.partial().omit({ password: true });
