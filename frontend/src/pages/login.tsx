import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/client';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@limousine.local');
  const [password, setPassword] = useState('ChangeMe123!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await apiClient.post('/auth/login', { email, password });
      if (data?.data?.accessToken) {
        localStorage.setItem('accessToken', data.data.accessToken);
        navigate('/');
      }
    } catch (err) {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-xl p-10 w-full max-w-md space-y-6">
        <h1 className="text-2xl font-semibold text-center text-primary">Limousine Enterprise Login</h1>
        {error && <div className="rounded bg-red-100 px-3 py-2 text-sm text-red-600">{error}</div>}
        <label className="block space-y-1">
          <span className="text-sm font-medium text-slate-600">Email</span>
          <input
            className="w-full rounded border border-slate-200 px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium text-slate-600">Password</span>
          <input
            className="w-full rounded border border-slate-200 px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
          />
        </label>
        <button
          type="submit"
          className="w-full rounded bg-primary py-2 text-white font-semibold disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
        <p className="text-xs text-center text-slate-500">
          Use the bootstrap credentials or ask an administrator for access.
        </p>
      </form>
    </div>
  );
};
