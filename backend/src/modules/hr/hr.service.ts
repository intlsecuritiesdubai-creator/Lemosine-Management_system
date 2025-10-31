import { HrRepository } from './hr.repository';
import { salarySchema } from './hr.dto';
import { DriverRepository } from '../drivers/driver.repository';

export class HrService {
  private readonly repo = new HrRepository();
  private readonly drivers = new DriverRepository();

  listSalaries() {
    return this.repo.listSalaries();
  }

  async createSalary(payload: unknown) {
    const data = salarySchema.parse(payload);
    const driver = await this.drivers.getDriver(data.driverId);
    const netAmount = data.grossAmount - (data.deductions ?? 0);
    return this.repo.createSalary({
      driver,
      periodStart: data.periodStart,
      periodEnd: data.periodEnd,
      grossAmount: data.grossAmount,
      deductions: data.deductions ?? 0,
      netAmount,
      status: data.status,
      paymentDate: data.paymentDate
    });
  }
}
