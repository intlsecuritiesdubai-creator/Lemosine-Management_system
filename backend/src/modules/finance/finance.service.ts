import { FinanceRepository } from './finance.repository';
import { expenseSchema, incomeSchema, expenseApprovalSchema } from './finance.dto';
import { VehicleRepository } from '../fleet/vehicle.repository';
import { DriverRepository } from '../drivers/driver.repository';
import { AuditService } from '../shared/audit.service';
import { NotificationService } from '../shared/notification.service';
import { NotificationType, ExpenseStatus } from '../shared/enums';

export class FinanceService {
  private readonly repo = new FinanceRepository();
  private readonly vehicles = new VehicleRepository();
  private readonly drivers = new DriverRepository();
  private readonly audit = new AuditService();
  private readonly notifications = new NotificationService();

  listExpenses() {
    return this.repo.listExpenses();
  }

  listIncome() {
    return this.repo.listIncome();
  }

  async createExpense(payload: unknown) {
    const data = expenseSchema.parse(payload);
    const entity: any = {
      category: data.category,
      amount: data.amount,
      incurredOn: data.incurredOn,
      description: data.description,
      status: data.status ?? ExpenseStatus.PENDING,
      receiptUrl: data.receiptUrl
    };
    if (data.vehicleId) {
      entity.vehicle = await this.vehicles.getVehicle(data.vehicleId);
    }
    if (data.driverId) {
      entity.driver = await this.drivers.getDriver(data.driverId);
    }
    const expense = await this.repo.createExpense(entity);
    await this.audit.log('CREATE', 'Expense', expense.id, undefined, data as Record<string, unknown>);
    if (expense.status === ExpenseStatus.PENDING) {
      await this.notifications.create({
        type: NotificationType.PAYMENT_PENDING,
        message: `Expense ${expense.category} requires approval`,
        metadata: { expenseId: expense.id }
      });
    }
    return expense;
  }

  async createIncome(payload: unknown) {
    const data = incomeSchema.parse(payload);
    const entity: any = {
      source: data.source,
      amount: data.amount,
      receivedOn: data.receivedOn,
      description: data.description,
      reference: data.reference
    };
    if (data.vehicleId) {
      entity.vehicle = await this.vehicles.getVehicle(data.vehicleId);
    }
    if (data.driverId) {
      entity.driver = await this.drivers.getDriver(data.driverId);
    }
    const income = await this.repo.createIncome(entity);
    await this.audit.log('CREATE', 'Income', income.id, undefined, data as Record<string, unknown>);
    return income;
  }

  async approveExpense(id: string, payload: unknown) {
    const expense = await this.repo.getExpense(id);
    if (!expense) {
      throw Object.assign(new Error('Expense not found'), { status: 404 });
    }
    const data = expenseApprovalSchema.parse(payload);
    expense.status = data.status;
    expense.approvedBy = data.approvedBy;
    expense.approvedAt = new Date();
    expense.notes = data.notes;
    const saved = await this.repo.saveExpense(expense);
    await this.audit.log('UPDATE', 'Expense', saved.id, data.approvedBy, { status: data.status, notes: data.notes });
    if (data.status === ExpenseStatus.APPROVED) {
      await this.notifications.create({
        type: NotificationType.PAYMENT_PENDING,
        message: `Expense ${expense.category} approved`,
        metadata: { expenseId: expense.id }
      });
    }
    return saved;
  }

  async getFinancialBreakdown() {
    const [expenseTotals, incomeTotals] = await Promise.all([this.repo.totalsByCategory(), this.repo.incomeBySource()]);
    return { expenseTotals, incomeTotals };
  }
}
