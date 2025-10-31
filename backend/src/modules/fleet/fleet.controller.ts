import { Request, Response } from 'express';
import { VehicleService } from './vehicle.service';

const vehicleService = new VehicleService();

export class FleetController {
  static async listVehicles(_req: Request, res: Response) {
    const vehicles = await vehicleService.listVehicles();
    res.json({ success: true, data: vehicles });
  }

  static async getVehicle(req: Request, res: Response) {
    const vehicle = await vehicleService.getVehicle(req.params.id);
    res.json({ success: true, data: vehicle });
  }

  static async createVehicle(req: Request, res: Response) {
    const vehicle = await vehicleService.createVehicle(req.body);
    res.status(201).json({ success: true, data: vehicle });
  }

  static async updateVehicle(req: Request, res: Response) {
    const vehicle = await vehicleService.updateVehicle(req.params.id, req.body);
    res.json({ success: true, data: vehicle });
  }

  static async deleteVehicle(req: Request, res: Response) {
    await vehicleService.deleteVehicle(req.params.id);
    res.status(204).send();
  }

  static async addMaintenance(req: Request, res: Response) {
    const maintenance = await vehicleService.addMaintenance(req.params.id, req.body);
    res.status(201).json({ success: true, data: maintenance });
  }

  static async addTrip(req: Request, res: Response) {
    const trip = await vehicleService.addTrip(req.params.id, req.body);
    res.status(201).json({ success: true, data: trip });
  }
}
