import { DriverRepository } from './driver.repository';
import {
  createDriverSchema,
  updateDriverSchema,
  attendanceSchema,
  leaveSchema,
  leaveDecisionSchema,
  performanceSchema,
  driverDocumentSchema
} from './driver.dto';
import { UserRepository } from '../users/user.repository';
import { VehicleRepository } from '../fleet/vehicle.repository';
import { AuditService } from '../shared/audit.service';
import { NotificationService } from '../shared/notification.service';
import { NotificationType } from '../shared/enums';

export class DriverService {
  private readonly drivers = new DriverRepository();
  private readonly users = new UserRepository();
  private readonly vehicles = new VehicleRepository();
  private readonly audit = new AuditService();
  private readonly notifications = new NotificationService();

  listDrivers() {
    return this.drivers.findAll();
  }

  async getDriver(id: string) {
    return this.drivers.getDriver(id);
  }

  async createDriver(payload: unknown) {
    const data = createDriverSchema.parse(payload);
    const user = await this.users.findById(data.userId);
    if (!user) {
      throw Object.assign(new Error('User not found'), { status: 404 });
    }
    const driver = this.drivers.create({
      user,
      emiratesId: data.emiratesId,
      licenseNumber: data.licenseNumber,
      licenseExpiry: data.licenseExpiry,
      visaExpiry: data.visaExpiry,
      baseSalary: data.baseSalary,
      overtimeRate: data.overtimeRate
    });
    if (data.assignedVehicleId) {
      const vehicle = await this.vehicles.findById(data.assignedVehicleId);
      if (!vehicle) {
        throw Object.assign(new Error('Vehicle not found'), { status: 404 });
      }
      driver.assignedVehicle = vehicle;
    }
    const saved = await this.drivers.save(driver);
    await this.audit.log('CREATE', 'Driver', saved.id, user.id, data as Record<string, unknown>);
    if (saved.licenseExpiry) {
      await this.notifications.create({
        type: NotificationType.LICENSE_EXPIRY,
        message: `Driver license for ${saved.user.fullName} expires on ${saved.licenseExpiry.toDateString()}`,
        metadata: { driverId: saved.id, licenseExpiry: saved.licenseExpiry }
      });
    }
    return saved;
  }

  async updateDriver(id: string, payload: unknown) {
    const driver = await this.drivers.getDriver(id);
    const data = updateDriverSchema.parse(payload);
    if (data.userId) {
      const user = await this.users.findById(data.userId);
      if (!user) {
        throw Object.assign(new Error('User not found'), { status: 404 });
      }
      driver.user = user;
    }
    if (data.assignedVehicleId) {
      const vehicle = await this.vehicles.findById(data.assignedVehicleId);
      if (!vehicle) {
        throw Object.assign(new Error('Vehicle not found'), { status: 404 });
      }
      driver.assignedVehicle = vehicle;
    }
    Object.assign(driver, {
      emiratesId: data.emiratesId ?? driver.emiratesId,
      licenseNumber: data.licenseNumber ?? driver.licenseNumber,
      licenseExpiry: data.licenseExpiry ?? driver.licenseExpiry,
      visaExpiry: data.visaExpiry ?? driver.visaExpiry,
      baseSalary: data.baseSalary ?? driver.baseSalary,
      overtimeRate: data.overtimeRate ?? driver.overtimeRate
    });
    const saved = await this.drivers.save(driver);
    await this.audit.log('UPDATE', 'Driver', saved.id, saved.user.id, data as Record<string, unknown>);
    return saved;
  }

  async logAttendance(driverId: string, payload: unknown) {
    const driver = await this.drivers.getDriver(driverId);
    const data = attendanceSchema.parse(payload);
    const record = await this.drivers.logAttendance({ ...data, driver });
    await this.audit.log('CREATE', 'DriverAttendance', record.id, driver.user.id, data as Record<string, unknown>);
    return record;
  }

  listAttendance(driverId: string) {
    return this.drivers.listAttendance(driverId);
  }

  async requestLeave(driverId: string, payload: unknown) {
    const driver = await this.drivers.getDriver(driverId);
    const data = leaveSchema.parse(payload);
    const leave = await this.drivers.createLeave({ ...data, driver });
    await this.audit.log('CREATE', 'DriverLeave', leave.id, driver.user.id, data as Record<string, unknown>);
    await this.notifications.create({
      type: NotificationType.PAYMENT_PENDING,
      message: `New leave request from ${driver.user.fullName} (${data.type})`,
      metadata: { driverId: driver.id, leaveId: leave.id }
    });
    return leave;
  }

  async decideLeave(leaveId: string, payload: unknown) {
    const data = leaveDecisionSchema.parse(payload);
    const updated = await this.drivers.updateLeaveStatus(leaveId, data.status, data.approvedBy);
    await this.audit.log('UPDATE', 'DriverLeave', updated.id, data.approvedBy, { status: data.status });
    return updated;
  }

  listLeaves(driverId: string) {
    return this.drivers.listLeaves(driverId);
  }

  async addPerformance(driverId: string, payload: unknown) {
    const driver = await this.drivers.getDriver(driverId);
    const data = performanceSchema.parse(payload);
    const review = await this.drivers.addPerformanceReview({ ...data, driver });
    await this.audit.log('CREATE', 'DriverPerformance', review.id, data.reviewerId, data as Record<string, unknown>);
    return review;
  }

  listPerformance(driverId: string) {
    return this.drivers.listPerformance(driverId);
  }

  async addDocument(driverId: string, payload: unknown) {
    const driver = await this.drivers.getDriver(driverId);
    const data = driverDocumentSchema.parse(payload);
    const document = await this.drivers.addDocument({ ...data, driver });
    if (data.expiryDate) {
      await this.notifications.create({
        type: NotificationType.LICENSE_EXPIRY,
        message: `${data.type} for ${driver.user.fullName} expires on ${data.expiryDate.toDateString()}`,
        metadata: { driverId: driver.id, documentId: document.id, expiryDate: data.expiryDate }
      });
    }
    await this.audit.log('CREATE', 'DriverDocument', document.id, driver.user.id, data as Record<string, unknown>);
    return document;
  }

  listDocuments(driverId: string) {
    return this.drivers.listDocuments(driverId);
  }
}
