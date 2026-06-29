import { useEffect, useState } from 'react';
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
} from '@hugeicons/core-free-icons';
import { api, type ApiResponse } from '../../lib/adminApi';
import type { AdminDashboardData } from '../../lib/adminApi';
import { formatNaira } from '../../lib/format';

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: IconSvgElement;
  color: string;
}

function StatCard({ label, value, sub, icon, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-3.5 sm:p-5 flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 hover:shadow-md hover:shadow-gray-100 transition-shadow duration-200">
      <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <HugeiconsIcon icon={icon} size={16} strokeWidth={1.75} color="white" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] sm:text-[11px] text-gray-400 font-semibold uppercase tracking-[0.1em] mb-1 sm:mb-1.5 leading-none">{label}</p>
        <p className="text-xl sm:text-[1.6rem] font-bold text-gray-900 leading-none tabular-nums">{value}</p>
        {sub && <p className="text-[10px] sm:text-[11px] text-gray-400 mt-1 sm:mt-1.5 leading-snug">{sub}</p>}
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-3.5 sm:p-5 flex items-start gap-3 sm:gap-4 animate-pulse">
      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gray-100 flex-shrink-0" />
      <div className="flex-1 space-y-2 pt-0.5">
        <div className="h-2 bg-gray-100 rounded-full w-2/5" />
        <div className="h-5 sm:h-7 bg-gray-100 rounded-lg w-1/3" />
      </div>
    </div>
  );
}

export default function AdminDashboard() {
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
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 text-sm text-mint hover:text-mint-dark font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {Array.from({ length: 11 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!data) return null;

  const cards: StatCardProps[] = [
    {
      label: 'Total Users',
      value: data.users.total.toLocaleString(),
      icon: UserGroupIcon,
      color: 'bg-blue-500',
    },
    {
      label: 'Plugs',
      value: data.users.providers.toLocaleString(),
      icon: UserIcon,
      color: 'bg-purple-500',
    },
    {
      label: 'New This Month',
      value: data.users.newThisMonth.toLocaleString(),
      icon: UserAdd01Icon,
      color: 'bg-indigo-500',
    },
    {
      label: 'Total Services',
      value: data.services.total.toLocaleString(),
      icon: Package01Icon,
      color: 'bg-orange-500',
    },
    {
      label: 'Total Bookings',
      value: data.bookings.total.toLocaleString(),
      sub: `${data.bookings.pending} pending · ${data.bookings.completed} completed`,
      icon: Bookmark01Icon,
      color: 'bg-mint',
    },
    {
      label: 'Revenue',
      value: formatNaira(data.revenue.total),
      icon: MoneyReceive01Icon,
      color: 'bg-emerald-600',
    },
    {
      label: 'Reviews',
      value: data.reviews.total.toLocaleString(),
      icon: FavouriteIcon,
      color: 'bg-yellow-500',
    },
    {
      label: 'Verifications',
      value: data.verifications.total.toLocaleString(),
      sub: `${data.verifications.successful} successful`,
      icon: Certificate01Icon,
      color: 'bg-teal-500',
    },
    {
      label: 'Contacts',
      value: data.contacts.total.toLocaleString(),
      icon: Mail01Icon,
      color: 'bg-pink-500',
    },
    {
      label: 'Waitlist',
      value: data.waitlist.total.toLocaleString(),
      icon: Clock01Icon,
      color: 'bg-gray-500',
    },
  ];

  return (
    <div>
      <div className="mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 tracking-tight">Overview</h2>
        <p className="text-xs sm:text-sm text-gray-400 mt-0.5">Platform activity at a glance</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4">
        {cards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>
    </div>
  );
}
