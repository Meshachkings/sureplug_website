import { FormEvent, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  CheckmarkCircle01Icon,
  ArrowRight01Icon,
  Certificate01Icon,
  UserAdd01Icon,
} from '@hugeicons/core-free-icons';
import AuthLayout from '../components/AuthLayout';
import OtpInput from '../components/OtpInput';
import { api, type ApiResponse, type User } from '../lib/api';
import { useAuth } from '../context/AuthContext';

type Step = 'register' | 'verify' | 'upgrade' | 'badge';

const STEPS: Step[] = ['register', 'verify', 'upgrade', 'badge'];
const STEP_LABELS = ['Account', 'Verify email', 'Upgrade', 'Get verified'];

function StepProgress({ step }: { step: Step }) {
  const idx = STEPS.indexOf(step);
  return (
    <div className="flex items-center gap-2 mb-7">
      {STEPS.map((s, i) => (
        <div key={s} className="flex-1">
          <div className={`h-1 rounded-full transition-colors ${i <= idx ? 'bg-[#019B5F]' : 'bg-gray-200'}`} />
          <p className={`mt-1.5 text-[10px] font-medium truncate ${i <= idx ? 'text-gray-900' : 'text-gray-400'}`}>
            {STEP_LABELS[i]}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function BecomeProvider() {
  const navigate = useNavigate();
  const { user, login, updateUser } = useAuth();

  const [step, setStep] = useState<Step>('register');

  // register fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // otp
  const [otp, setOtp] = useState('');
  const [resendMsg, setResendMsg] = useState('');
  const [resendLoading, setResendLoading] = useState(false);

  // shared
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // badge
  const [badgeLoading, setBadgeLoading] = useState(false);
  const [badgeAmount, setBadgeAmount] = useState(5000);

  // track which email is pending verification
  const pendingEmail = useRef(email);

  // If already logged in, skip to the right step
  useEffect(() => {
    if (!user) return;
    if (user.role === 'seller' || user.role === 'admin') {
      setStep('badge');
    } else {
      setStep('upgrade');
    }
  }, []);   // eslint-disable-line react-hooks/exhaustive-deps

  // ── Step 1: Register ───────────────────────────────────────────────────────
  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post<ApiResponse<unknown>>('/auth/register', {
        firstName,
        lastName,
        email,
        phone,
        password,
      });
      pendingEmail.current = email;
      setStep('verify');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify OTP → auto-login → auto-upgrade ────────────────────────
  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post<ApiResponse<{ token: string; user: User }>>(
        '/auth/verify-otp',
        { email: pendingEmail.current, code: otp }
      );
      const { token: newToken, user: newUser } = res.data;
      login(newToken, newUser);

      // immediately upgrade role
      await api.post<ApiResponse<unknown>>('/users/become-provider', {}, true);
      updateUser({ role: 'seller' });
      setStep('badge');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendMsg('');
    setError('');
    setResendLoading(true);
    try {
      await api.post<ApiResponse<unknown>>('/auth/resend-otp', { email: pendingEmail.current });
      setResendMsg('A new code has been sent to your email.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend code.');
    } finally {
      setResendLoading(false);
    }
  };

  // ── Step 3: Upgrade (already logged in as user) ────────────────────────────
  const handleUpgrade = async () => {
    setError('');
    setLoading(true);
    try {
      await api.post<ApiResponse<unknown>>('/users/become-provider', {}, true);
      updateUser({ role: 'seller' });
      setStep('badge');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upgrade failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Step 4: Pay for verification badge ─────────────────────────────────────
  const handlePayForBadge = async () => {
    setError('');
    setBadgeLoading(true);
    try {
      const res = await api.post<ApiResponse<{ authorization_url: string; reference: string; amount: number }>>(
        '/verification/initialize',
        {},
        true
      );
      setBadgeAmount(res.data.amount);
      window.location.href = res.data.authorization_url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not start payment. Please try again.');
      setBadgeLoading(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  const titles: Record<Step, { title: string; subtitle: string }> = {
    register: {
      title: 'Join as a provider',
      subtitle: 'Create your account to start offering services on SurePlug.',
    },
    verify: {
      title: 'Verify your email',
      subtitle: `We sent a 6-digit code to ${pendingEmail.current || 'your email'}. Enter it below.`,
    },
    upgrade: {
      title: 'Become a provider',
      subtitle: 'One tap to upgrade your account and start listing services.',
    },
    badge: {
      title: 'Get your verified badge',
      subtitle: 'Stand out to customers with an official SurePlug verification badge.',
    },
  };

  const { title, subtitle } = titles[step];

  return (
    <AuthLayout
      title={title}
      subtitle={subtitle}
      backTo={step === 'register' ? { label: 'Back to home', href: '/' } : undefined}
    >
      <StepProgress step={step} />

      {/* ── Register ── */}
      {step === 'register' && (
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="firstName" className="auth-label">First name</label>
              <input
                id="firstName"
                required
                autoComplete="given-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Ada"
                className="auth-input"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="auth-label">Last name</label>
              <input
                id="lastName"
                required
                autoComplete="family-name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Okonkwo"
                className="auth-input"
              />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="auth-label">Email address</label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="auth-input"
            />
          </div>
          <div>
            <label htmlFor="phone" className="auth-label">Phone number</label>
            <input
              id="phone"
              type="tel"
              required
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="08012345678"
              className="auth-input"
            />
          </div>
          <div>
            <label htmlFor="password" className="auth-label">Password</label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="auth-input"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" className="btn-pill w-full" disabled={loading}>
            {loading ? 'Creating account…' : 'Continue'}
          </button>
          <p className="text-xs text-gray-400 text-center leading-relaxed">
            By continuing you agree to SurePlug's Terms of Use and Privacy Policy.
          </p>
        </form>
      )}

      {/* ── Verify OTP ── */}
      {step === 'verify' && (
        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <label className="auth-label">Verification code</label>
            <OtpInput value={otp} onChange={setOtp} />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {resendMsg && <p className="text-sm text-[#019B5F]">{resendMsg}</p>}
          <button type="submit" className="btn-pill w-full" disabled={otp.length < 6 || loading}>
            {loading ? 'Verifying…' : 'Verify & continue'}
          </button>
          <p className="text-center text-sm text-gray-500">
            Didn't receive a code?{' '}
            <button
              type="button"
              onClick={handleResend}
              disabled={resendLoading}
              className="font-semibold text-[#019B5F] hover:text-[#017a4c] disabled:opacity-50"
            >
              {resendLoading ? 'Sending…' : 'Resend code'}
            </button>
          </p>
        </form>
      )}

      {/* ── Upgrade ── */}
      {step === 'upgrade' && (
        <div className="space-y-5">
          <div className="rounded-2xl bg-[#019B5F]/6 border border-[#019B5F]/15 p-5 flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#019B5F]/10 flex items-center justify-center shrink-0">
              <HugeiconsIcon icon={UserAdd01Icon} size={18} color="#019B5F" strokeWidth={2} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-1">Provider account</p>
              <p className="text-sm text-gray-500 leading-relaxed">
                Upgrading to a provider account lets you list services, receive bookings, and earn on your schedule. Free to activate.
              </p>
            </div>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button className="btn-pill w-full" onClick={handleUpgrade} disabled={loading}>
            {loading ? 'Upgrading…' : 'Become a provider'}
          </button>
          <button
            className="w-full text-sm text-gray-400 hover:text-gray-600 transition-colors"
            onClick={() => navigate('/taskers')}
          >
            Skip for now
          </button>
        </div>
      )}

      {/* ── Badge ── */}
      {step === 'badge' && (
        <div className="space-y-5">
          <div className="rounded-2xl bg-amber-50 border border-amber-200/60 p-5 flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
              <HugeiconsIcon icon={Certificate01Icon} size={18} color="#d97706" strokeWidth={2} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-1">SurePlug Verified badge</p>
              <p className="text-sm text-gray-500 leading-relaxed">
                Verified providers appear higher in search results and earn 3× more bookings on average. A one-time fee of <span className="font-semibold text-gray-900">₦{badgeAmount.toLocaleString()}</span>.
              </p>
            </div>
          </div>

          <ul className="space-y-2.5">
            {[
              'Verified badge on your profile',
              'Priority ranking in search results',
              'Higher customer trust and conversion',
            ].map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-sm text-gray-600">
                <HugeiconsIcon icon={CheckmarkCircle01Icon} size={16} color="#019B5F" strokeWidth={2} />
                {item}
              </li>
            ))}
          </ul>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button className="btn-pill w-full" onClick={handlePayForBadge} disabled={badgeLoading}>
            {badgeLoading ? 'Redirecting to payment…' : `Pay ₦${badgeAmount.toLocaleString()} to get verified`}
          </button>

          <button
            className="w-full flex items-center justify-center gap-1.5 text-sm font-medium text-[#019B5F] hover:text-[#017a4c] transition-colors"
            onClick={() => navigate('/taskers')}
          >
            Skip for now
            <HugeiconsIcon icon={ArrowRight01Icon} size={14} color="currentColor" strokeWidth={2} />
          </button>
        </div>
      )}

      {step === 'register' && (
        <p className="mt-6 text-center text-sm text-gray-500">
          Already a provider?{' '}
          <Link to="/login" className="font-semibold text-[#019B5F] hover:text-[#017a4c]">
            Sign in
          </Link>
        </p>
      )}
    </AuthLayout>
  );
}
