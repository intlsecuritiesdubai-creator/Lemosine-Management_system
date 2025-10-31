import { useApiQuery } from '../hooks/useApi';
import { ApiResponse, Accident } from '../types';
import { DataTable } from '../components/data-table';

export const AccidentsPage = () => {
  const { data } = useApiQuery<ApiResponse<Accident[]>>(['accidents'], { url: '/accidents' });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Safety & Accident Management</h1>
        <p className="text-slate-500">Incident tracking and insurance coordination.</p>
      </div>
      <DataTable
        columns={[
          { key: 'occurredOn', label: 'Date', render: (value) => new Date(String(value)).toLocaleDateString() },
          { key: 'description', label: 'Description' },
          { key: 'damageCost', label: 'Damage Cost', render: (value) => `AED ${Number(value).toLocaleString()}` }
        ]}
        data={data?.data}
      />
    </div>
  );
};
