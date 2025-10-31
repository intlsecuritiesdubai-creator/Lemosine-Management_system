import { useApiQuery } from '../hooks/useApi';
import { ApiResponse, DashboardKpi } from '../types';
import { Card } from '../components/card';
import { RevenueChart } from '../components/revenue-chart';

export const DashboardPage = () => {
  const { data: dashboard } = useApiQuery<ApiResponse<DashboardKpi>>(['dashboard'], {
    url: '/reports/dashboard'
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Executive Dashboard</h1>
        <p className="text-slate-500">Real-time overview of fleet, finance, and safety KPIs.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card title="Active Vehicles" value={dashboard?.data.vehicleCount ?? 0} accent="Fleet ready for dispatch" />
        <Card title="Active Drivers" value={dashboard?.data.driverCount ?? 0} accent="Available chauffeurs" />
        <Card
          title="Accident Reports"
          value={dashboard?.data.accidentCount ?? 0}
          accent="Incidents reported in period"
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card
          title="Income vs Expense"
          value={`AED ${(dashboard?.data.totalIncome ?? 0).toLocaleString()}`}
          accent={`Expense AED ${(dashboard?.data.totalExpenses ?? 0).toLocaleString()}`}
        />
        <Card
          title="Net Profit"
          value={`AED ${(dashboard?.data.netProfit ?? 0).toLocaleString()}`}
          accent="After operating expenses"
        />
      </div>
      <RevenueChart />
    </div>
  );
};
