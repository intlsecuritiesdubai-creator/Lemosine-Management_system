import { z } from 'zod';
import { AttendanceStatus, DocumentType, LeaveStatus, LeaveType } from '../shared/enums';

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

export const attendanceSchema = z.object({
  date: z.coerce.date(),
  status: z.nativeEnum(AttendanceStatus),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  notes: z.string().optional()
});

export const leaveSchema = z.object({
  type: z.nativeEnum(LeaveType),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  reason: z.string().optional()
});

export const leaveDecisionSchema = z.object({
  status: z.nativeEnum(LeaveStatus),
  approvedBy: z.string().optional()
});

export const performanceSchema = z.object({
  reviewerId: z.string().optional(),
  periodStart: z.coerce.date(),
  periodEnd: z.coerce.date(),
  score: z.number().min(0).max(5),
  comments: z.string().optional()
});

export const driverDocumentSchema = z.object({
  title: z.string().min(3),
  type: z.nativeEnum(DocumentType),
  url: z.string().url(),
  issuedAt: z.coerce.date().optional(),
  expiryDate: z.coerce.date().optional()
});
