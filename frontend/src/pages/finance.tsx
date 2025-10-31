import { useApiQuery } from '../hooks/useApi';
import { ApiResponse, Expense, Income } from '../types';
import { DataTable } from '../components/data-table';

export const FinancePage = () => {
  const { data: expenses } = useApiQuery<ApiResponse<Expense[]>>(['expenses'], { url: '/finance/expenses' });
  const { data: income } = useApiQuery<ApiResponse<Income[]>>(['income'], { url: '/finance/income' });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Finance Operations</h1>
        <p className="text-slate-500">Expenses, revenue streams, and profitability analysis.</p>
      </div>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Expense Ledger</h2>
        <DataTable
          columns={[
            { key: 'category', label: 'Category' },
            { key: 'amount', label: 'Amount', render: (value) => `AED ${Number(value).toLocaleString()}` },
            { key: 'incurredOn', label: 'Date', render: (value) => new Date(String(value)).toLocaleDateString() },
            { key: 'status', label: 'Status' }
          ]}
          data={expenses?.data}
        />
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Income Streams</h2>
        <DataTable
          columns={[
            { key: 'source', label: 'Source' },
            { key: 'amount', label: 'Amount', render: (value) => `AED ${Number(value).toLocaleString()}` },
            { key: 'receivedOn', label: 'Date', render: (value) => new Date(String(value)).toLocaleDateString() }
          ]}
          data={income?.data}
        />
      </section>
    </div>
  );
};
