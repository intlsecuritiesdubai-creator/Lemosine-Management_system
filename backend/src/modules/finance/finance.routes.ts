import { Router } from 'express';
import { FinanceController } from './finance.controller';
import { authenticate, authorize } from '../auth/auth.middleware';
import { UserRole } from '../shared/enums';

const router = Router();

router.use(authenticate);
router.get('/expenses', authorize([UserRole.SUPER_ADMIN, UserRole.FINANCE_OFFICER, UserRole.FLEET_MANAGER]), FinanceController.listExpenses);
router.post('/expenses', authorize([UserRole.SUPER_ADMIN, UserRole.FINANCE_OFFICER]), FinanceController.createExpense);
router.get('/income', authorize([UserRole.SUPER_ADMIN, UserRole.FINANCE_OFFICER]), FinanceController.listIncome);
router.post('/income', authorize([UserRole.SUPER_ADMIN, UserRole.FINANCE_OFFICER]), FinanceController.createIncome);

export default router;
