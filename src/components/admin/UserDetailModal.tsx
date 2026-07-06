import { useEffect, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Cancel01Icon,
  Delete02Icon,
  Package01Icon,
  Bookmark01Icon,
  FavouriteIcon,
} from '@hugeicons/core-free-icons';
import { ProviderBadges } from '../VerifiedBadge';
import { isUserVerified } from '../../lib/disputes';
import { api, type ApiResponse, type AdminUserDetail, type UserRole } from '../../lib/adminApi';
import type { AdminUser } from '../../lib/adminApi';
import StatusBadge from './StatusBadge';
import RoleSelect from './RoleSelect';

type Props = {
  user: AdminUser;
  onClose: () => void;
  onDelete: (user: AdminUser) => void;
  onRoleChange: (userId: string, role: UserRole) => void;
  onToggleBan: (user: AdminUser) => void;
};

function StatPill({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="flex-1 flex flex-col items-center gap-1 bg-gray-50 rounded-xl py-3 px-2">
      <div className="text-gray-400">{icon}</div>
      <p className="text-base font-bold text-gray-900 tabular-nums">{value}</p>
      <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-gray-400">{label}</p>
    </div>
  );
}

export default function UserDetailModal({ user, onClose, onDelete, onRoleChange, onToggleBan }: Props) {
  const [detail, setDetail] = useState<AdminUserDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  useEffect(() => {
    api
      .get<ApiResponse<AdminUserDetail>>(`/admin/users/${user._id}`, true)
      .then((res) => setDetail(res.data))
      .catch(() => setDetail(null))
      .finally(() => setLoading(false));
  }, [user._id]);

  const stats = detail?.stats;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      <div className="relative z-10 w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden">
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between px-5 sm:px-6 pt-4 sm:pt-5 pb-4 border-b border-gray-100">
          <div className="min-w-0 pr-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400 mb-1">User Details</p>
            <h2 className="text-base font-semibold text-gray-900 leading-snug">
              {user.firstName} {user.lastName}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors shrink-0"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={2} color="currentColor" />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 sm:px-6 py-4 max-h-[60vh] overflow-y-auto space-y-4">
          {/* Avatar + name */}
          <div className="flex items-center gap-4">
            {user.avatar?.url ? (
              <img src={user.avatar.url} alt="" className="w-14 h-14 rounded-full object-cover shrink-0" />
            ) : (
              <div className="w-14 h-14 rounded-full bg-[#019B5F]/10 flex items-center justify-center text-[#019B5F] text-lg font-bold shrink-0">
                {user.firstName[0]}{user.lastName[0]}
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <p className="text-base font-semibold text-gray-900">
                  {user.firstName} {user.lastName}
                </p>
                <ProviderBadges isVerified={isUserVerified(user)} isPremium={user.isPremium} size={17} />
              </div>
              <p className="text-sm text-gray-400 truncate">{user.email}</p>
              {user.suretag && (
                <p className="text-xs text-gray-400 mt-0.5">@{user.suretag}</p>
              )}
            </div>
          </div>

          {/* Status badges */}
          <div className="flex flex-wrap gap-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
              user.role === 'seller' ? 'bg-blue-100 text-blue-700' :
              'bg-gray-100 text-gray-600'
            }`}>
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </span>
            {user.verified && <StatusBadge status="email_verified" />}
            {isUserVerified(user) && <StatusBadge status="verified" />}
            {user.isPremium && <StatusBadge status="premium" />}
            {user.isBlocked && <StatusBadge status="blocked" />}
          </div>

          {/* Stats row */}
          {loading ? (
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex-1 h-16 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : stats ? (
            <div className="flex gap-2">
              <StatPill
                icon={<HugeiconsIcon icon={Package01Icon} size={15} strokeWidth={1.75} />}
                label="Services"
                value={stats.serviceCount}
              />
              <StatPill
                icon={<HugeiconsIcon icon={Bookmark01Icon} size={15} strokeWidth={1.75} />}
                label="Bookings"
                value={stats.bookingCount}
              />
              <StatPill
                icon={<HugeiconsIcon icon={FavouriteIcon} size={15} strokeWidth={1.75} />}
                label="Reviews"
                value={stats.reviewCount}
              />
            </div>
          ) : null}

          {/* Info rows */}
          <div className="divide-y divide-gray-100 rounded-xl border border-gray-100 overflow-hidden">
            {user.phone && (
              <div className="flex items-center justify-between px-3 py-2.5 bg-white">
                <span className="text-xs font-semibold uppercase tracking-[0.1em] text-gray-400">Phone</span>
                <span className="text-sm text-gray-900">{user.phone}</span>
              </div>
            )}
            <div className="flex items-center justify-between px-3 py-2.5 bg-white">
              <span className="text-xs font-semibold uppercase tracking-[0.1em] text-gray-400">Joined</span>
              <span className="text-sm text-gray-900">
                {new Date(user.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-4 border-t border-gray-100 space-y-2.5">
          <div className="flex gap-2">
            <RoleSelect
              value={user.role}
              onChange={(role) => onRoleChange(user._id, role)}
            />
            <button
              onClick={() => onToggleBan(user)}
              className={`flex-1 px-3 py-2.5 text-sm rounded-xl font-medium transition-colors ${
                user.isBlocked
                  ? 'bg-green-50 text-green-700 hover:bg-green-100'
                  : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
              }`}
            >
              {user.isBlocked ? 'Unblock' : 'Block'}
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => { onDelete(user); onClose(); }}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition-colors"
            >
              <HugeiconsIcon icon={Delete02Icon} size={14} strokeWidth={2} color="currentColor" />
              Delete
            </button>
          </div>
        </div>

        <div className="h-[env(safe-area-inset-bottom)] bg-white sm:hidden" />
      </div>
    </div>
  );
}
