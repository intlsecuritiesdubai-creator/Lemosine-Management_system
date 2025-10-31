import { Request, Response } from 'express';
import { ReportService } from './report.service';

const service = new ReportService();

export class ReportController {
  static async dashboard(_req: Request, res: Response) {
    const data = await service.getDashboard();
    res.json({ success: true, data });
  }

  static async renewals(_req: Request, res: Response) {
    const data = await service.getUpcomingRenewals();
    res.json({ success: true, data });
  }

  static async financial(_req: Request, res: Response) {
    const data = await service.getFinancialSummary();
    res.json({ success: true, data });
  }

  static async driverPerformance(_req: Request, res: Response) {
    const data = await service.getDriverPerformance();
    res.json({ success: true, data });
  }

  static async fleet(_req: Request, res: Response) {
    const data = await service.getFleetUtilisation();
    res.json({ success: true, data });
  }

  static async alerts(_req: Request, res: Response) {
    const data = await service.getAlerts();
    res.json({ success: true, data });
  }
}
