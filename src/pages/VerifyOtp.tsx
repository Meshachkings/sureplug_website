import { FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import OtpInput from '../components/OtpInput';

type LocationState = {
  email?: string;
  flow?: 'signup' | 'reset';
};

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState) ?? {};
  const email = state.email ?? 'your email';
  const flow = state.flow ?? 'reset';

  const [otp, setOtp] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (flow === 'signup') {
      navigate('/taskers');
      return;
    }
    navigate('/reset-password', { state: { email } });
  };

  const title = flow === 'signup' ? 'Verify your email' : 'Enter verification code';
  const subtitle =
    flow === 'signup'
      ? `We sent a 6-digit code to ${email}. Enter it below to complete your signup.`
      : `We sent a 6-digit code to ${email}. Enter it to reset your password.`;

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

        <button type="submit" className="btn-pill w-full" disabled={otp.length < 6}>
          Verify code
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Didn&apos;t receive a code?{' '}
        <button type="button" className="font-semibold text-mint hover:text-mint-dark">
          Resend code
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
