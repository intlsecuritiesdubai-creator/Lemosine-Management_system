import { AppDataSource } from '../../database/data-source';
import { Vehicle } from '../fleet/vehicle.entity';
import { Driver } from '../drivers/driver.entity';
import { Expense } from '../finance/expense.entity';
import { Income } from '../finance/income.entity';
import { Accident } from '../accidents/accident.entity';
import { Salary } from '../hr/salary.entity';
import { AttendanceRecord } from '../drivers/attendance.entity';
import { LeaveRequest } from '../drivers/leave.entity';
import { VehicleAssignment } from '../fleet/assignment.entity';
import { Document } from '../shared/document.entity';
import { Notification } from '../shared/notification.entity';
import { VehicleStatus, ExpenseStatus, SalaryStatus } from '../shared/enums';

export class ReportService {
  async getDashboard() {
    const vehicleRepo = AppDataSource.getRepository(Vehicle);
    const driverRepo = AppDataSource.getRepository(Driver);
    const expenseRepo = AppDataSource.getRepository(Expense);
    const incomeRepo = AppDataSource.getRepository(Income);
    const accidentRepo = AppDataSource.getRepository(Accident);
    const salaryRepo = AppDataSource.getRepository(Salary);

    const [vehicleCount, activeVehicles, driverCount, activeDrivers] = await Promise.all([
      vehicleRepo.count(),
      vehicleRepo.count({ where: { status: VehicleStatus.ACTIVE } }),
      driverRepo.count(),
      driverRepo.count({ where: { isActive: true } })
    ]);

    const [{ totalExpenses = 0 } = {}] = await expenseRepo
      .createQueryBuilder('expense')
      .select('COALESCE(SUM(expense.amount), 0)', 'totalExpenses')
      .getRawMany();

    const [{ totalIncome = 0 } = {}] = await incomeRepo
      .createQueryBuilder('income')
      .select('COALESCE(SUM(income.amount), 0)', 'totalIncome')
      .getRawMany();

    const accidentCount = await accidentRepo.count();
    const pendingExpenses = await expenseRepo.count({ where: { status: ExpenseStatus.PENDING } });
    const pendingPayroll = await salaryRepo.count({ where: { status: SalaryStatus.PENDING } });

    return {
      vehicleCount,
      activeVehicles,
      driverCount,
      activeDrivers,
      totalExpenses: Number(totalExpenses),
      totalIncome: Number(totalIncome),
      netProfit: Number(totalIncome) - Number(totalExpenses),
      accidentCount,
      pendingExpenses,
      pendingPayroll
    };
  }

  async getUpcomingRenewals() {
    const vehicleRepo = AppDataSource.getRepository(Vehicle);
    const today = new Date();
    const threshold = new Date();
    threshold.setDate(today.getDate() + 30);

    const vehicles = await vehicleRepo
      .createQueryBuilder('vehicle')
      .where('vehicle.insuranceExpiry BETWEEN :today AND :threshold', { today, threshold })
      .orWhere('vehicle.registrationExpiry BETWEEN :today AND :threshold', { today, threshold })
      .orWhere('vehicle.permitExpiry BETWEEN :today AND :threshold', { today, threshold })
      .getMany();

    const documentRepo = AppDataSource.getRepository(Document);
    const documents = await documentRepo
      .createQueryBuilder('document')
      .where('document.expiryDate BETWEEN :today AND :threshold', { today, threshold })
      .getMany();

    return { vehicles, documents };
  }

