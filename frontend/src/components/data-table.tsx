import React from 'react';

interface DataTableProps<T extends Record<string, unknown>> {
  columns: { key: keyof T; label: string; render?: (value: unknown, row: T) => React.ReactNode }[];
  data?: T[];
}

export const DataTable = <T extends Record<string, unknown>>({ columns, data }: DataTableProps<T>) => {
  if (!data || data.length === 0) {
    return <div className="rounded bg-white p-6 text-center text-slate-500 shadow">No records found.</div>;
  }
  return (
    <div className="overflow-x-auto rounded bg-white shadow">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((column) => (
              <th key={String(column.key)} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {data.map((row) => (
            <tr key={String(row.id)} className="hover:bg-slate-50">
              {columns.map((column) => (
                <td key={String(column.key)} className="px-4 py-3 text-sm text-slate-700">
                  {column.render ? column.render(row[column.key], row) : String(row[column.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
