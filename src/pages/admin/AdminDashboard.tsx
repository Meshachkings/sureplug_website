import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import type { IconSvgElement } from '@hugeicons/react';
import {
  UserGroupIcon,
  Package01Icon,
  Bookmark01Icon,
  FavouriteIcon,
  Certificate01Icon,
  Mail01Icon,
  Clock01Icon,
  MoneyReceive01Icon,
  UserIcon,
  UserAdd01Icon,
  ArrowRight01Icon,
} from '@hugeicons/core-free-icons';
import { api, type ApiResponse } from '../../lib/adminApi';
import type { AdminDashboardData } from '../../lib/adminApi';
import { formatNaira } from '../../lib/format';
import { useAuth } from '../../context/AuthContext';

type Tone = 'slate' | 'blue' | 'amber' | 'rose' | 'teal' | 'violet' | 'orange' | 'sky';

const TONE_STYLES: Record<Tone, { icon: string; soft: string }> = {
  slate:  { icon: 'bg-slate-900 text-white', soft: 'bg-slate-100 text-slate-700' },
  blue:   { icon: 'bg-blue-600 text-white', soft: 'bg-blue-50 text-blue-700' },
  amber:  { icon: 'bg-amber-500 text-white', soft: 'bg-amber-50 text-amber-700' },
  rose:   { icon: 'bg-rose-500 text-white', soft: 'bg-rose-50 text-rose-700' },
  teal:   { icon: 'bg-teal-600 text-white', soft: 'bg-teal-50 text-teal-700' },
  violet: { icon: 'bg-violet-600 text-white', soft: 'bg-violet-50 text-violet-700' },
  orange: { icon: 'bg-orange-500 text-white', soft: 'bg-orange-50 text-orange-700' },
  sky:    { icon: 'bg-sky-600 text-white', soft: 'bg-sky-50 text-sky-700' },
};

interface MetricCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: IconSvgElement;
  to?: string;
  tone?: Tone;
  featured?: boolean;
}

function MetricCard({ label, value, sub, icon, to, tone = 'slate', featured }: MetricCardProps) {
  const styles = TONE_STYLES[tone];

  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${featured ? 'bg-white/15 text-white' : styles.icon}`}>
          <HugeiconsIcon icon={icon} size={18} strokeWidth={1.8} color="currentColor" />
        </div>
        {to && (
          <span
            className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
              featured
                ? 'bg-white/10 text-white/60 group-hover:bg-white/20 group-hover:text-white'
                : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-700'
            }`}
          >
            <HugeiconsIcon icon={ArrowRight01Icon} size={14} strokeWidth={2.2} color="currentColor" />
          </span>
        )}
      </div>
      <div className="mt-5 min-w-0">
        <p className={`text-xs font-medium tracking-wide mb-1.5 ${featured ? 'text-white/55' : 'text-slate-400'}`}>
          {label}
        </p>
        <p className={`text-[1.65rem] sm:text-[1.85rem] font-semibold tracking-tight tabular-nums leading-none ${featured ? 'text-white' : 'text-slate-900'}`}>
          {value}
        </p>
        {sub && (
          <p className={`mt-2.5 text-xs leading-snug ${featured ? 'text-white/45' : 'text-slate-400'}`}>
            {sub}
          </p>
        )}
      </div>
    </>
  );

  const className = featured
    ? 'group relative overflow-hidden rounded-2xl p-5 sm:p-6 text-left transition-transform duration-200 hover:-translate-y-0.5'
    : 'group rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 text-left shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(15,23,42,0.07)]';

  const inner = (
    <>
      {featured && (
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(145deg, #0f172a 0%, #1e293b 55%, #334155 100%)',
          }}
        />
      )}
      <div className="relative">{body}</div>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={className}>
        {inner}
      </Link>
    );
  }

  return <div className={className}>{inner}</div>;
}

