import { useApiQuery } from '../hooks/useApi';
import { ApiResponse, Vehicle } from '../types';
import { DataTable } from '../components/data-table';

export const VehiclesPage = () => {
  const { data } = useApiQuery<ApiResponse<Vehicle[]>>(['vehicles'], { url: '/fleet' });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Fleet Management</h1>
        <p className="text-slate-500">Track fleet status, maintenance and lifecycle.</p>
      </div>
      <DataTable
        columns={[
          { key: 'plateNumber', label: 'Plate' },
          { key: 'brand', label: 'Brand' },
          { key: 'model', label: 'Model' },
          { key: 'year', label: 'Year' },
          { key: 'status', label: 'Status' },
          {
            key: 'mileage',
            label: 'Mileage',
            render: (value) => `${Number(value ?? 0).toLocaleString()} km`
          }
        ]}
        data={data?.data}
      />
    </div>
  );
};
