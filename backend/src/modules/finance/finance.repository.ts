import { Repository } from 'typeorm';
import { AppDataSource } from '../../database/data-source';
import { Expense } from './expense.entity';
import { Income } from './income.entity';

export class FinanceRepository {
  private readonly expenses: Repository<Expense>;
  private readonly income: Repository<Income>;

  constructor() {
    this.expenses = AppDataSource.getRepository(Expense);
    this.income = AppDataSource.getRepository(Income);
  }

  listExpenses() {
    return this.expenses.find({ order: { incurredOn: 'DESC' } });
  }

  listIncome() {
    return this.income.find({ order: { receivedOn: 'DESC' } });
  }

  createExpense(data: Partial<Expense>) {
    return this.expenses.save(this.expenses.create(data));
  }

  createIncome(data: Partial<Income>) {
    return this.income.save(this.income.create(data));
  }

  getExpense(id: string) {
    return this.expenses.findOneBy({ id });
  }

  saveExpense(expense: Expense) {
    return this.expenses.save(expense);
  }

  async totalsByCategory() {
    return this.expenses
      .createQueryBuilder('expense')
      .select('expense.category', 'category')
      .addSelect('COALESCE(SUM(expense.amount), 0)', 'total')
      .groupBy('expense.category')
      .getRawMany();
  }

  async incomeBySource() {
    return this.income
      .createQueryBuilder('income')
      .select('income.source', 'source')
      .addSelect('COALESCE(SUM(income.amount), 0)', 'total')
      .groupBy('income.source')
      .getRawMany();
  }
}
