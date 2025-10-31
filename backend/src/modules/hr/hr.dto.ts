import { z } from 'zod';
import { SalaryStatus } from '../shared/enums';

export const salarySchema = z.object({
  driverId: z.string(),
  periodStart: z.coerce.date(),
  periodEnd: z.coerce.date(),
  grossAmount: z.number().min(0),
  deductions: z.number().min(0).default(0),
  allowances: z.number().min(0).default(0),
  overtimeHours: z.number().min(0).default(0),
  overtimeRate: z.number().min(0).optional(),
  status: z.nativeEnum(SalaryStatus).default(SalaryStatus.DRAFT),
  paymentDate: z.coerce.date().optional()
});
