import { useApiQuery } from '../hooks/useApi';
import { ApiResponse, FinancialSummary } from '../types';
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export const RevenueChart = () => {
  const { data } = useApiQuery<ApiResponse<FinancialSummary>>(['financial-summary'], {
    url: '/reports/financial'
  });

  const chartData = (data?.data.monthlyIncome ?? []).map((item) => ({
    name: item.month,
    income: item.totalIncome
  }));

  return (
    <div className="rounded-xl bg-white p-6 shadow-md">
      <h3 className="text-lg font-semibold mb-4">Financial Health</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4 mb-6">
        <div>
          <p className="text-xs uppercase text-slate-500">Total Income</p>
          <p className="text-xl font-semibold">AED {(data?.data.monthlyIncome?.reduce((sum, item) => sum + item.totalIncome, 0) ?? 0).toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs uppercase text-slate-500">Operating Expenses</p>
          <p className="text-xl font-semibold">AED {(data?.data.totalExpenses ?? 0).toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs uppercase text-slate-500">Payroll</p>
          <p className="text-xl font-semibold">AED {(data?.data.totalSalary ?? 0).toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs uppercase text-slate-500">Net Profit</p>
          <p className={`text-xl font-semibold ${data && data.data.netProfit < 0 ? 'text-red-500' : 'text-emerald-600'}`}>
            AED {(data?.data.netProfit ?? 0).toLocaleString()}
          </p>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value: number) => `AED ${value.toLocaleString()}`} />
            <Legend />
            <Area type="monotone" dataKey="income" stroke="#0d9488" fill="#5eead4" name="Monthly Income" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
