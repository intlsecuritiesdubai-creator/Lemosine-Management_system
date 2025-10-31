import { AppDataSource } from '../../database/data-source';
import { Vehicle } from '../fleet/vehicle.entity';
import { Driver } from '../drivers/driver.entity';
import { Expense } from '../finance/expense.entity';
import { Income } from '../finance/income.entity';
import { Accident } from '../accidents/accident.entity';
import { Salary } from '../hr/salary.entity';

export class ReportService {
  async getDashboard() {
    const vehicleRepo = AppDataSource.getRepository(Vehicle);
    const driverRepo = AppDataSource.getRepository(Driver);
    const expenseRepo = AppDataSource.getRepository(Expense);
    const incomeRepo = AppDataSource.getRepository(Income);
    const accidentRepo = AppDataSource.getRepository(Accident);

    const [vehicleCount, driverCount] = await Promise.all([vehicleRepo.count(), driverRepo.count()]);

    const [{ totalExpenses = 0 } = {}] = await expenseRepo
      .createQueryBuilder('expense')
      .select('COALESCE(SUM(expense.amount), 0)', 'totalExpenses')
      .getRawMany();

    const [{ totalIncome = 0 } = {}] = await incomeRepo
      .createQueryBuilder('income')
      .select('COALESCE(SUM(income.amount), 0)', 'totalIncome')
      .getRawMany();

    const accidentCount = await accidentRepo.count();

    return {
      vehicleCount,
      driverCount,
      totalExpenses: Number(totalExpenses),
      totalIncome: Number(totalIncome),
      netProfit: Number(totalIncome) - Number(totalExpenses),
      accidentCount
    };
  }

  async getUpcomingRenewals() {
    const vehicleRepo = AppDataSource.getRepository(Vehicle);
    const today = new Date();
    const threshold = new Date();
    threshold.setDate(today.getDate() + 30);

    return vehicleRepo
      .createQueryBuilder('vehicle')
      .where('vehicle.insuranceExpiry BETWEEN :today AND :threshold', { today, threshold })
      .orWhere('vehicle.registrationExpiry BETWEEN :today AND :threshold', { today, threshold })
      .orWhere('vehicle.permitExpiry BETWEEN :today AND :threshold', { today, threshold })
      .getMany();
  }

  async getFinancialSummary() {
    const incomeRepo = AppDataSource.getRepository(Income);
    const expenseRepo = AppDataSource.getRepository(Expense);
    const salaryRepo = AppDataSource.getRepository(Salary);

    const [{ totalIncome = 0 } = {}] = await incomeRepo
      .createQueryBuilder('income')
      .select('DATE_TRUNC(\'month\', income.receivedOn)', 'month')
      .addSelect('COALESCE(SUM(income.amount), 0)', 'totalIncome')
      .groupBy('month')
      .orderBy('month', 'DESC')
      .limit(12)
      .getRawMany();

    const [{ totalExpenses = 0 } = {}] = await expenseRepo
      .createQueryBuilder('expense')
      .select('COALESCE(SUM(expense.amount), 0)', 'totalExpenses')
      .getRawMany();

    const [{ totalSalary = 0 } = {}] = await salaryRepo
      .createQueryBuilder('salary')
      .select('COALESCE(SUM(salary.netAmount), 0)', 'totalSalary')
      .getRawMany();

    return {
      totalIncome: Number(totalIncome),
      totalExpenses: Number(totalExpenses),
      totalSalary: Number(totalSalary),
      netProfit: Number(totalIncome) - (Number(totalExpenses) + Number(totalSalary))
    };
  }
}
