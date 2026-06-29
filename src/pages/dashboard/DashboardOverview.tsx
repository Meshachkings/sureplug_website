import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  CheckmarkCircle01Icon,
  Certificate01Icon,
  Package01Icon,
  StarIcon,
  UserIcon,
  ArrowRight01Icon,
  SmartPhone01Icon,
} from '@hugeicons/core-free-icons';
import { useAuth } from '../../context/AuthContext';
import { api, type ApiResponse, type ApiProviderProfile } from '../../lib/api';
import { VerifiedPill, BusinessPill } from '../../components/VerifiedBadge';

const AVATAR_PLACEHOLDER = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=019B5F&color=fff&size=128`;

function StatCard({ label, value, icon }: { label: string; value: string | number; icon: typeof StarIcon }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</p>
        <div className="w-8 h-8 rounded-xl bg-[#019B5F]/8 flex items-center justify-center">
          <HugeiconsIcon icon={icon} size={15} color="#019B5F" strokeWidth={2} />
        </div>
      </div>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}

export default function DashboardOverview() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ApiProviderProfile | null>(null);

  const isSeller = user?.role === 'seller';
  const displayName = user ? `${user.firstName} ${user.lastName}`.trim() : '';
  const avatarSrc = user?.avatar?.url ?? AVATAR_PLACEHOLDER(displayName);

  useEffect(() => {
    if (!isSeller || !user?.suretag) return;
    api.get<ApiResponse<ApiProviderProfile>>(`/users/provider/${user.suretag}`)
      .then((res) => setProfile(res.data))
      .catch(() => {/* silently ignore */});
  }, [isSeller, user?.suretag]);

  const accountTypeLabel: Record<string, string> = {
    customer: 'Customer',
    handyman: 'Handyman',
    business: 'Business',
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Profile card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-start gap-5">
        <img
          src={avatarSrc}
          alt={displayName}
          className="w-16 h-16 rounded-full object-cover border border-gray-200 shrink-0"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="text-lg font-semibold text-gray-900">{displayName}</h1>
            {user?.providerVerified && <VerifiedPill />}
            {user?.businessVerified && <BusinessPill />}
          </div>
          <p className="text-sm text-gray-500">{user?.email}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {user?.accountType && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                {accountTypeLabel[user.accountType] ?? user.accountType}
              </span>
            )}
            {user?.role && (
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                isSeller ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-600'
              }`}>
                {isSeller ? 'Plug' : 'User'}
              </span>
            )}
            {user?.suretag && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500 font-mono">
                @{user.suretag}
              </span>
            )}
          </div>
          {user?.bio && (
            <p className="mt-2 text-sm text-gray-500 leading-relaxed">{user.bio}</p>
          )}
        </div>
        <Link
          to="/dashboard/profile"
          className="shrink-0 px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-1.5"
        >
          <HugeiconsIcon icon={UserIcon} size={12} color="currentColor" strokeWidth={2} />
          Edit
        </Link>
      </div>

      {/* Stats - sellers only */}
      {isSeller && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Services" value={profile?.stats.serviceCount ?? 0} icon={Package01Icon} />
          <StatCard label="Orders" value={profile?.stats.orderCount ?? 0} icon={CheckmarkCircle01Icon} />
          <StatCard label="Reviews" value={profile?.stats.reviewCount ?? 0} icon={StarIcon} />
          <StatCard label="Avg. Rating" value={profile?.stats.averageRating ? profile.stats.averageRating.toFixed(1) : '0.0'} icon={Certificate01Icon} />
        </div>
      )}

      {/* Become a plug CTA */}
      {!isSeller && (
        <div className="bg-gradient-to-br from-[#019B5F]/8 to-[#019B5F]/4 rounded-2xl border border-[#019B5F]/15 p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#019B5F]/12 flex items-center justify-center shrink-0">
              <HugeiconsIcon icon={Package01Icon} size={18} color="#019B5F" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 mb-1">Start offering services</p>
              <p className="text-sm text-gray-500 leading-relaxed">
                Upgrade to a plug account to list your services, receive bookings, and earn on your schedule.
              </p>
              <Link
                to="/become-a-provider"
                className="inline-flex items-center gap-1.5 mt-3 text-sm font-semibold text-[#019B5F] hover:text-[#017a4c] transition-colors"
              >
                Become a plug
                <HugeiconsIcon icon={ArrowRight01Icon} size={14} color="currentColor" strokeWidth={2.5} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Mobile app banner */}
      <div className="relative overflow-hidden rounded-2xl bg-[#0a1810]">
        <div className="absolute -right-10 -top-10 w-52 h-52 rounded-full bg-[#019B5F]/12 pointer-events-none" />
        <div className="absolute right-8 -bottom-14 w-40 h-40 rounded-full bg-[#019B5F]/8 pointer-events-none" />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-[0.07] pointer-events-none hidden sm:block">
          <HugeiconsIcon icon={SmartPhone01Icon} size={110} color="white" strokeWidth={0.75} />
        </div>
        <div className="relative px-6 py-7">
          <div className="flex items-start gap-5 max-w-md">
            <div className="w-12 h-12 rounded-2xl bg-[#019B5F]/20 ring-1 ring-[#019B5F]/30 flex items-center justify-center shrink-0 mt-0.5">
              <HugeiconsIcon icon={SmartPhone01Icon} size={22} color="#4ade80" strokeWidth={1.75} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-bold text-white tracking-tight">Get the SurePlug app</p>
              <p className="text-sm text-white/50 leading-relaxed mt-1">
                Book plugs, manage orders and get real-time updates from your phone.
              </p>
              <div className="flex flex-wrap gap-2.5 mt-4">
                <a
                  href="#"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-[#0a1810] text-xs font-bold hover:bg-white/90 transition-colors shadow-sm"
                >
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  App Store
                </a>
                <a
                  href="#"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-bold hover:bg-white/15 transition-colors border border-white/15"
                >
                  <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M3.18 23.76c.35.2.76.19 1.12-.03L16.64 17l-3.16-3.16-10.3 9.92zm-1.1-19.8a1.6 1.6 0 0 0-.08.52v18.98c0 .18.03.35.08.52l.06.05 10.64-10.64v-.25L2.14 3.91l-.06.05zM20.49 10.7l-2.93-1.67-3.47 3.47 3.47 3.47 2.95-1.68c.84-.48.84-1.26-.02-1.59zM4.3.27 16.64 7l-3.16 3.16L3.18.48C3.54.26 3.95.27 4.3.48z"/>
                  </svg>
                  Google Play
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link
          to="/dashboard/profile"
          className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 hover:border-gray-200 hover:shadow-sm transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-[#019B5F]/8 transition-colors shrink-0">
            <HugeiconsIcon icon={UserIcon} size={18} color="#6b7280" strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900">Edit Profile</p>
            <p className="text-xs text-gray-400 mt-0.5">Update your info and avatar</p>
          </div>
          <HugeiconsIcon icon={ArrowRight01Icon} size={16} color="#d1d5db" strokeWidth={2} className="ml-auto shrink-0" />
        </Link>

        {isSeller && (
          <Link
            to="/dashboard/services"
            className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4 hover:border-gray-200 hover:shadow-sm transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-[#019B5F]/8 transition-colors shrink-0">
              <HugeiconsIcon icon={Package01Icon} size={18} color="#6b7280" strokeWidth={2} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900">My Services</p>
              <p className="text-xs text-gray-400 mt-0.5">Manage your listings</p>
            </div>
            <HugeiconsIcon icon={ArrowRight01Icon} size={16} color="#d1d5db" strokeWidth={2} className="ml-auto shrink-0" />
          </Link>
        )}
      </div>
    </div>
  );
}
