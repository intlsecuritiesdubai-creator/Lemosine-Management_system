interface CardProps {
  title: string;
  value: string | number;
  accent?: string;
}

export const Card = ({ title, value, accent }: CardProps) => (
  <div className="rounded-xl bg-white p-6 shadow-md">
    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</h3>
    <p className="mt-4 text-3xl font-bold text-slate-900">{value}</p>
    {accent && <p className="mt-2 text-sm text-slate-500">{accent}</p>}
  </div>
);