function SkeletonCard({ featured }: { featured?: boolean }) {
  return (
    <div
      className={`rounded-2xl p-5 sm:p-6 animate-pulse ${
        featured ? 'bg-slate-800' : 'border border-slate-200 bg-white'
      }`}
    >
      <div className={`h-11 w-11 rounded-xl ${featured ? 'bg-white/10' : 'bg-slate-100'}`} />
      <div className={`mt-6 h-3 w-1/3 rounded-full ${featured ? 'bg-white/10' : 'bg-slate-100'}`} />
      <div className={`mt-3 h-8 w-1/2 rounded-lg ${featured ? 'bg-white/10' : 'bg-slate-100'}`} />
    </div>
  );
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get<ApiResponse<AdminDashboardData>>('/admin/dashboard', true)
      .then((res) => setData(res.data))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="rounded-2xl border border-rose-100 bg-white px-8 py-10 text-center shadow-sm max-w-sm">
          <p className="text-sm font-medium text-rose-600">{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const firstName = user?.firstName ?? 'Admin';

  if (loading) {
    return (
      <div className="space-y-7">
        <div className="h-32 rounded-2xl bg-slate-200 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} featured={i === 0} />
          ))}
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const highlights: MetricCardProps[] = [
    {
      label: 'Revenue',
      value: formatNaira(data.revenue.total),
      sub: 'All-time platform earnings',
      icon: MoneyReceive01Icon,
      featured: true,
      to: '/admin/verifications',
    },
    {
      label: 'Bookings',
      value: data.bookings.total.toLocaleString(),
      sub: `${data.bookings.pending} pending · ${data.bookings.completed} completed`,
      icon: Bookmark01Icon,
      tone: 'blue',
      to: '/admin/bookings',
    },
    {
      label: 'Users',
      value: data.users.total.toLocaleString(),
      sub: `${data.users.newThisMonth} new this month`,
      icon: UserGroupIcon,
      tone: 'violet',
      to: '/admin/users',
    },
    {
      label: 'Services',
      value: data.services.total.toLocaleString(),
      sub: 'Live listings on the platform',
      icon: Package01Icon,
      tone: 'orange',
      to: '/admin/services',
    },
  ];

  const secondary: MetricCardProps[] = [
    {
      label: 'Plugs',
      value: data.users.providers.toLocaleString(),
      icon: UserIcon,
      tone: 'teal',
      to: '/admin/users',
    },
    {
      label: 'New this month',
      value: data.users.newThisMonth.toLocaleString(),
      icon: UserAdd01Icon,
      tone: 'sky',
      to: '/admin/users',
    },
    {
      label: 'Reviews',
      value: data.reviews.total.toLocaleString(),
      icon: FavouriteIcon,
      tone: 'amber',
      to: '/admin/reviews',
    },
    {
      label: 'Verifications',
      value: data.verifications.total.toLocaleString(),
      sub: `${data.verifications.successful} successful`,
      icon: Certificate01Icon,
      tone: 'blue',
      to: '/admin/verifications',
    },
    {
      label: 'Contacts',
      value: data.contacts.total.toLocaleString(),
      icon: Mail01Icon,
      tone: 'rose',
      to: '/admin/contacts',
    },
    {
      label: 'Waitlist',
      value: data.waitlist.total.toLocaleString(),
      icon: Clock01Icon,
      tone: 'slate',
      to: '/admin/waitlist',
    },
  ];

  return (
    <div className="space-y-7 sm:space-y-8">
      <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white px-5 py-6 sm:px-7 sm:py-7">
        <div className="absolute inset-y-0 right-0 w-1/2 max-w-md opacity-[0.07] pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 80% 20%, #334155 0%, transparent 55%)',
          }}
        />
        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div className="max-w-xl">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400 mb-2">
              Overview
            </p>
            <h2 className="text-2xl sm:text-[1.85rem] font-semibold tracking-tight text-slate-900 leading-tight">
              Welcome back, {firstName}
            </h2>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              Monitor platform health across users, bookings, and revenue from one place.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Link
              to="/admin/bookings"
              className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
            >
              Review bookings
              <HugeiconsIcon icon={ArrowRight01Icon} size={15} strokeWidth={2.2} color="currentColor" />
            </Link>
            <Link
              to="/admin/waitlist"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Waitlist
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-slate-900">Key metrics</h3>
          <p className="text-xs text-slate-400 mt-1">Most important platform numbers</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {highlights.map((card) => (
            <MetricCard key={card.label} {...card} />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-slate-900">More activity</h3>
          <p className="text-xs text-slate-400 mt-1">Jump into any area of the console</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {secondary.map((card) => (
            <MetricCard key={card.label} {...card} />
          ))}
        </div>
      </section>
    </div>
  );
}
