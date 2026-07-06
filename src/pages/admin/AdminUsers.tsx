import { useCallback, useEffect, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Delete02Icon, UserIcon, Search01Icon, FilterIcon } from '@hugeicons/core-free-icons';
import { api, type ApiResponse, type ApiPagination, type AdminUserStats } from '../../lib/adminApi';
import type { AdminUser, UserRole } from '../../lib/adminApi';
import { ProviderBadges } from '../../components/VerifiedBadge';
import { isUserVerified } from '../../lib/disputes';
import Pagination from '../../components/admin/Pagination';
import UserDetailModal from '../../components/admin/UserDetailModal';
import RoleSelect from '../../components/admin/RoleSelect';
import ConfirmModal from '../../components/admin/ConfirmModal';

interface UsersResponse {
  users: AdminUser[];
  pagination: ApiPagination;
}

const ROLES: Array<{ label: string; value: string }> = [
  { label: 'All roles', value: '' },
  { label: 'User', value: 'user' },
  { label: 'Seller', value: 'seller' },
  { label: 'Subadmin', value: 'subadmin' },
  { label: 'Admin', value: 'admin' },
];

const ACCOUNT_TYPES: Array<{ label: string; value: string }> = [
  { label: 'All types', value: '' },
  { label: 'Customer', value: 'customer' },
  { label: 'Handyman', value: 'handyman' },
  { label: 'Business', value: 'business' },
];

const ROLE_STYLES: Record<string, string> = {
  admin:    'bg-gray-900 text-white',
  subadmin: 'bg-violet-100 text-violet-700',
  seller:   'bg-blue-50 text-blue-700',
  user:     'bg-gray-100 text-gray-600',
};

const ACCOUNT_STYLES: Record<string, string> = {
  handyman: 'bg-teal-50 text-teal-700',
  business: 'bg-amber-50 text-amber-700',
  customer: 'bg-gray-100 text-gray-500',
};

const AVATAR_COLORS = ['#019B5F', '#3b82f6', '#8b5cf6', '#f59e0b', '#06b6d4', '#ec4899'];
function avatarBg(name: string) {
  return AVATAR_COLORS[(name.charCodeAt(0) + (name.charCodeAt(1) ?? 0)) % AVATAR_COLORS.length];
}

