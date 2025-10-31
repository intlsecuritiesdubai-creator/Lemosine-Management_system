import { Request, Response } from 'express';
import { FinanceService } from './finance.service';

const service = new FinanceService();

export class FinanceController {
  static async listExpenses(_req: Request, res: Response) {
    const expenses = await service.listExpenses();
    res.json({ success: true, data: expenses });
  }

  static async listIncome(_req: Request, res: Response) {
    const income = await service.listIncome();
    res.json({ success: true, data: income });
  }

  static async createExpense(req: Request, res: Response) {
    const expense = await service.createExpense(req.body);
    res.status(201).json({ success: true, data: expense });
  }

  static async createIncome(req: Request, res: Response) {
    const income = await service.createIncome(req.body);
    res.status(201).json({ success: true, data: income });
  }

  static async approveExpense(req: Request, res: Response) {
    const expense = await service.approveExpense(req.params.id, req.body);
    res.json({ success: true, data: expense });
  }

  static async financialBreakdown(_req: Request, res: Response) {
    const breakdown = await service.getFinancialBreakdown();
    res.json({ success: true, data: breakdown });
  }
}
