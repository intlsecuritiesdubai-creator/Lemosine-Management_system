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
  "netAmount" NUMERIC(12,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'PENDING',
  "paymentDate" DATE,
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
  vehicle_id UUID REFERENCES vehicles(id),
  driver_id UUID REFERENCES drivers(id),
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
