import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from './layout/app-layout';
import { DashboardPage } from './pages/dashboard';
import { VehiclesPage } from './pages/vehicles';
import { DriversPage } from './pages/drivers';
import { FinancePage } from './pages/finance';
import { AccidentsPage } from './pages/accidents';
import { SalariesPage } from './pages/salaries';
import { LoginPage } from './pages/login';
import { ReportsPage } from './pages/reports';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'vehicles', element: <VehiclesPage /> },
      { path: 'drivers', element: <DriversPage /> },
      { path: 'finance', element: <FinancePage /> },
      { path: 'accidents', element: <AccidentsPage /> },
      { path: 'salaries', element: <SalariesPage /> },
      { path: 'reports', element: <ReportsPage /> }
    ]
  }
]);
