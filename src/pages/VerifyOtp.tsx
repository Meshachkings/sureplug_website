import { FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import OtpInput from '../components/OtpInput';
import { api, type ApiResponse } from '../lib/api';
import { useAuth } from '../context/AuthContext';

type LocationState = {
  email?: string;
  flow?: 'signup' | 'reset';
};

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const state = (location.state as LocationState) ?? {};
  const email = state.email ?? '';
  const flow = state.flow ?? 'reset';

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (flow === 'signup') {
        const res = await api.post<ApiResponse<{ token?: string; user?: { _id: string; firstName: string; lastName: string; email: string } }>>(
          '/auth/verify-otp',
          { email, code: otp }
        );
        if (res.data.token && res.data.user) {
          login(res.data.token, res.data.user as Parameters<typeof login>[1]);
        }
        navigate('/taskers');
      } else {
        await api.post<ApiResponse<unknown>>('/auth/verify-forgot-password', {
          email,
          code: otp,
        });
        navigate('/reset-password', { state: { email, otp } });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendMessage('');
    setError('');
    setResendLoading(true);
    try {
      await api.post<ApiResponse<unknown>>('/auth/resend-otp', { email });
      setResendMessage('A new code has been sent to your email.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend code.');
    } finally {
      setResendLoading(false);
    }
  };

  const title = flow === 'signup' ? 'Verify your email' : 'Enter verification code';
  const subtitle =
    flow === 'signup'
      ? `We sent a 6-digit code to ${email || 'your email'}. Enter it below to complete your signup.`
      : `We sent a 6-digit code to ${email || 'your email'}. Enter it to reset your password.`;

  return (
    <AuthLayout
      title={title}
      subtitle={subtitle}
      backTo={{
        label: flow === 'signup' ? 'Back to signup' : 'Back to reset password',
        href: flow === 'signup' ? '/signup' : '/forgot-password',
      }}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="auth-label">Verification code</label>
          <OtpInput value={otp} onChange={setOtp} />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {resendMessage && <p className="text-sm text-mint">{resendMessage}</p>}

        <button type="submit" className="btn-pill w-full" disabled={otp.length < 6 || loading}>
          {loading ? 'Verifying…' : 'Verify code'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Didn&apos;t receive a code?{' '}
        <button
          type="button"
          onClick={handleResend}
          disabled={resendLoading}
          className="font-semibold text-mint hover:text-mint-dark disabled:opacity-50"
        >
          {resendLoading ? 'Sending…' : 'Resend code'}
        </button>
      </p>

      <p className="mt-3 text-center text-sm text-gray-500">
        <Link to="/login" className="font-semibold text-mint hover:text-mint-dark">
          Back to sign in
        </Link>
      </p>
    </AuthLayout>
  );
};

export default VerifyOtp;
