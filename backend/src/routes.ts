import { Application } from 'express';
import authRouter from './modules/auth/auth.routes';
import userRouter from './modules/users/user.routes';
import fleetRouter from './modules/fleet/fleet.routes';
import driverRouter from './modules/drivers/driver.routes';
import financeRouter from './modules/finance/finance.routes';
import hrRouter from './modules/hr/hr.routes';
import accidentRouter from './modules/accidents/accident.routes';
import reportRouter from './modules/reports/report.routes';

export const registerRoutes = (app: Application) => {
  app.use('/api/auth', authRouter);
  app.use('/api/users', userRouter);
  app.use('/api/fleet', fleetRouter);
  app.use('/api/drivers', driverRouter);
  app.use('/api/finance', financeRouter);
  app.use('/api/hr', hrRouter);
  app.use('/api/accidents', accidentRouter);
  app.use('/api/reports', reportRouter);
};
