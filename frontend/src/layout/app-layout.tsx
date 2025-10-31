import { Outlet, NavLink, useNavigate } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/vehicles', label: 'Fleet' },
  { to: '/drivers', label: 'Drivers' },
  { to: '/finance', label: 'Finance' },
  { to: '/salaries', label: 'Salaries' },
  { to: '/accidents', label: 'Accidents' },
  { to: '/reports', label: 'Reports' }
];

export const AppLayout = () => {
  const navigate = useNavigate();
  const activeClass = 'bg-primary text-white';

  return (
    <div className="min-h-screen flex bg-slate-100 text-slate-900">
      <aside className="w-64 bg-white shadow-lg p-6 space-y-6">
        <div className="text-2xl font-bold text-primary">Limo Enterprise</div>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `block rounded px-4 py-2 font-medium transition ${isActive ? activeClass : 'hover:bg-slate-100'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button
          className="w-full rounded bg-slate-200 py-2 text-sm font-semibold"
          onClick={() => navigate('/login')}
        >
          Logout
        </button>
      </aside>
      <main className="flex-1 p-8 space-y-6">
        <Outlet />
      </main>
    </div>
  );
};
