import { FinanceRepository } from './finance.repository';
import { expenseSchema, incomeSchema } from './finance.dto';
import { VehicleRepository } from '../fleet/vehicle.repository';
import { DriverRepository } from '../drivers/driver.repository';

export class FinanceService {
  private readonly repo = new FinanceRepository();
  private readonly vehicles = new VehicleRepository();
  private readonly drivers = new DriverRepository();

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
      status: data.status ?? 'PENDING'
    };
    if (data.vehicleId) {
      entity.vehicle = await this.vehicles.getVehicle(data.vehicleId);
    }
    if (data.driverId) {
      entity.driver = await this.drivers.getDriver(data.driverId);
    }
    return this.repo.createExpense(entity);
  }

  async createIncome(payload: unknown) {
    const data = incomeSchema.parse(payload);
    const entity: any = {
      source: data.source,
      amount: data.amount,
      receivedOn: data.receivedOn,
      description: data.description
    };
    if (data.vehicleId) {
      entity.vehicle = await this.vehicles.getVehicle(data.vehicleId);
    }
    if (data.driverId) {
      entity.driver = await this.drivers.getDriver(data.driverId);
    }
    return this.repo.createIncome(entity);
  }
}
