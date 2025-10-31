import { useApiQuery } from '../hooks/useApi';
import { ApiResponse } from '../types';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  totalSalary: number;
  netProfit: number;
}

export const RevenueChart = () => {
  const { data } = useApiQuery<ApiResponse<FinancialSummary>>(['financial-summary'], {
    url: '/reports/financial'
  });

  const chartData = [
    { name: 'Income', value: data?.data.totalIncome ?? 0 },
    { name: 'Expenses', value: data?.data.totalExpenses ?? 0 },
    { name: 'Salary', value: data?.data.totalSalary ?? 0 },
    { name: 'Net Profit', value: data?.data.netProfit ?? 0 }
  ];

  return (
    <div className="rounded-xl bg-white p-6 shadow-md">
      <h3 className="text-lg font-semibold mb-4">Financial Health</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value: number) => `AED ${value.toLocaleString()}`} />
            <Area type="monotone" dataKey="value" stroke="#0d9488" fill="#5eead4" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
