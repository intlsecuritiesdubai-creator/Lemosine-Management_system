import { useApiQuery } from '../hooks/useApi';
import { ApiResponse, Salary } from '../types';
import { DataTable } from '../components/data-table';

export const SalariesPage = () => {
  const { data } = useApiQuery<ApiResponse<Salary[]>>(['salaries'], { url: '/hr' });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Salary & HR</h1>
        <p className="text-slate-500">Salary slips, deductions, and payment status.</p>
      </div>
      <DataTable
        columns={[
          { key: 'periodStart', label: 'From', render: (value) => new Date(String(value)).toLocaleDateString() },
          { key: 'periodEnd', label: 'To', render: (value) => new Date(String(value)).toLocaleDateString() },
          { key: 'netAmount', label: 'Net Amount', render: (value) => `AED ${Number(value).toLocaleString()}` },
          { key: 'status', label: 'Status' }
        ]}
        data={data?.data}
      />
    </div>
  );
};
