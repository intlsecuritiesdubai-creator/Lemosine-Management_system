import { z } from 'zod';

export const createDriverSchema = z.object({
  userId: z.string(),
  emiratesId: z.string().min(5),
  licenseNumber: z.string().min(5),
  licenseExpiry: z.coerce.date(),
  visaExpiry: z.coerce.date().optional(),
  baseSalary: z.number().min(0),
  overtimeRate: z.number().min(0),
  assignedVehicleId: z.string().optional()
});

export const updateDriverSchema = createDriverSchema.partial().extend({ userId: z.string().optional() });
