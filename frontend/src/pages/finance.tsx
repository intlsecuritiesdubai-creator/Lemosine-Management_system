import { useApiQuery } from '../hooks/useApi';
import { ApiResponse, Expense, Income } from '../types';
import { DataTable } from '../components/data-table';

export const FinancePage = () => {
  const { data: expenses } = useApiQuery<ApiResponse<Expense[]>>(['expenses'], { url: '/finance/expenses' });
  const { data: income } = useApiQuery<ApiResponse<Income[]>>(['income'], { url: '/finance/income' });
  const { data: breakdown } = useApiQuery<ApiResponse<{ expenseTotals: Array<{ category: string; total: number }>; incomeTotals: Array<{ source: string; total: number }> }>>(
    ['finance-breakdown'],
    { url: '/finance/analytics/breakdown' }
  );

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
            { key: 'status', label: 'Status' },
            {
              key: 'receiptUrl',
              label: 'Receipt',
              render: (value) => (value ? <a className="text-emerald-600" href={String(value)} target="_blank" rel="noreferrer">View</a> : '—')
            }
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
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Analytics</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-100 p-4">
            <h3 className="text-sm font-semibold text-slate-600 mb-2">Expenses by Category</h3>
            <ul className="space-y-2 text-sm">
              {(breakdown?.data.expenseTotals ?? []).map((item) => (
                <li key={item.category} className="flex items-center justify-between">
                  <span>{item.category}</span>
                  <span className="font-medium">AED {Number(item.total).toLocaleString()}</span>
                </li>
              ))}
              {breakdown?.data.expenseTotals?.length === 0 && <li className="text-slate-500">No expense data available.</li>}
            </ul>
          </div>
          <div className="rounded-xl border border-slate-100 p-4">
            <h3 className="text-sm font-semibold text-slate-600 mb-2">Income by Source</h3>
            <ul className="space-y-2 text-sm">
              {(breakdown?.data.incomeTotals ?? []).map((item) => (
                <li key={item.source} className="flex items-center justify-between">
                  <span>{item.source}</span>
                  <span className="font-medium">AED {Number(item.total).toLocaleString()}</span>
                </li>
              ))}
              {breakdown?.data.incomeTotals?.length === 0 && <li className="text-slate-500">No income data available.</li>}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};
