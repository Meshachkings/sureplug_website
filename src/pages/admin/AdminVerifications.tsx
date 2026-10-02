import { useCallback, useEffect, useState } from 'react';
import { api, type ApiResponse, type ApiPagination } from '../../lib/adminApi';
import type { AdminVerification, VerificationStatus } from '../../lib/adminApi';
import StatusBadge from '../../components/admin/StatusBadge';
import Pagination from '../../components/admin/Pagination';
import AdminFilterBar, { FilterSelect } from '../../components/admin/AdminFilterBar';
import ConfirmModal from '../../components/admin/ConfirmModal';
import { formatNaira } from '../../lib/format';

interface VerificationsResponse {
  verifications: AdminVerification[];
  pagination: ApiPagination;
}

const STATUS_OPTIONS: Array<{ label: string; value: string }> = [
  { label: 'All statuses', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'Successful', value: 'successful' },
  { label: 'Failed', value: 'failed' },
];

function userLabel(user?: AdminVerification['user']) {
  if (!user) return 'Unknown user';
  const name = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();
  return name || user.email || 'Unknown user';
}

export default function AdminVerifications() {
  const [verifications, setVerifications] = useState<AdminVerification[]>([]);
  const [pagination, setPagination] = useState<ApiPagination | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirm, setConfirm] = useState<{
    verification: AdminVerification;
    newState: boolean;
  } | null>(null);
  const [apiError, setApiError] = useState('');

  const fetchVerifications = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (statusFilter) params.set('status', statusFilter);
      const res = await api.get<ApiResponse<VerificationsResponse>>(
        `/admin/verifications?${params.toString()}`,
        true
      );
      setVerifications(res.data.verifications);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load verifications');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchVerifications();
  }, [fetchVerifications]);

  const handleVerifyToggle = (verification: AdminVerification) => {
    if (!verification.user?._id) {
      setApiError('This verification has no linked user account.');
      return;
    }
    const newState = !verification.user.isPremium;
    setConfirm({ verification, newState });
  };

  const confirmVerifyToggle = async () => {
    const userId = confirm?.verification.user?._id;
    if (!confirm || !userId) return;
    const { verification, newState } = confirm;
    setConfirm(null);
    try {
      await api.patch(
        `/admin/verifications/${userId}/verify`,
        { verified: newState },
        true
      );
      setVerifications((prev) =>
        prev.map((v) =>
          v._id === verification._id && v.user
            ? { ...v, user: { ...v.user, isPremium: newState } }
            : v
        )
      );
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Failed to update verification');
    }
  };

  return (
    <div>
      {confirm && confirm.verification.user && (
        <ConfirmModal
          title={confirm.newState ? 'Grant Premium' : 'Revoke Premium'}
          message={`${confirm.newState ? 'Grant' : 'Revoke'} Premium for ${userLabel(confirm.verification.user)}? ${confirm.newState ? 'This will extend their premium subscription by 30 days.' : 'This will remove their premium listing priority.'}`}
          confirmLabel={confirm.newState ? 'Grant Premium' : 'Revoke Premium'}
          variant={confirm.newState ? 'warning' : 'danger'}
          onConfirm={confirmVerifyToggle}
          onCancel={() => setConfirm(null)}
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
      <AdminFilterBar>
        <FilterSelect
          value={statusFilter}
          options={STATUS_OPTIONS}
          onChange={(v) => { setStatusFilter(v as VerificationStatus | ''); setPage(1); }}
          placeholder="All statuses"
        />
      </AdminFilterBar>

      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="px-4 py-3 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-1/4" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center text-red-500">{error}</div>
      ) : verifications.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center text-gray-400">No verifications found.</div>
      ) : (
        <>
          <div className="md:hidden space-y-3">
            {verifications.map((v) => (
              <div key={v._id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                <div className="mb-2">
                  <p className="font-semibold text-gray-900">{userLabel(v.user)}</p>
                  {v.user?.email && <p className="text-xs text-gray-400">{v.user.email}</p>}
                </div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <StatusBadge status={v.status} />
                  <span className="text-sm font-semibold text-gray-900">{formatNaira(v.amount)}</span>
                  {v.paidAt && (
                    <span className="text-xs text-gray-400">
                      {new Date(v.paidAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 font-mono truncate mb-3">
                  Ref: {v.reference}
                </p>
                {v.user?._id ? (
                  <button
                    onClick={() => handleVerifyToggle(v)}
                    className={`w-full min-h-[44px] ${
                      v.user.isPremium ? 'admin-btn-danger' : 'admin-btn-primary'
                    }`}
                  >
                    {v.user.isPremium ? 'Revoke Premium' : 'Grant Premium'}
                  </button>
                ) : (
                  <p className="text-xs text-gray-400 text-center py-2">No linked user</p>
                )}
              </div>
            ))}
          </div>

          <div className="admin-table-wrap">
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Reference</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Paid At</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {verifications.map((v) => (
                    <tr key={v._id}>
                      <td>
                        <p className="font-semibold text-gray-900">{userLabel(v.user)}</p>
                        {v.user?.email && <p className="text-xs text-gray-400 mt-0.5">{v.user.email}</p>}
                      </td>
                      <td className="font-mono text-xs text-gray-600">
                        {v.reference}
                      </td>
                      <td className="font-semibold text-gray-900">
                        {formatNaira(v.amount)}
                      </td>
                      <td>
                        <StatusBadge status={v.status} />
                      </td>
                      <td className="text-gray-500 text-xs whitespace-nowrap">
                        {v.paidAt ? new Date(v.paidAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="text-right">
                        {v.user?._id ? (
                          <button
                            onClick={() => handleVerifyToggle(v)}
                            className={v.user.isPremium ? 'admin-btn-danger' : 'admin-btn-primary'}
                          >
                            {v.user.isPremium ? 'Revoke' : 'Grant Premium'}
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
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
