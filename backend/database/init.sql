CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) UNIQUE NOT NULL,
  permissions JSONB NOT NULL DEFAULT '{}'::jsonb,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  "fullName" VARCHAR(255) NOT NULL,
  password TEXT NOT NULL,
  "isActive" BOOLEAN DEFAULT TRUE,
  phone VARCHAR(50),
  "createdBy" VARCHAR(255),
  "updatedBy" VARCHAR(255),
  role_id UUID REFERENCES roles(id),
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "plateNumber" VARCHAR(50) UNIQUE NOT NULL,
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INT NOT NULL,
  status VARCHAR(20) NOT NULL,
  "insuranceExpiry" DATE,
  "registrationExpiry" DATE,
  "permitExpiry" DATE,
  mileage NUMERIC(12,2) DEFAULT 0,
  "fuelUsage" NUMERIC(12,2) DEFAULT 0,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "emiratesId" VARCHAR(50) NOT NULL,
  "licenseNumber" VARCHAR(50) NOT NULL,
  "licenseExpiry" DATE NOT NULL,
  "visaExpiry" DATE,
  "baseSalary" NUMERIC(12,2) DEFAULT 0,
  "overtimeRate" NUMERIC(12,2) DEFAULT 0,
  "isActive" BOOLEAN DEFAULT TRUE,
  user_id UUID REFERENCES users(id),
  "assignedVehicle_id" UUID REFERENCES vehicles(id),
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS maintenance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  "scheduledDate" DATE NOT NULL,
  "completedDate" DATE,
  cost NUMERIC(12,2) DEFAULT 0,
  vendor VARCHAR(255),
  odometer NUMERIC(12,2),
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "clientName" VARCHAR(255) NOT NULL,
  "startTime" TIMESTAMP NOT NULL,
  "endTime" TIMESTAMP NOT NULL,
  revenue NUMERIC(12,2) NOT NULL,
  notes TEXT,
  vehicle_id UUID REFERENCES vehicles(id),
  driver_id UUID REFERENCES drivers(id),
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category VARCHAR(50) NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  "incurredOn" DATE NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'PENDING',
  "receiptUrl" TEXT,
  "approvedBy" VARCHAR(255),
  "approvedAt" TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  vehicle_id UUID REFERENCES vehicles(id),
  driver_id UUID REFERENCES drivers(id),
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS income_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source VARCHAR(50) NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  "receivedOn" DATE NOT NULL,
  description TEXT,
  reference VARCHAR(255),
  "invoiceUrl" TEXT,
  vehicle_id UUID REFERENCES vehicles(id),
  driver_id UUID REFERENCES drivers(id),
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS salary_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "periodStart" DATE NOT NULL,
  "periodEnd" DATE NOT NULL,
  "grossAmount" NUMERIC(12,2) NOT NULL,
  deductions NUMERIC(12,2) NOT NULL,
  allowances NUMERIC(12,2) DEFAULT 0,
  "overtimePay" NUMERIC(12,2) DEFAULT 0,
  "netAmount" NUMERIC(12,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'PENDING',
  "paymentDate" DATE,
  "generatedBy" VARCHAR(255),
  driver_id UUID REFERENCES drivers(id),
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS accidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "occurredOn" DATE NOT NULL,
  description TEXT NOT NULL,
  "damageCost" NUMERIC(12,2) DEFAULT 0,
  "policeReportNumber" VARCHAR(100),
  notes TEXT,
  attachments JSONB,
  "insuranceClaim" NUMERIC(12,2) DEFAULT 0,
  "deductedFromSalary" NUMERIC(12,2) DEFAULT 0,
  vehicle_id UUID REFERENCES vehicles(id),
  driver_id UUID REFERENCES drivers(id),
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS vehicle_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
  driver_id UUID REFERENCES drivers(id) ON DELETE CASCADE,
  "assignedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
  "releasedAt" TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  url TEXT NOT NULL,
  "issuedAt" DATE,
  "expiryDate" DATE,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
  driver_id UUID REFERENCES drivers(id) ON DELETE CASCADE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS driver_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID REFERENCES drivers(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status VARCHAR(20) NOT NULL,
  "checkIn" TIME,
  "checkOut" TIME,
  notes TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS driver_leaves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID REFERENCES drivers(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL,
  "startDate" DATE NOT NULL,
  "endDate" DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'REQUESTED',
  reason TEXT,
  "approvedBy" VARCHAR(255),
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS driver_performance_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id UUID REFERENCES drivers(id) ON DELETE CASCADE,
  "reviewerId" VARCHAR(255),
  "periodStart" DATE NOT NULL,
  "periodEnd" DATE NOT NULL,
  score NUMERIC(5,2) NOT NULL,
  comments TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  "isRead" BOOLEAN DEFAULT FALSE,
  metadata JSONB,
  "targetRole" VARCHAR(50),
  "targetUserId" UUID,
  "acknowledgedAt" TIMESTAMP WITH TIME ZONE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "entityName" VARCHAR(100) NOT NULL,
  "entityId" VARCHAR(100) NOT NULL,
  action VARCHAR(50) NOT NULL,
  "actorId" VARCHAR(100),
  changes JSONB,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
