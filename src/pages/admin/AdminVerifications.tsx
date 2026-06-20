import { useCallback, useEffect, useState } from 'react';
import { api, type ApiResponse, type ApiPagination } from '../../lib/adminApi';
import type { AdminVerification, VerificationStatus } from '../../lib/adminApi';
import StatusBadge from '../../components/admin/StatusBadge';
import Pagination from '../../components/admin/Pagination';
import AdminFilterBar, { FilterSelect } from '../../components/admin/AdminFilterBar';
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

export default function AdminVerifications() {
  const [verifications, setVerifications] = useState<AdminVerification[]>([]);
  const [pagination, setPagination] = useState<ApiPagination | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const handleVerifyToggle = async (verification: AdminVerification) => {
    const newState = !verification.user.providerVerified;
    const action = newState ? 'verify' : 'unverify';
    if (
      !window.confirm(
        `Are you sure you want to ${action} ${verification.user.firstName} ${verification.user.lastName}?`
      )
    )
      return;
    try {
      await api.patch(
        `/admin/verifications/${verification.user._id}/verify`,
        { verified: newState },
        true
      );
      setVerifications((prev) =>
        prev.map((v) =>
          v._id === verification._id
            ? { ...v, user: { ...v.user, providerVerified: newState } }
            : v
        )
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update verification');
    }
  };

  return (
    <div>
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
          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {verifications.map((v) => (
              <div key={v._id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                <div className="mb-2">
                  <p className="font-semibold text-gray-900">
                    {v.user.firstName} {v.user.lastName}
                  </p>
                  <p className="text-xs text-gray-400">{v.user.email}</p>
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
                <button
                  onClick={() => handleVerifyToggle(v)}
                  className={`w-full py-2.5 text-sm rounded-xl font-medium transition-colors min-h-[44px] ${
                    v.user.providerVerified
                      ? 'bg-red-50 text-red-700 hover:bg-red-100'
                      : 'bg-green-50 text-green-700 hover:bg-green-100'
                  }`}
                >
                  {v.user.providerVerified ? 'Unverify Provider' : 'Verify Provider'}
                </button>
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
                    <th className="px-4 py-3 text-left">Reference</th>
                    <th className="px-4 py-3 text-left">Amount</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Paid At</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {verifications.map((v) => (
                    <tr key={v._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">
                          {v.user.firstName} {v.user.lastName}
                        </p>
                        <p className="text-xs text-gray-400">{v.user.email}</p>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-600">
                        {v.reference}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {formatNaira(v.amount)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={v.status} />
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                        {v.paidAt ? new Date(v.paidAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleVerifyToggle(v)}
                          className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                            v.user.providerVerified
                              ? 'bg-red-50 text-red-700 hover:bg-red-100'
                              : 'bg-green-50 text-green-700 hover:bg-green-100'
                          }`}
                        >
                          {v.user.providerVerified ? 'Unverify' : 'Verify'}
                        </button>
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
