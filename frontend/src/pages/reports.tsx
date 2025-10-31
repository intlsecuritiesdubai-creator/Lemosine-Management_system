import { useApiQuery } from '../hooks/useApi';
import { ApiResponse, Vehicle, VehicleDocument } from '../types';
import { DataTable } from '../components/data-table';

interface RenewalVehicle extends Vehicle {
  insuranceExpiry?: string;
  registrationExpiry?: string;
  permitExpiry?: string;
}

export const ReportsPage = () => {
  const { data } = useApiQuery<ApiResponse<{ vehicles: RenewalVehicle[]; documents: VehicleDocument[] }>>(['renewals'], {
    url: '/reports/renewals'
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Reports & Analytics</h1>
        <p className="text-slate-500">Upcoming renewals and compliance alerts.</p>
      </div>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Vehicle Renewals</h2>
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
            },
            {
              key: 'permitExpiry',
              label: 'Permit Expiry',
              render: (value) => (value ? new Date(String(value)).toLocaleDateString() : '—')
            }
          ]}
          data={data?.data.vehicles}
        />
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Expiring Documents</h2>
        <DataTable
          columns={[
            { key: 'title', label: 'Title' },
            { key: 'type', label: 'Type' },
            {
              key: 'expiryDate',
              label: 'Expiry',
              render: (value) => (value ? new Date(String(value)).toLocaleDateString() : '—')
            },
            {
              key: 'url',
              label: 'Reference',
              render: (value) => (value ? <a className="text-emerald-600" href={String(value)} target="_blank" rel="noreferrer">View</a> : '—')
            }
          ]}
          data={data?.data.documents}
        />
      </section>
    </div>
  );
};
