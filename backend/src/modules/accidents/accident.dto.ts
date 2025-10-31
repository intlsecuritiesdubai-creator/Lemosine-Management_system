import { z } from 'zod';

export const accidentSchema = z.object({
  vehicleId: z.string(),
  driverId: z.string(),
  occurredOn: z.coerce.date(),
  description: z.string(),
  damageCost: z.number().min(0),
  policeReportNumber: z.string().optional(),
  notes: z.string().optional(),
  attachments: z
    .array(
      z.object({
        url: z.string().url(),
        label: z.string().optional()
      })
    )
    .optional(),
  insuranceClaim: z.number().min(0).optional(),
  deductedFromSalary: z.number().min(0).optional()
});
