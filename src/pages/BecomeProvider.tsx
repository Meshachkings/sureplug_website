import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { CheckmarkCircle01Icon } from '@hugeicons/core-free-icons';
import HeroHeader from '../components/HeroHeader';
import { taskerCategories } from '../data/taskers';

type ProviderForm = {
  fullName: string;
  email: string;
  phone: string;
  category: string;
  role: string;
  city: string;
  experience: string;
  hourlyRate: string;
  bio: string;
  agreeTerms: boolean;
};

const steps = ['Account', 'Skills', 'Location', 'Review'];

const initialForm: ProviderForm = {
  fullName: '',
  email: '',
  phone: '',
  category: '',
  role: '',
  city: '',
  experience: '',
  hourlyRate: '',
  bio: '',
  agreeTerms: false,
};

const BecomeProvider = () => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<ProviderForm>(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const categories = taskerCategories.filter((item) => item !== 'All');

  const update = (field: keyof ProviderForm, value: string | boolean) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const next = () => setStep((current) => Math.min(current + 1, steps.length - 1));
  const back = () => setStep((current) => Math.max(current - 1, 0));

  const handleStepSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (step < steps.length - 1) {
      next();
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-white text-gray-900 min-h-screen overflow-x-hidden">
        <HeroHeader />
        <section className="hero-grain relative overflow-hidden rounded-b-[1.75rem] sm:rounded-b-[2.5rem]">
        </section>
        <main className="max-w-md mx-auto px-4 py-12 sm:py-16 text-center">
          <div className="profile-card p-8">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-mint/10 text-mint mx-auto">
              <HugeiconsIcon icon={CheckmarkCircle01Icon} size={28} color="#019B5F" strokeWidth={2} />
            </span>
            <h1 className="mt-5 text-xl sm:text-2xl font-semibold text-gray-900">Application submitted</h1>
            <p className="mt-3 text-sm text-gray-500 leading-relaxed">
              Thanks, {form.fullName.split(' ')[0]}! Our team will review your profile and contact you
              within 2–3 business days.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Link to="/login" className="btn-pill w-full">
                Sign in to your account
              </Link>
              <Link to="/" className="btn-pill-outline w-full">
                Back to home
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-white text-gray-900 min-h-screen overflow-x-hidden">
      <HeroHeader />
      <section className="hero-grain relative overflow-hidden rounded-b-[1.75rem] sm:rounded-b-[2.5rem]">
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <p className="text-white/50 text-[11px] font-medium uppercase tracking-[0.18em] mb-2">
            Become a provider
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
            Join SurePlug as a tasker
          </h1>
          <p className="mt-2 text-sm sm:text-base text-white/65 max-w-xl">
            Share your skills, set your rates, and start earning on your schedule.
          </p>
        </div>
      </section>

      <main className="max-w-xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="mb-8">
          <div className="flex items-center justify-between gap-2">
            {steps.map((label, index) => (
              <div key={label} className="flex-1">
                <div
                  className={`h-1 rounded-full transition-colors ${
                    index <= step ? 'bg-mint' : 'bg-gray-200'
                  }`}
                />
                <p
                  className={`mt-2 text-[10px] sm:text-xs font-medium truncate ${
                    index <= step ? 'text-gray-900' : 'text-gray-400'
                  }`}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="profile-card p-6 sm:p-8">
          <form onSubmit={handleStepSubmit} className="space-y-4">
            {step === 0 && (
              <>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Create your account</h2>
                <p className="text-sm text-gray-500 mb-4">Basic details to get started.</p>
                <div>
                  <label htmlFor="fullName" className="auth-label">Full name</label>
                  <input
                    id="fullName"
                    required
                    value={form.fullName}
                    onChange={(e) => update('fullName', e.target.value)}
                    className="auth-input"
                    placeholder="Paul Liam"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="auth-label">Email address</label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    className="auth-input"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="auth-label">Phone number</label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value)}
                    className="auth-input"
                    placeholder="+234 800 000 0000"
                  />
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Your skills</h2>
                <p className="text-sm text-gray-500 mb-4">Tell us what services you offer.</p>
                <div>
                  <label htmlFor="category" className="auth-label">Primary category</label>
                  <select
                    id="category"
                    required
                    value={form.category}
                    onChange={(e) => update('category', e.target.value)}
                    className="auth-select"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="role" className="auth-label">Professional title</label>
                  <input
                    id="role"
                    required
                    value={form.role}
                    onChange={(e) => update('role', e.target.value)}
                    className="auth-input"
                    placeholder="Electrician, Cleaner, Plumber..."
                  />
                </div>
                <div>
                  <label htmlFor="experience" className="auth-label">Years of experience</label>
                  <select
                    id="experience"
                    required
                    value={form.experience}
                    onChange={(e) => update('experience', e.target.value)}
                    className="auth-select"
                  >
                    <option value="">Select experience</option>
                    <option value="0-1">Less than 1 year</option>
                    <option value="1-3">1–3 years</option>
                    <option value="3-5">3–5 years</option>
                    <option value="5+">5+ years</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="hourlyRate" className="auth-label">Hourly rate (₦)</label>
                  <input
                    id="hourlyRate"
                    type="number"
                    required
                    min={1000}
                    step={500}
                    value={form.hourlyRate}
                    onChange={(e) => update('hourlyRate', e.target.value)}
                    className="auth-input"
                    placeholder="10000"
                  />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Location & availability</h2>
                <p className="text-sm text-gray-500 mb-4">Where do you work and when are you available?</p>
                <div>
                  <label htmlFor="city" className="auth-label">City</label>
                  <input
                    id="city"
                    required
                    value={form.city}
                    onChange={(e) => update('city', e.target.value)}
                    className="auth-input"
                    placeholder="Lagos, Abuja, Port Harcourt..."
                  />
                </div>
                <div>
                  <label htmlFor="bio" className="auth-label">Short bio</label>
                  <textarea
                    id="bio"
                    required
                    rows={4}
                    value={form.bio}
                    onChange={(e) => update('bio', e.target.value)}
                    className="auth-input resize-none"
                    placeholder="Briefly describe your experience and the services you offer."
                  />
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Review your application</h2>
                <p className="text-sm text-gray-500 mb-4">Confirm your details before submitting.</p>
                <dl className="space-y-3 text-sm">
                  {[
                    ['Name', form.fullName],
                    ['Email', form.email],
                    ['Phone', form.phone],
                    ['Category', form.category],
                    ['Title', form.role],
                    ['Experience', form.experience ? `${form.experience} years` : ''],
                    ['Hourly rate', form.hourlyRate ? `₦${Number(form.hourlyRate).toLocaleString()}/hr` : ''],
                    ['City', form.city],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-4 py-2 border-b border-gray-100 last:border-0">
                      <dt className="text-gray-500">{label}</dt>
                      <dd className="font-medium text-gray-900 text-right">{value}</dd>
                    </div>
                  ))}
                </dl>
                <label className="flex items-start gap-3 mt-4 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={form.agreeTerms}
                    onChange={(e) => update('agreeTerms', e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-mint focus:ring-mint"
                  />
                  <span className="text-sm text-gray-600 leading-relaxed">
                    I agree to SurePlug&apos;s provider terms and confirm that my information is accurate.
                  </span>
                </label>
              </>
            )}

            <div className="flex gap-3 pt-4">
              {step > 0 && (
                <button type="button" onClick={back} className="btn-pill-outline flex-1">
                  Back
                </button>
              )}
              <button type="submit" className="btn-pill flex-1">
                {step === steps.length - 1 ? 'Submit application' : 'Continue'}
              </button>
            </div>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already a provider?{' '}
          <Link to="/login" className="font-semibold text-mint hover:text-mint-dark">
            Sign in
          </Link>
        </p>
      </main>
    </div>
  );
};

export default BecomeProvider;
