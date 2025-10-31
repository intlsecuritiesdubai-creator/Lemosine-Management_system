import { z } from 'zod';
import { ExpenseCategory, ExpenseStatus, IncomeSource, SalaryStatus } from '../shared/enums';

export const expenseSchema = z.object({
  category: z.nativeEnum(ExpenseCategory),
  amount: z.number().min(0),
  incurredOn: z.coerce.date(),
  description: z.string().optional(),
  status: z.nativeEnum(ExpenseStatus).optional(),
  receiptUrl: z.string().url().optional(),
  vehicleId: z.string().optional(),
  driverId: z.string().optional()
});

export const incomeSchema = z.object({
  source: z.nativeEnum(IncomeSource),
  amount: z.number().min(0),
  receivedOn: z.coerce.date(),
  description: z.string().optional(),
  reference: z.string().optional(),
  vehicleId: z.string().optional(),
  driverId: z.string().optional()
});

export const expenseApprovalSchema = z.object({
  status: z.nativeEnum(ExpenseStatus),
  approvedBy: z.string().optional(),
  notes: z.string().optional()
});

export const payoutSchema = z.object({
  salaryId: z.string(),
  paymentDate: z.coerce.date(),
  status: z.nativeEnum(SalaryStatus)
});
