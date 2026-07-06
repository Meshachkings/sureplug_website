import { FormEvent, useCallback, useEffect, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Add01Icon, Delete02Icon, Tick01Icon, PencilEdit01Icon, Cancel01Icon } from '@hugeicons/core-free-icons';
import { api, type ApiResponse, type ApiPagination } from '../../lib/adminApi';
import type { AdminStaff, StaffPermission } from '../../lib/adminApi';
import { STAFF_PERMISSIONS } from '../../lib/adminApi';
import Pagination from '../../components/admin/Pagination';
import ConfirmModal from '../../components/admin/ConfirmModal';

interface StaffResponse {
  staff: AdminStaff[];
  pagination: ApiPagination;
}

const PERMISSION_LABELS: Record<StaffPermission, string> = {
  view_dashboard: 'View Dashboard',
  manage_users: 'Manage Users',
  manage_services: 'Manage Services',
  manage_bookings: 'Manage Bookings',
  manage_disputes: 'Manage Disputes',
  manage_reviews: 'Manage Reviews',
  manage_verifications: 'Manage Verifications',
  manage_business_verifications: 'Business Verifications',
  manage_categories: 'Manage Categories',
  manage_contacts: 'Manage Contacts',
  manage_waitlist: 'Manage Waitlist',
  send_notifications: 'Send Notifications',
  manage_staff: 'Manage Staff',
};

