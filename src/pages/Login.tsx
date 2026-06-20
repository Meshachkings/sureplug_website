import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { api, type ApiResponse, type User } from '../lib/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post<ApiResponse<{ token: string; user: User }>>(
        '/auth/login',
        { email, password }
      );
      login(res.data.token, res.data.user);
      navigate(res.data.user.role === 'admin' ? '/admin' : '/taskers');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to book taskers, manage orders, and track your requests."
      backTo={{ label: 'Back to home', href: '/' }}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="auth-label">
            Email address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="auth-input"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="password" className="auth-label mb-0">
              Password
            </label>
            <Link to="/forgot-password" className="text-xs font-semibold text-mint hover:text-mint-dark">
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            className="auth-input"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button type="submit" className="btn-pill w-full mt-2" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Don&apos;t have an account?{' '}
        <Link to="/signup" className="font-semibold text-mint hover:text-mint-dark">
          Create account
        </Link>
      </p>

      <div className="mt-6 pt-6 border-t border-gray-100 text-center">
        <p className="text-sm text-gray-500 mb-3">Want to offer services?</p>
        <Link to="/become-a-provider" className="btn-pill-outline w-full">
          Become a provider
        </Link>
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-400">
          Admin?{' '}
          <Link to="/login" className="font-semibold text-gray-500 hover:text-gray-700">
            Use your admin credentials above
          </Link>
          {' '}or{' '}
          <Link to="/admin" className="font-semibold text-mint hover:text-mint-dark">
            Go to admin panel →
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;
