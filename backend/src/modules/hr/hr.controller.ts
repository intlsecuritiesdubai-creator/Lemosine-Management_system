import { Request, Response } from 'express';
import { HrService } from './hr.service';
import { SalaryStatus } from '../shared/enums';

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

  static async updateStatus(req: Request, res: Response) {
    const { status, paymentDate } = req.body;
    const parsedStatus = SalaryStatus[status as keyof typeof SalaryStatus];
    if (!parsedStatus) {
      throw Object.assign(new Error('Invalid status'), { status: 400 });
    }
    const salary = await service.updateSalaryStatus(req.params.id, parsedStatus, paymentDate ? new Date(paymentDate) : undefined);
    res.json({ success: true, data: salary });
  }

  static async listByDriver(req: Request, res: Response) {
    const salaries = await service.listDriverSalaries(req.params.id);
    res.json({ success: true, data: salaries });
  }

  static async salarySlip(req: Request, res: Response) {
    const slip = await service.getSalarySlip(req.params.id);
    res.json({ success: true, data: slip });
  }
}