function PermissionCheckbox({
  permission,
  checked,
  onChange,
}: {
  permission: StaffPermission;
  checked: boolean;
  onChange: (p: StaffPermission, v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer select-none group">
      <div
        className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 border transition-colors ${
          checked
            ? 'bg-[#019B5F] border-[#019B5F]'
            : 'border-gray-300 group-hover:border-gray-400'
        }`}
      >
        {checked && (
          <HugeiconsIcon icon={Tick01Icon} size={10} strokeWidth={3} color="white" />
        )}
      </div>
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onChange(permission, e.target.checked)}
      />
      <span className="text-sm text-gray-700">{PERMISSION_LABELS[permission]}</span>
    </label>
  );
}

function CreateStaffPanel({ onCreate }: { onCreate: (staff: AdminStaff) => void }) {
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [permissions, setPermissions] = useState<Set<StaffPermission>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const togglePerm = (p: StaffPermission, v: boolean) => {
    setPermissions((prev) => {
      const next = new Set(prev);
      if (v) next.add(p); else next.delete(p);
      return next;
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (permissions.size === 0) { setError('Select at least one permission.'); return; }
    setError('');
    setLoading(true);
    try {
      const res = await api.post<ApiResponse<AdminStaff>>(
        '/admin/staff',
        { firstName, lastName, email, phone, password, permissions: Array.from(permissions) },
        true
      );
      onCreate(res.data);
      setOpen(false);
      setFirstName(''); setLastName(''); setEmail(''); setPhone(''); setPassword('');
      setPermissions(new Set());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create staff');
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#019B5F] text-white text-sm font-semibold hover:bg-[#017a4c] transition-colors mb-5"
      >
        <HugeiconsIcon icon={Add01Icon} size={15} strokeWidth={2.5} color="white" />
        Add staff member
      </button>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[15px] font-semibold text-gray-900">New staff member</h2>
        <button
          onClick={() => setOpen(false)}
          className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <HugeiconsIcon icon={Cancel01Icon} size={15} strokeWidth={2} color="currentColor" />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">First name</label>
            <input
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Sarah"
              className="auth-input"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Last name</label>
            <input
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Admin"
              className="auth-input"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sarah@sureplug.com"
              className="auth-input"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="08099999999"
              className="auth-input"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="auth-input"
            />
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-700 mb-2">Permissions</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {STAFF_PERMISSIONS.map((p) => (
              <PermissionCheckbox
                key={p}
                permission={p}
                checked={permissions.has(p)}
                onChange={togglePerm}
              />
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-2.5 pt-1">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#019B5F] text-white text-sm font-semibold hover:bg-[#017a4c] disabled:opacity-60 transition-colors"
          >
            {loading ? 'Creating…' : 'Create staff'}
          </button>
        </div>
      </form>
    </div>
  );
}

function EditPermissionsPanel({
  staff,
  onClose,
  onSave,
}: {
  staff: AdminStaff;
  onClose: () => void;
  onSave: (id: string, permissions: StaffPermission[]) => Promise<void>;
}) {
  const [permissions, setPermissions] = useState<Set<StaffPermission>>(new Set(staff.permissions));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const togglePerm = (p: StaffPermission, v: boolean) => {
    setPermissions((prev) => {
      const next = new Set(prev);
      if (v) next.add(p); else next.delete(p);
      return next;
    });
  };

  const handleSave = async () => {
    if (permissions.size === 0) { setError('Select at least one permission.'); return; }
    setError('');
    setLoading(true);
    await onSave(staff._id, Array.from(permissions));
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-6">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>
        <div className="px-6 pt-5 pb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-gray-900">Edit Permissions</h3>
              <p className="text-sm text-gray-500 mt-0.5">
                {staff.firstName} {staff.lastName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={15} strokeWidth={2} color="currentColor" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5 mb-4">
            {STAFF_PERMISSIONS.map((p) => (
              <PermissionCheckbox
                key={p}
                permission={p}
                checked={permissions.has(p)}
                onChange={togglePerm}
              />
            ))}
          </div>

          {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

          <div className="flex gap-2.5">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#019B5F] text-white text-sm font-semibold hover:bg-[#017a4c] disabled:opacity-60 transition-colors"
            >
              {loading ? 'Saving…' : 'Save permissions'}
            </button>
          </div>
        </div>
        <div className="h-[env(safe-area-inset-bottom)] bg-white sm:hidden" />
      </div>
    </div>
  );
}

export default function AdminStaffPage() {
  const [staff, setStaff] = useState<AdminStaff[]>([]);
  const [pagination, setPagination] = useState<ApiPagination | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<AdminStaff | null>(null);
  const [editTarget, setEditTarget] = useState<AdminStaff | null>(null);
  const [apiError, setApiError] = useState('');

  const fetchStaff = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      const res = await api.get<ApiResponse<StaffResponse>>(
        `/admin/staff?${params.toString()}`,
        true
      );
      setStaff(res.data.staff ?? []);
      setPagination(res.data.pagination ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load staff');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const handleCreate = (newStaff: AdminStaff) => {
    setStaff((prev) => [newStaff, ...prev]);
  };

  const handleSavePermissions = async (id: string, permissions: StaffPermission[]) => {
    try {
      const res = await api.patch<ApiResponse<{ _id: string; permissions: StaffPermission[] }>>(
        `/admin/staff/${id}/permissions`,
        { permissions },
        true
      );
      setStaff((prev) =>
        prev.map((s) => (s._id === id ? { ...s, permissions: res.data.permissions } : s))
      );
      setEditTarget(null);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Failed to update permissions');
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    setDeleteTarget(null);
    try {
      await api.delete(`/admin/staff/${target._id}`, true);
      setStaff((prev) => prev.filter((s) => s._id !== target._id));
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Failed to delete staff');
    }
  };

  return (
    <div>
      {deleteTarget && (
        <ConfirmModal
          title="Delete Staff Member"
          message={`Permanently delete ${deleteTarget.firstName} ${deleteTarget.lastName}'s account? This cannot be undone.`}
          confirmLabel="Delete"
          variant="danger"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
      {editTarget && (
        <EditPermissionsPanel
          staff={editTarget}
          onClose={() => setEditTarget(null)}
          onSave={handleSavePermissions}
        />
      )}
      {apiError && (
        <ConfirmModal
          title="Error"
          message={apiError}
          confirmLabel="OK"
          cancelLabel={false}
          variant="error"
          onConfirm={() => setApiError('')}
          onCancel={() => setApiError('')}
        />
      )}

      <CreateStaffPanel onCreate={handleCreate} />

      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="px-4 py-3 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-1/4" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center text-red-500">{error}</div>
      ) : staff.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center text-gray-400">
          No staff members yet. Add your first subadmin above.
        </div>
      ) : (
        <>
          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {staff.map((s) => (
              <div key={s._id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900">
                      {s.firstName} {s.lastName}
                    </p>
                    <p className="text-xs text-gray-400">{s.email}</p>
                    {s.phone && <p className="text-xs text-gray-400">{s.phone}</p>}
                  </div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 whitespace-nowrap">
                    Subadmin
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {s.permissions.map((p) => (
                    <span
                      key={p}
                      className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#019B5F]/8 text-[#019B5F]"
                    >
                      {PERMISSION_LABELS[p]}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditTarget(s)}
                    className="flex-1 py-2.5 text-sm rounded-xl font-medium bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors flex items-center justify-center gap-1.5 min-h-[44px]"
                  >
                    <HugeiconsIcon icon={PencilEdit01Icon} size={14} strokeWidth={2} color="currentColor" />
                    Edit permissions
                  </button>
                  <button
                    onClick={() => setDeleteTarget(s)}
                    className="py-2.5 px-3.5 text-sm rounded-xl font-medium bg-red-50 text-red-700 hover:bg-red-100 transition-colors min-h-[44px]"
                  >
                    <HugeiconsIcon icon={Delete02Icon} size={16} strokeWidth={2} color="currentColor" />
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
                    <th className="px-4 py-3 text-left">Staff</th>
                    <th className="px-4 py-3 text-left">Permissions</th>
                    <th className="px-4 py-3 text-left">Joined</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {staff.map((s) => (
                    <tr key={s._id} className="hover:bg-gray-50/50 transition-colors align-top">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">
                          {s.firstName} {s.lastName}
                        </p>
                        <p className="text-xs text-gray-400">{s.email}</p>
                        {s.phone && <p className="text-xs text-gray-400">{s.phone}</p>}
                      </td>
                      <td className="px-4 py-3 max-w-xs">
                        <div className="flex flex-wrap gap-1">
                          {s.permissions.map((p) => (
                            <span
                              key={p}
                              className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#019B5F]/8 text-[#019B5F]"
                            >
                              {PERMISSION_LABELS[p]}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                        {new Date(s.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditTarget(s)}
                            className="px-3 py-1 text-xs rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors flex items-center gap-1.5"
                          >
                            <HugeiconsIcon icon={PencilEdit01Icon} size={11} strokeWidth={2} color="currentColor" />
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteTarget(s)}
                            className="px-3 py-1 text-xs rounded-lg font-medium bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                          >
                            Delete
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
