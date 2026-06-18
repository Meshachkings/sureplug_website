import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    navigate('/taskers');
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

        <button type="submit" className="btn-pill w-full mt-2">
          Sign in
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
    </AuthLayout>
  );
};

export default Login;
