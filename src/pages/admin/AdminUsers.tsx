import { useCallback, useEffect, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Delete02Icon } from '@hugeicons/core-free-icons';
import { api, type ApiResponse, type ApiPagination } from '../../lib/adminApi';
import type { AdminUser, UserRole } from '../../lib/adminApi';
import StatusBadge from '../../components/admin/StatusBadge';
import Pagination from '../../components/admin/Pagination';
import UserDetailModal from '../../components/admin/UserDetailModal';
import RoleSelect from '../../components/admin/RoleSelect';
import AdminFilterBar, { FilterSelect } from '../../components/admin/AdminFilterBar';
import ConfirmModal from '../../components/admin/ConfirmModal';

interface UsersResponse {
  users: AdminUser[];
  pagination: ApiPagination;
}

const ROLES: Array<{ label: string; value: string }> = [
  { label: 'All roles', value: '' },
  { label: 'User', value: 'user' },
  { label: 'Seller', value: 'seller' },
  { label: 'Admin', value: 'admin' },
];

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [pagination, setPagination] = useState<ApiPagination | null>(null);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [confirm, setConfirm] = useState<{
    title: string;
    message: string;
    confirmLabel: string;
    variant?: 'danger' | 'warning' | 'error';
    onConfirm: () => void;
  } | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (search) params.set('search', search);
      if (role) params.set('role', role);
      const res = await api.get<ApiResponse<UsersResponse>>(
        `/admin/users?${params.toString()}`,
        true
      );
      setUsers(res.data.users);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [page, search, role]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const showError = (msg: string) =>
    setConfirm({ title: 'Something went wrong', message: msg, confirmLabel: 'OK', variant: 'error', onConfirm: () => setConfirm(null) });

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    try {
      await api.patch(`/admin/users/${userId}/role`, { role: newRole }, true);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to update role');
    }
  };

  const handleToggleBan = (user: AdminUser) => {
    const action = user.isBlocked ? 'Unblock' : 'Block';
    setConfirm({
      title: `${action} user`,
      message: `Are you sure you want to ${action.toLowerCase()} ${user.firstName} ${user.lastName}?`,
      confirmLabel: action,
      variant: user.isBlocked ? 'warning' : 'warning',
      onConfirm: async () => {
        setConfirm(null);
        try {
          await api.patch(`/admin/users/${user._id}/ban`, { isBlocked: !user.isBlocked }, true);
          setUsers((prev) =>
            prev.map((u) => (u._id === user._id ? { ...u, isBlocked: !u.isBlocked } : u))
          );
        } catch (err) {
          showError(err instanceof Error ? err.message : 'Failed to update user');
        }
      },
    });
  };

  const handleDelete = (user: AdminUser) => {
    setConfirm({
      title: 'Delete user',
      message: `Permanently delete ${user.firstName} ${user.lastName}? This cannot be undone.`,
      confirmLabel: 'Delete',
      variant: 'danger',
      onConfirm: async () => {
        setConfirm(null);
        try {
          await api.delete(`/admin/users/${user._id}`, true);
          setUsers((prev) => prev.filter((u) => u._id !== user._id));
        } catch (err) {
          showError(err instanceof Error ? err.message : 'Failed to delete user');
        }
      },
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  return (
    <div>
      {confirm && (
        <ConfirmModal
          title={confirm.title}
          message={confirm.message}
          confirmLabel={confirm.confirmLabel}
          cancelLabel={confirm.variant === 'error' ? false : 'Cancel'}
          variant={confirm.variant}
          onConfirm={confirm.onConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}
      {selectedUser && (
        <UserDetailModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onDelete={(u) => {
            setSelectedUser(null);
            handleDelete(u);
          }}
          onRoleChange={(userId, newRole) => {
            handleRoleChange(userId, newRole);
            setSelectedUser((prev) => prev ? { ...prev, role: newRole } : prev);
          }}
          onToggleBan={(u) => {
            handleToggleBan(u);
            setSelectedUser(null);
          }}
        />
      )}
      <AdminFilterBar
        search={search}
        onSearchChange={setSearch}
        onSearchSubmit={handleSearch}
        searchPlaceholder="Search name or email..."
      >
        <FilterSelect
          value={role}
          options={ROLES}
          onChange={(v) => { setRole(v); setPage(1); }}
        />
      </AdminFilterBar>

      {/* Loading skeleton */}
      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="px-4 py-3 flex items-center gap-4 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-gray-200" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-200 rounded w-1/3" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center text-red-500">{error}</div>
      ) : users.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center text-gray-400">No users found.</div>
      ) : (
        <>
          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {users.map((user) => (
              <div
                key={user._id}
                className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm cursor-pointer active:bg-gray-50 transition-colors"
                onClick={() => setSelectedUser(user)}
              >
                {/* Avatar + Name row */}
                <div className="flex items-center gap-3 mb-3">
                  {user.avatar?.url ? (
                    <img
                      src={user.avatar.url}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-mint/10 flex items-center justify-center text-mint text-sm font-bold flex-shrink-0">
                      {user.firstName[0]}{user.lastName[0]}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>
                </div>
                {/* Badges row */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {user.verified && <StatusBadge status="verified" />}
                  {user.providerVerified && <StatusBadge status="verified" />}
                  {user.isBlocked && <StatusBadge status="blocked" />}
                  <span className="text-xs text-gray-400">
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {/* Actions row */}
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <RoleSelect
                    value={user.role}
                    onChange={(role) => handleRoleChange(user._id, role)}
                  />
                  <button
                    onClick={() => handleToggleBan(user)}
                    className={`flex-1 px-3 py-2.5 text-sm rounded-xl font-medium transition-colors min-h-[44px] ${
                      user.isBlocked
                        ? 'bg-green-50 text-green-700 hover:bg-green-100'
                        : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                    }`}
                  >
                    {user.isBlocked ? 'Unblock' : 'Block'}
                  </button>
                  <button
                    onClick={() => handleDelete(user)}
                    className="p-2.5 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                    title="Delete user"
                  >
                    <HugeiconsIcon icon={Delete02Icon} size={18} strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-xs uppercase text-gray-500 tracking-wide">
                    <th className="px-4 py-3 text-left">User</th>
                    <th className="px-4 py-3 text-left">Role</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Joined</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedUser(user)}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {user.avatar?.url ? (
                            <img
                              src={user.avatar.url}
                              alt=""
                              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-mint/10 flex items-center justify-center text-mint text-xs font-bold flex-shrink-0">
                              {user.firstName[0]}{user.lastName[0]}
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-xs text-gray-400">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <RoleSelect
                          value={user.role}
                          onChange={(role) => handleRoleChange(user._id, role)}
                          size="sm"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          {user.verified && <StatusBadge status="verified" />}
                          {user.providerVerified && <StatusBadge status="verified" />}
                          {user.isBlocked && <StatusBadge status="blocked" />}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleBan(user)}
                            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                              user.isBlocked
                                ? 'bg-green-50 text-green-700 hover:bg-green-100'
                                : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                            }`}
                          >
                            {user.isBlocked ? 'Unblock' : 'Block'}
                          </button>
                          <button
                            onClick={() => handleDelete(user)}
                            className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                            title="Delete user"
                          >
                            <HugeiconsIcon icon={Delete02Icon} size={15} strokeWidth={1.5} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {pagination && (
              <Pagination pagination={pagination} onPageChange={setPage} />
            )}
          </div>

          {/* Mobile pagination */}
          <div className="md:hidden">
            {pagination && (
              <div className="bg-white rounded-2xl border border-gray-100 mt-3">
                <Pagination pagination={pagination} onPageChange={setPage} />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
