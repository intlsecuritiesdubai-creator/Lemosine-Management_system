import { Repository } from 'typeorm';
import { AppDataSource } from '../../database/data-source';
import { Vehicle } from './vehicle.entity';
import { Maintenance } from './maintenance.entity';
import { Trip } from './trip.entity';
import { Document } from '../shared/document.entity';
import { VehicleAssignment } from './assignment.entity';

export class VehicleRepository {
  private readonly repo: Repository<Vehicle>;
  private readonly maintenanceRepo: Repository<Maintenance>;
  private readonly tripRepo: Repository<Trip>;
  private readonly documentRepo: Repository<Document>;
  private readonly assignmentRepo: Repository<VehicleAssignment>;

  constructor() {
    this.repo = AppDataSource.getRepository(Vehicle);
    this.maintenanceRepo = AppDataSource.getRepository(Maintenance);
    this.tripRepo = AppDataSource.getRepository(Trip);
    this.documentRepo = AppDataSource.getRepository(Document);
    this.assignmentRepo = AppDataSource.getRepository(VehicleAssignment);
  }

  findAll() {
    return this.repo.find({ relations: ['maintenanceRecords', 'trips', 'documents', 'assignments'] });
  }

  findById(id: string) {
    return this.repo.findOne({ where: { id }, relations: ['maintenanceRecords', 'trips', 'documents', 'assignments'] });
  }

  async getVehicle(id: string) {
    const vehicle = await this.findById(id);
    if (!vehicle) {
      throw Object.assign(new Error('Vehicle not found'), { status: 404 });
    }
    return vehicle;
  }

  findByPlate(plateNumber: string) {
    return this.repo.findOne({ where: { plateNumber } });
  }

  create(data: Partial<Vehicle>) {
    return this.repo.create(data);
  }

  save(vehicle: Vehicle) {
    return this.repo.save(vehicle);
  }

  async delete(id: string) {
    await this.repo.delete({ id });
  }

  async addMaintenance(entry: Maintenance) {
    return this.maintenanceRepo.save(entry);
  }

  async addTrip(entry: Trip) {
    return this.tripRepo.save(entry);
  }

  addDocument(document: Partial<Document>) {
    const entity = this.documentRepo.create(document);
    return this.documentRepo.save(entity);
  }

  listDocuments(vehicleId: string) {
    return this.documentRepo.find({ where: { vehicle: { id: vehicleId } }, order: { createdAt: 'DESC' } });
  }

  createAssignment(data: Partial<VehicleAssignment>) {
    const entity = this.assignmentRepo.create(data);
    return this.assignmentRepo.save(entity);
  }

  async closeAssignmentsForVehicle(vehicleId: string) {
    const openAssignments = await this.assignmentRepo.find({ where: { vehicle: { id: vehicleId }, releasedAt: null } });
    for (const assignment of openAssignments) {
      assignment.releasedAt = new Date();
      await this.assignmentRepo.save(assignment);
    }
    return openAssignments;
  }

  listAssignments(vehicleId: string) {
    return this.assignmentRepo.find({ where: { vehicle: { id: vehicleId } }, order: { assignedAt: 'DESC' } });
  }
}
