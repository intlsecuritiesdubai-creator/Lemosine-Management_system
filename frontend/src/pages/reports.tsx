import { useApiQuery } from '../hooks/useApi';
import { ApiResponse, Vehicle } from '../types';
import { DataTable } from '../components/data-table';

interface RenewalVehicle extends Vehicle {
  insuranceExpiry?: string;
  registrationExpiry?: string;
  permitExpiry?: string;
}

export const ReportsPage = () => {
  const { data } = useApiQuery<ApiResponse<RenewalVehicle[]>>(['renewals'], { url: '/reports/renewals' });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Reports & Analytics</h1>
        <p className="text-slate-500">Upcoming renewals and compliance alerts.</p>
      </div>
      <DataTable
        columns={[
          { key: 'plateNumber', label: 'Plate' },
          { key: 'brand', label: 'Brand' },
          { key: 'model', label: 'Model' },
          {
            key: 'insuranceExpiry',
            label: 'Insurance Expiry',
            render: (value) => (value ? new Date(String(value)).toLocaleDateString() : '—')
          },
          {
            key: 'registrationExpiry',
            label: 'Registration Expiry',
            render: (value) => (value ? new Date(String(value)).toLocaleDateString() : '—')
          }
        ]}
        data={data?.data}
      />
    </div>
  );
};
