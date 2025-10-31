import { z } from 'zod';

export const salarySchema = z.object({
  driverId: z.string(),
  periodStart: z.coerce.date(),
  periodEnd: z.coerce.date(),
  grossAmount: z.number().min(0),
  deductions: z.number().min(0).default(0),
  status: z.enum(['PENDING', 'PAID']).default('PENDING'),
  paymentDate: z.coerce.date().optional()
});
