import { useApiQuery } from '../hooks/useApi';
import { ApiResponse, Driver } from '../types';
import { DataTable } from '../components/data-table';

export const DriversPage = () => {
  const { data } = useApiQuery<ApiResponse<Driver[]>>(['drivers'], { url: '/drivers' });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Driver Management</h1>
        <p className="text-slate-500">Monitor licensing, assignments, and salary metrics.</p>
      </div>
      <DataTable
        columns={[
          { key: 'licenseNumber', label: 'License' },
          { key: 'emiratesId', label: 'Emirates ID' },
          {
            key: 'licenseExpiry',
            label: 'License Expiry',
            render: (value) => new Date(String(value)).toLocaleDateString()
          },
          {
            key: 'baseSalary',
            label: 'Base Salary',
            render: (value) => `AED ${Number(value ?? 0).toLocaleString()}`
          },
          {
            key: 'overtimeRate',
            label: 'Overtime Rate',
            render: (value) => `AED ${Number(value ?? 0).toLocaleString()}`
          },
          {
            key: 'assignedVehicle',
            label: 'Assigned Vehicle',
            render: (value) => (value ? (value as Driver['assignedVehicle'])?.plateNumber : 'Unassigned')
          }
        ]}
        data={data?.data}
      />
    </div>
  );
};
