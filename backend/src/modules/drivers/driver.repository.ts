import { Repository } from 'typeorm';
import { AppDataSource } from '../../database/data-source';
import { Driver } from './driver.entity';
import { AttendanceRecord } from './attendance.entity';
import { LeaveRequest } from './leave.entity';
import { PerformanceReview } from './performance.entity';
import { Document } from '../shared/document.entity';

export class DriverRepository {
  private readonly repo: Repository<Driver>;
  private readonly attendanceRepo: Repository<AttendanceRecord>;
  private readonly leaveRepo: Repository<LeaveRequest>;
  private readonly performanceRepo: Repository<PerformanceReview>;
  private readonly documentRepo: Repository<Document>;

  constructor() {
    this.repo = AppDataSource.getRepository(Driver);
    this.attendanceRepo = AppDataSource.getRepository(AttendanceRecord);
    this.leaveRepo = AppDataSource.getRepository(LeaveRequest);
    this.performanceRepo = AppDataSource.getRepository(PerformanceReview);
    this.documentRepo = AppDataSource.getRepository(Document);
  }

  findAll() {
    return this.repo.find({ relations: ['assignedVehicle', 'trips', 'accidents', 'documents'] });
  }

  findByUserId(userId: string) {
    return this.repo.find({ where: { user: { id: userId } }, relations: ['assignedVehicle'] });
  }

  async getDriver(id: string) {
    const driver = await this.repo.findOne({
      where: { id },
      relations: ['assignedVehicle', 'trips', 'accidents', 'attendanceRecords', 'leaves', 'performanceReviews', 'documents']
    });
    if (!driver) {
      throw Object.assign(new Error('Driver not found'), { status: 404 });
    }
    return driver;
  }

  create(data: Partial<Driver>) {
    return this.repo.create(data);
  }

  save(driver: Driver) {
    return this.repo.save(driver);
  }

  logAttendance(entry: Partial<AttendanceRecord>) {
    const record = this.attendanceRepo.create(entry);
    return this.attendanceRepo.save(record);
  }

  listAttendance(driverId: string) {
    return this.attendanceRepo.find({ where: { driver: { id: driverId } }, order: { date: 'DESC' } });
  }

  createLeave(entry: Partial<LeaveRequest>) {
    const leave = this.leaveRepo.create(entry);
    return this.leaveRepo.save(leave);
  }

  async updateLeaveStatus(id: string, status: LeaveRequest['status'], approvedBy?: string) {
    const leave = await this.leaveRepo.findOneByOrFail({ id });
    leave.status = status;
    leave.approvedBy = approvedBy;
    return this.leaveRepo.save(leave);
  }

  listLeaves(driverId: string) {
    return this.leaveRepo.find({ where: { driver: { id: driverId } }, order: { startDate: 'DESC' } });
  }

  addPerformanceReview(entry: Partial<PerformanceReview>) {
    const review = this.performanceRepo.create(entry);
    return this.performanceRepo.save(review);
  }

  listPerformance(driverId: string) {
    return this.performanceRepo.find({ where: { driver: { id: driverId } }, order: { periodEnd: 'DESC' } });
  }

  addDocument(document: Partial<Document>) {
    const entity = this.documentRepo.create(document);
    return this.documentRepo.save(entity);
  }

  listDocuments(driverId: string) {
    return this.documentRepo.find({ where: { driver: { id: driverId } }, order: { createdAt: 'DESC' } });
  }
}
