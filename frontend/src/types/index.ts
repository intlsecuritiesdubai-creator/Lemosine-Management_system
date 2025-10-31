export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface DashboardKpi {
  vehicleCount: number;
  driverCount: number;
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  accidentCount: number;
}

export interface Vehicle {
  id: string;
  plateNumber: string;
  brand: string;
  model: string;
  year: number;
  status: string;
  mileage: number;
  fuelUsage: number;
}

export interface Driver {
  id: string;
  emiratesId: string;
  licenseNumber: string;
  licenseExpiry: string;
  baseSalary: number;
  overtimeRate: number;
  assignedVehicle?: Vehicle;
}

export interface Expense {
  id: string;
  category: string;
  amount: number;
  incurredOn: string;
  status: string;
}

export interface Income {
  id: string;
  source: string;
  amount: number;
  receivedOn: string;
}

export interface Salary {
  id: string;
  periodStart: string;
  periodEnd: string;
  netAmount: number;
  status: string;
}

export interface Accident {
  id: string;
  occurredOn: string;
  description: string;
  damageCost: number;
}
