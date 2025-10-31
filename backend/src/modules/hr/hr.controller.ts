import { Request, Response } from 'express';
import { HrService } from './hr.service';

const service = new HrService();

export class HrController {
  static async list(_req: Request, res: Response) {
    const salaries = await service.listSalaries();
    res.json({ success: true, data: salaries });
  }

  static async create(req: Request, res: Response) {
    const salary = await service.createSalary(req.body);
    res.status(201).json({ success: true, data: salary });
  }
}
