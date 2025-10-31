import { Request, Response } from 'express';
import { DriverService } from './driver.service';

const driverService = new DriverService();

export class DriverController {
  static async list(_req: Request, res: Response) {
    const drivers = await driverService.listDrivers();
    res.json({ success: true, data: drivers });
  }

  static async get(req: Request, res: Response) {
    const driver = await driverService.getDriver(req.params.id);
    res.json({ success: true, data: driver });
  }

  static async create(req: Request, res: Response) {
    const driver = await driverService.createDriver(req.body);
    res.status(201).json({ success: true, data: driver });
  }

  static async update(req: Request, res: Response) {
    const driver = await driverService.updateDriver(req.params.id, req.body);
    res.json({ success: true, data: driver });
  }

  static async logAttendance(req: Request, res: Response) {
    const record = await driverService.logAttendance(req.params.id, req.body);
    res.status(201).json({ success: true, data: record });
  }

  static async listAttendance(req: Request, res: Response) {
    const records = await driverService.listAttendance(req.params.id);
    res.json({ success: true, data: records });
  }

  static async requestLeave(req: Request, res: Response) {
    const leave = await driverService.requestLeave(req.params.id, req.body);
    res.status(201).json({ success: true, data: leave });
  }

  static async listLeaves(req: Request, res: Response) {
    const leaves = await driverService.listLeaves(req.params.id);
    res.json({ success: true, data: leaves });
  }

  static async decideLeave(req: Request, res: Response) {
    const leave = await driverService.decideLeave(req.params.leaveId, req.body);
    res.json({ success: true, data: leave });
  }

  static async addPerformance(req: Request, res: Response) {
    const review = await driverService.addPerformance(req.params.id, req.body);
    res.status(201).json({ success: true, data: review });
  }

  static async listPerformance(req: Request, res: Response) {
    const reviews = await driverService.listPerformance(req.params.id);
    res.json({ success: true, data: reviews });
  }

  static async addDocument(req: Request, res: Response) {
    const document = await driverService.addDocument(req.params.id, req.body);
    res.status(201).json({ success: true, data: document });
  }

  static async listDocuments(req: Request, res: Response) {
    const documents = await driverService.listDocuments(req.params.id);
    res.json({ success: true, data: documents });
  }
}
