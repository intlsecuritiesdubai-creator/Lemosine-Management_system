import { z } from 'zod';
import { DocumentType, VehicleStatus } from '../shared/enums';

export const createVehicleSchema = z.object({
  plateNumber: z.string().min(3),
  brand: z.string().min(2),
  model: z.string().min(1),
  year: z.number().min(1990).max(new Date().getFullYear() + 1),
  status: z.nativeEnum(VehicleStatus).optional(),
  insuranceExpiry: z.coerce.date().optional(),
  registrationExpiry: z.coerce.date().optional(),
  permitExpiry: z.coerce.date().optional(),
  mileage: z.number().min(0).optional(),
  fuelUsage: z.number().min(0).optional()
});

export const updateVehicleSchema = createVehicleSchema.partial();

export const maintenanceSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  scheduledDate: z.coerce.date(),
  completedDate: z.coerce.date().optional(),
  cost: z.number().min(0),
  vendor: z.string().optional(),
  odometer: z.number().min(0).optional()
});

export const tripSchema = z.object({
  clientName: z.string(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  revenue: z.number().min(0),
  notes: z.string().optional(),
  driverId: z.string()
});

export const documentSchema = z.object({
  title: z.string().min(3),
  type: z.nativeEnum(DocumentType),
  url: z.string().url(),
  issuedAt: z.coerce.date().optional(),
  expiryDate: z.coerce.date().optional()
});

export const assignDriverSchema = z.object({
  driverId: z.string(),
  assignedAt: z.coerce.date().optional(),
  notes: z.string().optional()
});
