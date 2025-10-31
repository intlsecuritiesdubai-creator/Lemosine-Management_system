export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface DashboardKpi {
  vehicleCount: number;
  activeVehicles: number;
  driverCount: number;
  activeDrivers: number;
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  accidentCount: number;
  pendingExpenses: number;
  pendingPayroll: number;
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

export interface VehicleDocument {
  id: string;
  title: string;
  type: string;
  url: string;
  issuedAt?: string;
  expiryDate?: string;
}

export interface VehicleAssignment {
  id: string;
  driver: Driver;
  assignedAt: string;
  releasedAt?: string;
  notes?: string;
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

export interface DriverDocument {
  id: string;
  title: string;
  type: string;
  url: string;
  expiryDate?: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  status: string;
  checkIn?: string;
  checkOut?: string;
  notes?: string;
}

export interface LeaveRequest {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  status: string;
  reason?: string;
  approvedBy?: string;
}

export interface PerformanceReview {
  id: string;
  periodStart: string;
  periodEnd: string;
  score: number;
  comments?: string;
}

export interface Expense {
  id: string;
  category: string;
  amount: number;
  incurredOn: string;
  status: string;
  receiptUrl?: string;
}

export interface Income {
  id: string;
  source: string;
  amount: number;
  receivedOn: string;
  reference?: string;
}

export interface Salary {
  id: string;
  periodStart: string;
  periodEnd: string;
  allowances: number;
  overtimePay: number;
  netAmount: number;
  status: string;
  paymentDate?: string;
}

export interface Accident {
  id: string;
  occurredOn: string;
  description: string;
  damageCost: number;
  insuranceClaim: number;
  deductedFromSalary: number;
}

export interface FinancialSummary {
  monthlyIncome: Array<{ month: string; totalIncome: number }>;
  totalExpenses: number;
  totalSalary: number;
  netProfit: number;
  incomeBySource: Array<{ source: string; total: number }>;
  expenseByCategory: Array<{ category: string; total: number }>;
}

export interface AlertItem {
  id: string;
  type: string;
  message: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface DriverPerformance {
  driverId: string;
  attendanceRate: number;
  accidentCount: number;
  leaveCount: number;
}