function Avatar({ user, size = 9 }: { user: AdminUser; size?: number }) {
  const cls = `w-${size} h-${size} rounded-full object-cover flex-shrink-0`;
  if (user.avatar?.url) return <img src={user.avatar.url} alt="" className={cls} />;
  return (
    <div
      className={`w-${size} h-${size} rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0`}
      style={{ backgroundColor: avatarBg(user.firstName), fontSize: size < 9 ? 11 : 13 }}
    >
      {user.firstName[0]}{user.lastName[0]}
    </div>
  );
}

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [pagination, setPagination] = useState<ApiPagination | null>(null);
  const [overview, setOverview] = useState<AdminUserStats | null>(null);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [role, setRole] = useState('');
  const [accountType, setAccountType] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [confirm, setConfirm] = useState<{
    title: string; message: string; confirmLabel: string;
    variant?: 'danger' | 'warning' | 'error'; onConfirm: () => void;
  } | null>(null);

  // Fetch overview stats once on mount
  useEffect(() => {
    api.get<ApiResponse<AdminUserStats>>('/admin/users/overview', true)
      .then((res) => setOverview(res.data))
      .catch(() => {/* silently ignore — overview is supplemental */});
  }, []);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(search); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (role) params.set('role', role);
      if (accountType) params.set('accountType', accountType);
      const res = await api.get<ApiResponse<UsersResponse>>(`/admin/users?${params}`, true);
      setUsers(res.data.users);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, role, accountType]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const showError = (msg: string) =>
    setConfirm({ title: 'Something went wrong', message: msg, confirmLabel: 'OK', variant: 'error', onConfirm: () => setConfirm(null) });

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      await api.patch(`/admin/users/${userId}/role`, { role: newRole }, true);
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
    } catch (err) { showError(err instanceof Error ? err.message : 'Failed to update role'); }
  };

  const handleToggleBan = (user: AdminUser) => {
    const action = user.isBlocked ? 'Unblock' : 'Block';
    setConfirm({
      title: `${action} user`,
      message: `Are you sure you want to ${action.toLowerCase()} ${user.firstName} ${user.lastName}?`,
      confirmLabel: action, variant: 'warning',
      onConfirm: async () => {
        setConfirm(null);
        try {
          await api.patch(`/admin/users/${user._id}/ban`, { isBlocked: !user.isBlocked }, true);
          setUsers(prev => prev.map(u => u._id === user._id ? { ...u, isBlocked: !u.isBlocked } : u));
        } catch (err) { showError(err instanceof Error ? err.message : 'Failed to update user'); }
      },
    });
  };

  const handleDelete = (user: AdminUser) => {
    setConfirm({
      title: 'Delete user',
      message: `Permanently delete ${user.firstName} ${user.lastName}? This cannot be undone.`,
      confirmLabel: 'Delete', variant: 'danger',
      onConfirm: async () => {
        setConfirm(null);
        try {
          await api.delete(`/admin/users/${user._id}`, true);
          setUsers(prev => prev.filter(u => u._id !== user._id));
        } catch (err) { showError(err instanceof Error ? err.message : 'Failed to delete user'); }
      },
    });
  };

  return (
    <div className="space-y-5">
      {confirm && (
        <ConfirmModal
          title={confirm.title} message={confirm.message}
          confirmLabel={confirm.confirmLabel}
          cancelLabel={confirm.variant === 'error' ? false : 'Cancel'}
          variant={confirm.variant}
          onConfirm={confirm.onConfirm} onCancel={() => setConfirm(null)}
        />
      )}
      {selectedUser && (
        <UserDetailModal
          user={selectedUser} onClose={() => setSelectedUser(null)}
          onDelete={(u) => { setSelectedUser(null); handleDelete(u); }}
          onRoleChange={(uid, r) => { handleRoleChange(uid, r); setSelectedUser(p => p ? { ...p, role: r } : p); }}
          onToggleBan={(u) => { handleToggleBan(u); setSelectedUser(null); }}
        />
      )}

      {/* Header */}
      <div>
        <h1 className="text-[17px] font-semibold text-gray-900">Users</h1>
        <p className="text-xs text-gray-400 mt-0.5">
          {overview ? overview.total.toLocaleString() : pagination ? pagination.total.toLocaleString() : '—'} total accounts
        </p>
      </div>

      {/* Overview stats */}
      {overview && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Account types */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-4 py-2.5 border-b border-gray-50">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">Account Types</p>
            </div>
            <div className="grid grid-cols-3 divide-x divide-gray-50">
              <div className="px-4 py-3">
                <p className="text-[10px] font-semibold text-gray-400 mb-1">Customer</p>
                <p className="text-lg font-bold text-gray-900 tabular-nums">{(overview.byAccountType?.customer ?? 0).toLocaleString()}</p>
              </div>
              <div className="px-4 py-3">
                <p className="text-[10px] font-semibold text-teal-500 mb-1">Handyman</p>
                <p className="text-lg font-bold text-gray-900 tabular-nums">{(overview.byAccountType?.handyman ?? 0).toLocaleString()}</p>
              </div>
              <div className="px-4 py-3">
                <p className="text-[10px] font-semibold text-amber-500 mb-1">Business</p>
                <p className="text-lg font-bold text-gray-900 tabular-nums">{(overview.byAccountType?.business ?? 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
          {/* Roles */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-4 py-2.5 border-b border-gray-50">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">Roles</p>
            </div>
            <div className="grid grid-cols-4 divide-x divide-gray-50">
              <div className="px-3 py-3">
                <p className="text-[10px] font-semibold text-gray-400 mb-1">User</p>
                <p className="text-lg font-bold text-gray-900 tabular-nums">{(overview.byRole?.user ?? 0).toLocaleString()}</p>
              </div>
              <div className="px-3 py-3">
                <p className="text-[10px] font-semibold text-blue-500 mb-1">Seller</p>
                <p className="text-lg font-bold text-gray-900 tabular-nums">{(overview.byRole?.seller ?? 0).toLocaleString()}</p>
              </div>
              <div className="px-3 py-3">
                <p className="text-[10px] font-semibold text-violet-500 mb-1">Subadmin</p>
                <p className="text-lg font-bold text-gray-900 tabular-nums">{(overview.byRole?.subadmin ?? 0).toLocaleString()}</p>
              </div>
              <div className="px-3 py-3">
                <p className="text-[10px] font-semibold text-purple-600 mb-1">Admin</p>
                <p className="text-lg font-bold text-gray-900 tabular-nums">{(overview.byRole?.admin ?? 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <div className="relative flex-1">
          <HugeiconsIcon icon={Search01Icon} size={14} color="#9ca3af" strokeWidth={2} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search name, email or suretag..."
            className="w-full pl-8 pr-3 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#019B5F]/20 focus:border-[#019B5F]/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={FilterIcon} size={14} color="#9ca3af" strokeWidth={2} className="shrink-0" />
          <select
            value={role}
            onChange={e => { setRole(e.target.value); setPage(1); }}
            className="flex-1 sm:flex-none text-sm bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#019B5F]/20 text-gray-700"
          >
            {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
          <select
            value={accountType}
            onChange={e => { setAccountType(e.target.value); setPage(1); }}
            className="flex-1 sm:flex-none text-sm bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#019B5F]/20 text-gray-700"
          >
            {ACCOUNT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-50">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="px-5 py-4 flex items-center gap-4 animate-pulse">
              <div className="w-9 h-9 rounded-full bg-gray-100 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-100 rounded w-1/4" />
                <div className="h-3 bg-gray-50 rounded w-1/3" />
              </div>
              <div className="h-5 bg-gray-100 rounded w-16" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl border border-red-100 p-8 text-center text-sm text-red-500">{error}</div>
      ) : users.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-3">
            <HugeiconsIcon icon={UserIcon} size={22} color="#d1d5db" strokeWidth={1.5} />
          </div>
          <p className="text-sm font-medium text-gray-400">No users found</p>
          <p className="text-xs text-gray-300 mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <>
          {/* Mobile cards */}
          <div className="md:hidden space-y-2.5">
            {users.map(user => (
              <div
                key={user._id}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
              >
                {/* Tappable info area */}
                <div
                  className="flex items-center gap-3 px-4 pt-4 pb-3 cursor-pointer active:bg-gray-50 transition-colors"
                  onClick={() => setSelectedUser(user)}
                >
                  <Avatar user={user} size={10} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {user.firstName} {user.lastName}
                      </p>
                      <ProviderBadges
                        isVerified={isUserVerified(user)}
                        isPremium={user.isPremium}
                        size={13}
                      />
                      {user.isBlocked && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-100 text-red-600 uppercase tracking-wide shrink-0">
                          Blocked
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    <div className="flex items-center gap-2.5 mt-0.5 flex-wrap">
                      {user.suretag && (
                        <span className="text-[11px] text-gray-400 font-mono">@{user.suretag}</span>
                      )}
                      {user.phone && (
                        <span className="text-[11px] text-gray-500">{user.phone}</span>
                      )}
                    </div>
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-1.5">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide ${ROLE_STYLES[user.role] ?? 'bg-gray-100 text-gray-600'}`}>
                      {user.role}
                    </span>
                    {user.accountType && (
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${ACCOUNT_STYLES[user.accountType] ?? 'bg-gray-100 text-gray-500'}`}>
                        {user.accountType}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions row */}
                <div
                  className="flex items-center gap-2 px-4 pb-3 pt-0"
                  onClick={e => e.stopPropagation()}
                >
                  <RoleSelect value={user.role} onChange={r => handleRoleChange(user._id, r)} size="sm" />
                  <div className="flex-1" />
                  <span className="text-[11px] text-gray-300">
                    {new Date(user.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <button
                    onClick={() => handleToggleBan(user)}
                    className={`px-3 py-1.5 text-xs rounded-lg font-semibold transition-colors shrink-0 ${user.isBlocked ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}
                  >
                    {user.isBlocked ? 'Unblock' : 'Block'}
                  </button>
                  <button
                    onClick={() => handleDelete(user)}
                    className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors shrink-0"
                  >
                    <HugeiconsIcon icon={Delete02Icon} size={15} strokeWidth={1.75} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-5 py-3.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide">User</th>
                    <th className="px-4 py-3.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Role / Type</th>
                    <th className="px-4 py-3.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Badges</th>
                    <th className="px-4 py-3.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Phone</th>
                    <th className="px-4 py-3.5 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Joined</th>
                    <th className="px-5 py-3.5 text-right text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map(user => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-50/60 transition-colors cursor-pointer"
                      onClick={() => setSelectedUser(user)}
                    >
                      {/* User cell */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar user={user} size={9} />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="text-sm font-semibold text-gray-900 truncate max-w-[160px]">
                                {user.firstName} {user.lastName}
                              </p>
                              {user.isBlocked && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-50 text-red-500 uppercase tracking-wide shrink-0">Blocked</span>
                              )}
                            </div>
                            <p className="text-xs text-gray-400 truncate max-w-[200px]">{user.email}</p>
                            {user.suretag && (
                              <p className="text-[11px] text-gray-400 font-mono">@{user.suretag}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Role / Type */}
                      <td className="px-4 py-3.5">
                        <div className="flex flex-col gap-1">
                          <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide w-fit ${ROLE_STYLES[user.role] ?? 'bg-gray-100 text-gray-600'}`}>
                            {user.role}
                          </span>
                          {user.accountType && (
                            <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-semibold w-fit ${ACCOUNT_STYLES[user.accountType] ?? 'bg-gray-100 text-gray-500'}`}>
                              {user.accountType}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Badges */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          {user.verified ? (
                            <span title="Email verified" className="w-2 h-2 rounded-full bg-[#019B5F] shrink-0" />
                          ) : (
                            <span title="Email not verified" className="w-2 h-2 rounded-full bg-gray-200 shrink-0" />
                          )}
                          <ProviderBadges
                            isVerified={isUserVerified(user)}
                            isPremium={user.isPremium}
                            size={16}
                          />
                          {!isUserVerified(user) && !user.isPremium && (
                            <span className="text-[11px] text-gray-300">—</span>
                          )}
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="px-4 py-3.5">
                        <p className="text-xs text-gray-600 whitespace-nowrap">{user.phone ?? <span className="text-gray-300">—</span>}</p>
                      </td>

                      {/* Joined */}
                      <td className="px-4 py-3.5">
                        <p className="text-xs text-gray-500 whitespace-nowrap">
                          {new Date(user.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <RoleSelect value={user.role} onChange={r => handleRoleChange(user._id, r)} size="sm" />
                          <button
                            onClick={() => handleToggleBan(user)}
                            className={`px-2.5 py-1.5 text-[11px] font-semibold rounded-lg transition-colors whitespace-nowrap ${user.isBlocked ? 'bg-green-50 text-green-700 hover:bg-green-100' : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'}`}
                          >
                            {user.isBlocked ? 'Unblock' : 'Block'}
                          </button>
                          <button
                            onClick={() => handleDelete(user)}
                            className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                            title="Delete user"
                          >
                            <HugeiconsIcon icon={Delete02Icon} size={14} strokeWidth={1.75} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {pagination && <Pagination pagination={pagination} onPageChange={setPage} />}
          </div>

          {/* Mobile pagination */}
          <div className="md:hidden">
            {pagination && (
              <div className="bg-white rounded-2xl border border-gray-100">
                <Pagination pagination={pagination} onPageChange={setPage} />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
