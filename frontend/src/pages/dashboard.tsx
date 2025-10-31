import { useApiQuery } from '../hooks/useApi';
import { AlertItem, ApiResponse, DashboardKpi, DriverPerformance } from '../types';
import { Card } from '../components/card';
import { RevenueChart } from '../components/revenue-chart';

export const DashboardPage = () => {
  const { data: dashboard } = useApiQuery<ApiResponse<DashboardKpi>>(['dashboard'], {
    url: '/reports/dashboard'
  });

  const { data: alerts } = useApiQuery<ApiResponse<AlertItem[]>>(['alerts'], {
    url: '/reports/alerts'
  });

  const { data: driverPerformance } = useApiQuery<ApiResponse<DriverPerformance[]>>(['driver-performance'], {
    url: '/reports/drivers/performance'
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Executive Dashboard</h1>
        <p className="text-slate-500">Real-time overview of fleet, finance, and safety KPIs.</p>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card title="Total Vehicles" value={dashboard?.data.vehicleCount ?? 0} accent="Fleet on record" />
        <Card title="Active Vehicles" value={dashboard?.data.activeVehicles ?? 0} accent="Available for dispatch" />
        <Card title="Active Drivers" value={dashboard?.data.activeDrivers ?? 0} accent="Available chauffeurs" />
        <Card title="Accident Reports" value={dashboard?.data.accidentCount ?? 0} accent="Incidents reported" />
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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card title="Pending Expense Approvals" value={dashboard?.data.pendingExpenses ?? 0} accent="Awaiting finance sign-off" />
        <Card title="Pending Payroll Runs" value={dashboard?.data.pendingPayroll ?? 0} accent="Salary batches awaiting payment" />
      </div>
      <RevenueChart />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-md">
          <h3 className="text-lg font-semibold mb-3">Operational Alerts</h3>
          <p className="text-sm text-slate-500 mb-4">Automated intelligence covering renewals, incidents, and payment reminders.</p>
          <div className="space-y-3">
            {(alerts?.data ?? []).slice(0, 6).map((alert) => (
              <div key={alert.id} className="rounded-lg border border-slate-100 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-emerald-700">{alert.type}</span>
                  <span className="text-xs text-slate-400">{new Date(alert.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-sm text-slate-600">{alert.message}</p>
              </div>
            ))}
            {alerts?.data?.length === 0 && <p className="text-sm text-slate-500">No alerts at this time.</p>}
          </div>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-md">
          <h3 className="text-lg font-semibold mb-3">Driver Performance Pulse</h3>
          <p className="text-sm text-slate-500 mb-4">Attendance health, incident trends, and leave utilisation.</p>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase text-slate-500">
                  <th className="pb-2">Driver ID</th>
                  <th className="pb-2">Attendance</th>
                  <th className="pb-2">Accidents</th>
                  <th className="pb-2">Leaves</th>
                </tr>
              </thead>
              <tbody>
                {(driverPerformance?.data ?? []).map((item) => (
                  <tr key={item.driverId} className="border-t border-slate-100">
                    <td className="py-2 font-medium text-slate-700">{item.driverId.slice(0, 8)}...</td>
                    <td className="py-2">{item.attendanceRate}%</td>
                    <td className="py-2">{item.accidentCount}</td>
                    <td className="py-2">{item.leaveCount}</td>
                  </tr>
                ))}
                {driverPerformance?.data?.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-slate-500">
                      No performance data yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
