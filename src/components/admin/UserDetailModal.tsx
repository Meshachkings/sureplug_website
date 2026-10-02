import { useEffect, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Cancel01Icon,
  Delete02Icon,
  Package01Icon,
  Bookmark01Icon,
  FavouriteIcon,
  Call02Icon,
  Calendar03Icon,
} from '@hugeicons/core-free-icons';
import { ProviderBadges } from '../VerifiedBadge';
import { isUserVerified } from '../../lib/disputes';
import { api, type ApiResponse, type AdminUserDetail, type UserRole } from '../../lib/adminApi';
import type { AdminUser } from '../../lib/adminApi';
import RoleSelect from './RoleSelect';

type Props = {
  user: AdminUser;
  onClose: () => void;
  onDelete: (user: AdminUser) => void;
  onRoleChange: (userId: string, role: UserRole) => void;
  onToggleBan: (user: AdminUser) => void;
};

const ROLE_LABEL: Record<string, string> = {
  user: 'User',
  seller: 'Seller',
  subadmin: 'Subadmin',
  admin: 'Admin',
};

function MetaRow({
  icon,
  label,
  value,
}: {
  icon: typeof Call02Icon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 px-1 py-2.5">
      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-gray-400">
        <HugeiconsIcon icon={icon} size={16} strokeWidth={1.8} color="currentColor" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium text-gray-400">{label}</p>
        <p className="text-sm font-medium text-gray-900 truncate">{value}</p>
      </div>
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
  const fullName = `${user.firstName} ${user.lastName}`.trim();
  const initials = `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() || '?';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6">
      <div className="absolute inset-0 bg-black/55 backdrop-blur-[6px]" onClick={onClose} aria-hidden="true" />

      <div className="relative z-10 w-full sm:max-w-[420px] bg-white rounded-t-[1.75rem] sm:rounded-[1.75rem] shadow-[0_24px_80px_rgba(0,0,0,0.28)] flex flex-col max-h-[92vh] overflow-hidden">
        {/* Soft top hero */}
        <div className="relative shrink-0">
          <div
            className="h-28 sm:h-32"
            style={{
              background:
                'radial-gradient(ellipse 90% 120% at 50% 0%, #2a5044 0%, transparent 60%), linear-gradient(180deg, #0f1c18 0%, #1a322c 100%)',
            }}
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/80 backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-white"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={2} color="currentColor" />
          </button>

          <div className="absolute left-1/2 top-[4.25rem] sm:top-[4.75rem] -translate-x-1/2">
            <div className="relative">
              {user.avatar?.url ? (
                <img
                  src={user.avatar.url}
                  alt=""
                  className="h-[88px] w-[88px] rounded-full object-cover ring-[3px] ring-white shadow-lg"
                />
              ) : (
                <div className="flex h-[88px] w-[88px] items-center justify-center rounded-full bg-mint text-2xl font-bold text-white ring-[3px] ring-white shadow-lg">
                  {initials}
                </div>
              )}
              {user.isBlocked && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow">
                  Blocked
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto min-h-0 px-5 sm:px-6 pt-14 pb-5">
          <div className="text-center">
            <div className="inline-flex items-center justify-center gap-1.5">
              <h2 className="text-xl font-semibold tracking-tight text-gray-900">{fullName}</h2>
              <ProviderBadges isVerified={isUserVerified(user)} isPremium={user.isPremium} size={18} />
            </div>
            <p className="mt-1 text-sm text-gray-500">{user.email}</p>
            {user.suretag && (
              <p className="mt-0.5 text-xs font-medium text-mint">@{user.suretag}</p>
            )}

            <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5">
              <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-600">
                {ROLE_LABEL[user.role] ?? user.role}
              </span>
              {user.accountType && (
                <span className="inline-flex items-center rounded-full bg-gray-50 px-2.5 py-1 text-[11px] font-medium capitalize text-gray-500">
                  {user.accountType}
                </span>
              )}
              {user.verified && (
                <span className="inline-flex items-center rounded-full bg-mint/10 px-2.5 py-1 text-[11px] font-semibold text-mint">
                  Email verified
                </span>
              )}
              {user.isPremium && (
                <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700">
                  Premium
                </span>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-5 rounded-2xl border border-gray-100 bg-gray-50/70 p-1">
            {loading ? (
              <div className="grid grid-cols-3 gap-1">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-[72px] rounded-xl bg-white/70 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1">
                {[
                  { icon: Package01Icon, label: 'Services', value: stats?.serviceCount ?? 0 },
                  { icon: Bookmark01Icon, label: 'Bookings', value: stats?.bookingCount ?? 0 },
                  { icon: FavouriteIcon, label: 'Reviews', value: stats?.reviewCount ?? 0 },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col items-center justify-center gap-1 rounded-xl bg-white px-2 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
                  >
                    <HugeiconsIcon icon={item.icon} size={15} strokeWidth={1.8} color="#9ca3af" />
                    <p className="text-lg font-semibold tabular-nums leading-none text-gray-900">{item.value}</p>
                    <p className="text-[10px] font-medium uppercase tracking-[0.08em] text-gray-400">{item.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Meta */}
          <div className="mt-4 divide-y divide-gray-100">
            {user.phone && <MetaRow icon={Call02Icon} label="Phone" value={user.phone} />}
            <MetaRow
              icon={Calendar03Icon}
              label="Joined"
              value={new Date(user.createdAt).toLocaleDateString('en-NG', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-gray-100 bg-white/95 px-5 sm:px-6 py-4 backdrop-blur-sm">
          <div className="grid grid-cols-[1fr_auto] gap-2.5">
            <RoleSelect
              value={user.role}
              onChange={(role) => onRoleChange(user._id, role)}
              className="w-full"
            />
            <button
              type="button"
              onClick={() => onToggleBan(user)}
              className={`min-w-[96px] rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                user.isBlocked
                  ? 'bg-mint/10 text-mint hover:bg-mint/15'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
              }`}
            >
              {user.isBlocked ? 'Unblock' : 'Block'}
            </button>
          </div>
          <div className="mt-2.5 grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onDelete(user);
                onClose();
              }}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600"
            >
              <HugeiconsIcon icon={Delete02Icon} size={14} strokeWidth={2} color="currentColor" />
              Delete
            </button>
          </div>
        </div>

        <div className="h-[env(safe-area-inset-bottom)] bg-white sm:hidden shrink-0" />
      </div>
    </div>
  );
}
