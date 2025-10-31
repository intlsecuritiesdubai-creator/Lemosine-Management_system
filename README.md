# Limousine Enterprise Management System

A full-stack enterprise platform for limousine businesses to manage vehicles, drivers, finance, HR, accidents, and analytics. The system follows a modular clean architecture with role-based access control and production-ready Docker deployment.

## Features

- **Role-based access control** with JWT authentication for Super Admin, Fleet Manager, Finance Officer, Driver, Client Manager, and Viewer roles.
- **Fleet operations** covering vehicle lifecycle, maintenance scheduling, digital document vault, driver assignments, fuel tracking, trips, and accident logging.
- **Driver management** including licensing, visa, attendance, leave workflows, performance reviews, document vault, assignment history, salary, and performance data.
- **Finance & HR** modules to capture expenses with approvals, income streams, breakdown analytics, salary slips, allowances, overtime, and payroll disbursement tracking.
- **Accident management** with insurance coordination, salary deductions, document evidence, and reporting.
- **Alerts, notifications & analytics** providing KPIs, renewal alerts, performance insights, and financial summaries with drill-downs.
- **Audit-ready Postgres database** with notifications, audit logs, and seed bootstrap admin user.
- **Dockerized deployment** with separate services for API, SPA, database, and Nginx gateway.

## Tech Stack

- **Backend:** Node.js, Express, TypeORM, PostgreSQL
- **Frontend:** React, Vite, Tailwind CSS, React Query
- **Auth:** JSON Web Tokens (access + refresh ready), RBAC middleware
- **Deployment:** Docker Compose with Postgres and Nginx reverse proxy

## Project Structure

```
├── backend
│   ├── src
│   │   ├── config / core / database
│   │   ├── modules (auth, users, fleet, drivers, finance, hr, accidents, reports)
│   │   └── routes.ts
│   ├── database/init.sql
│   ├── Dockerfile
│   └── .env.example
├── frontend
│   ├── src (api, components, layout, pages, hooks, providers, types)
│   ├── Dockerfile
│   └── vite/tailwind config
├── docker
│   └── nginx.conf
├── docker-compose.yml
└── README.md
```

## Getting Started (Local Development)

1. **Prerequisites**
   - Node.js 18+
   - PostgreSQL 14+
   - pnpm / npm / yarn for installing packages

2. **Environment**
   ```bash
   cp backend/.env.example backend/.env
   ```
   Adjust database credentials as needed.

3. **Install Dependencies**
   ```bash
   # Backend
   cd backend
   npm install
   npm run build # optional type check
   npm run start:dev

   # Frontend
   cd ../frontend
   npm install
   npm run dev
   ```

4. **Bootstrap admin user**
   ```bash
   curl -X POST http://localhost:8000/api/auth/bootstrap
   ```
   Default credentials: `admin@limousine.local / ChangeMe123!`

5. **Login via SPA** at `http://localhost:5173/login` and navigate the dashboards.

## Docker Deployment

A production-ready compose stack is provided.

```bash
docker compose up --build
```

Services:
- `postgres` – PostgreSQL with preloaded schema.
- `backend` – Express API (`http://localhost:8080/api`).
- `frontend` – React SPA served by Nginx.
- `gateway` – Nginx reverse proxy exposing the platform on `http://localhost:8080`.

## Database Schema

The schema is defined in `backend/database/init.sql`, covering roles, users, vehicles, drivers, maintenance, trips, expenses, income, salaries, accidents, vehicle assignments, digital documents, driver attendance, leave requests, performance reviews, notifications, and audit logs. TypeORM entities mirror this structure for runtime operations.

## Testing & Quality

- Type-safe DTO validation via `zod`.
- Centralized error handling and structured logging (Winston).
- React Query for resilient data fetching with caching.

## Next Steps

- Implement refresh tokens and user self-service password resets.
- Add automated email alerts for upcoming renewals.
- Expand test coverage with Jest (backend) and Vitest (frontend).
- Integrate 2FA using TOTP providers.

## License

MIT
