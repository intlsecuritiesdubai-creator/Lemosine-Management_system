import { HrRepository } from './hr.repository';
import { salarySchema } from './hr.dto';
import { DriverRepository } from '../drivers/driver.repository';
import { AuditService } from '../shared/audit.service';
import { NotificationService } from '../shared/notification.service';
import { NotificationType, SalaryStatus } from '../shared/enums';

export class HrService {
  private readonly repo = new HrRepository();
  private readonly drivers = new DriverRepository();
  private readonly audit = new AuditService();
  private readonly notifications = new NotificationService();

  listSalaries() {
    return this.repo.listSalaries();
  }

  async createSalary(payload: unknown) {
    const data = salarySchema.parse(payload);
    const driver = await this.drivers.getDriver(data.driverId);
    const overtimeRate = data.overtimeRate ?? driver.overtimeRate;
    const overtimePay = data.overtimeHours * overtimeRate;
    const netAmount = data.grossAmount + data.allowances + overtimePay - (data.deductions ?? 0);
    const salary = await this.repo.createSalary({
      driver,
      periodStart: data.periodStart,
      periodEnd: data.periodEnd,
      grossAmount: data.grossAmount,
      deductions: data.deductions ?? 0,
      allowances: data.allowances,
      overtimePay,
      netAmount,
      status: data.status,
      paymentDate: data.paymentDate,
      generatedBy: driver.user.id
    });
    await this.audit.log('CREATE', 'Salary', salary.id, driver.user.id, data as Record<string, unknown>);
    if (salary.status === SalaryStatus.PAID) {
      await this.notifications.create({
        type: NotificationType.PAYMENT_PENDING,
        message: `Salary processed for ${driver.user.fullName}`,
        metadata: { salaryId: salary.id, driverId: driver.id }
      });
    }
    return salary;
  }

  async updateSalaryStatus(id: string, status: SalaryStatus, paymentDate?: Date) {
    const salary = await this.repo.getSalary(id);
    if (!salary) {
      throw Object.assign(new Error('Salary not found'), { status: 404 });
    }
    salary.status = status;
    salary.paymentDate = paymentDate ?? salary.paymentDate ?? new Date();
    const saved = await this.repo.saveSalary(salary);
    await this.audit.log('UPDATE', 'Salary', saved.id, saved.generatedBy, { status });
    if (status === SalaryStatus.PAID) {
      await this.notifications.create({
        type: NotificationType.PAYMENT_PENDING,
        message: `Salary payment completed for ${salary.driver.user.fullName}`,
        metadata: { salaryId: salary.id }
      });
    }
    return saved;
  }

  listDriverSalaries(driverId: string) {
    return this.repo.listByDriver(driverId);
  }

  async getSalarySlip(id: string) {
    const salary = await this.repo.getSalary(id);
    if (!salary) {
      throw Object.assign(new Error('Salary not found'), { status: 404 });
    }
    return {
      id: salary.id,
      driver: salary.driver,
      periodStart: salary.periodStart,
      periodEnd: salary.periodEnd,
      grossAmount: salary.grossAmount,
      allowances: salary.allowances,
      overtimePay: salary.overtimePay,
      deductions: salary.deductions,
      netAmount: salary.netAmount,
      status: salary.status,
      paymentDate: salary.paymentDate
    };
  }
}
