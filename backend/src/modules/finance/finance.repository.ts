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
    return this.expenses.find();
  }

  listIncome() {
    return this.income.find();
  }

  createExpense(data: Partial<Expense>) {
    return this.expenses.save(this.expenses.create(data));
  }

  createIncome(data: Partial<Income>) {
    return this.income.save(this.income.create(data));
  }
}
