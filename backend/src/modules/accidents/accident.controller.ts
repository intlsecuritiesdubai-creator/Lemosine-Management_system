import { Request, Response } from 'express';
import { AccidentService } from './accident.service';

const service = new AccidentService();

export class AccidentController {
  static async list(_req: Request, res: Response) {
    const accidents = await service.listAccidents();
    res.json({ success: true, data: accidents });
  }

  static async create(req: Request, res: Response) {
    const accident = await service.createAccident(req.body);
    res.status(201).json({ success: true, data: accident });
  }

  static async get(req: Request, res: Response) {
    const accident = await service.getAccident(req.params.id);
    res.json({ success: true, data: accident });
  }
}
