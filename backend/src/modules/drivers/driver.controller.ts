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
}
