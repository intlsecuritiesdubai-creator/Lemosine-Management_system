import { z } from 'zod';
import { ExpenseCategory, IncomeSource } from '../shared/enums';

export const expenseSchema = z.object({
  category: z.nativeEnum(ExpenseCategory),
  amount: z.number().min(0),
  incurredOn: z.coerce.date(),
  description: z.string().optional(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
  vehicleId: z.string().optional(),
  driverId: z.string().optional()
});

export const incomeSchema = z.object({
  source: z.nativeEnum(IncomeSource),
  amount: z.number().min(0),
  receivedOn: z.coerce.date(),
  description: z.string().optional(),
  vehicleId: z.string().optional(),
  driverId: z.string().optional()
});
