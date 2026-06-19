import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { api, type ApiResponse, type User } from '../lib/api';

const Signup = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const parts = fullName.trim().split(/\s+/);
      const firstName = parts[0] ?? '';
      const lastName = parts.slice(1).join(' ') || firstName;
      await api.post<ApiResponse<User>>('/auth/register', {
        firstName,
        lastName,
        email,
        phone,
        password,
      });
      navigate('/verify-otp', { state: { email, flow: 'signup' } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join SurePlug to book trusted taskers and get help when you need it."
      backTo={{ label: 'Back to home', href: '/' }}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="fullName" className="auth-label">
            Full name
          </label>
          <input
            id="fullName"
            type="text"
            autoComplete="name"
            required
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder="Ada Okonkwo"
            className="auth-input"
          />
        </div>

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
          <label htmlFor="phone" className="auth-label">
            Phone number
          </label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            required
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="+234 800 000 0000"
            className="auth-input"
          />
        </div>

        <div>
          <label htmlFor="password" className="auth-label">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="At least 8 characters"
            className="auth-input"
          />
        </div>

        <p className="text-xs text-gray-500 leading-relaxed">
          By creating an account, you agree to our Terms of Use and Privacy Policy.
        </p>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button type="submit" className="btn-pill w-full" disabled={loading}>
          {loading ? 'Creating account…' : 'Continue'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-mint hover:text-mint-dark">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Signup;