  async getFinancialSummary() {
    const incomeRepo = AppDataSource.getRepository(Income);
    const expenseRepo = AppDataSource.getRepository(Expense);
    const salaryRepo = AppDataSource.getRepository(Salary);

    const monthlyIncome = await incomeRepo
      .createQueryBuilder('income')
      .select("TO_CHAR(income.receivedOn, 'YYYY-MM')", 'month')
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

    const incomeBySource = await incomeRepo
      .createQueryBuilder('income')
      .select('income.source', 'source')
      .addSelect('COALESCE(SUM(income.amount), 0)', 'total')
      .groupBy('income.source')
      .getRawMany();

    const expenseByCategory = await expenseRepo
      .createQueryBuilder('expense')
      .select('expense.category', 'category')
      .addSelect('COALESCE(SUM(expense.amount), 0)', 'total')
      .groupBy('expense.category')
      .getRawMany();

    return {
      monthlyIncome: monthlyIncome.map((item) => ({ month: item.month, totalIncome: Number(item.totalIncome) })).reverse(),
      totalExpenses: Number(totalExpenses),
      totalSalary: Number(totalSalary),
      netProfit: Number(monthlyIncome.reduce((sum, item) => sum + Number(item.totalIncome), 0)) - (Number(totalExpenses) + Number(totalSalary)),
      incomeBySource: incomeBySource.map((item) => ({ source: item.source, total: Number(item.total) })),
      expenseByCategory: expenseByCategory.map((item) => ({ category: item.category, total: Number(item.total) }))
    };
  }

  async getDriverPerformance() {
    const attendanceRepo = AppDataSource.getRepository(AttendanceRecord);
    const accidentRepo = AppDataSource.getRepository(Accident);
    const leaveRepo = AppDataSource.getRepository(LeaveRequest);

    const attendanceByDriver = await attendanceRepo
      .createQueryBuilder('attendance')
      .select('attendance.driver_id', 'driverId')
      .addSelect("SUM(CASE WHEN attendance.status = 'PRESENT' THEN 1 ELSE 0 END)", 'presentCount')
      .addSelect('COUNT(*)', 'totalCount')
      .groupBy('attendance.driver_id')
      .getRawMany();

    const accidents = await accidentRepo
      .createQueryBuilder('accident')
      .select('accident.driver_id', 'driverId')
      .addSelect('COUNT(*)', 'accidentCount')
      .groupBy('accident.driver_id')
      .getRawMany();

    const leaveTotals = await leaveRepo
      .createQueryBuilder('leave')
      .select('leave.driver_id', 'driverId')
      .addSelect('COUNT(*)', 'leaveCount')
      .groupBy('leave.driver_id')
      .getRawMany();

    return attendanceByDriver.map((record) => {
      const accident = accidents.find((a) => a.driverId === record.driverId);
      const leave = leaveTotals.find((l) => l.driverId === record.driverId);
      const present = Number(record.presentCount);
      const total = Number(record.totalCount);
      const attendanceRate = total > 0 ? Math.round((present / total) * 100) : 0;
      return {
        driverId: record.driverId,
        attendanceRate,
        accidentCount: Number(accident?.accidentCount ?? 0),
        leaveCount: Number(leave?.leaveCount ?? 0)
      };
    });
  }

  async getFleetUtilisation() {
    const assignmentRepo = AppDataSource.getRepository(VehicleAssignment);
    const result = await assignmentRepo
      .createQueryBuilder('assignment')
      .select('assignment.vehicle_id', 'vehicleId')
      .addSelect('COUNT(*)', 'assignmentCount')
      .addSelect('MAX(assignment.assignedAt)', 'lastAssignedAt')
      .groupBy('assignment.vehicle_id')
      .orderBy('lastAssignedAt', 'DESC')
      .getRawMany();
    return result.map((row) => ({
      vehicleId: row.vehicleId,
      assignmentCount: Number(row.assignmentCount),
      lastAssignedAt: row.lastAssignedAt
    }));
  }

  async getAlerts() {
    const repo = AppDataSource.getRepository(Notification);
    const notifications = await repo.find({ where: { isRead: false }, order: { createdAt: 'DESC' }, take: 20 });
    return notifications.map((notification) => ({
      id: notification.id,
      type: notification.type,
      message: notification.message,
      metadata: notification.metadata,
      createdAt: notification.createdAt
    }));
  }
}
