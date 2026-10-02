import { useCallback, useEffect, useState } from 'react';
import { api, type ApiResponse, type ApiPagination } from '../../lib/adminApi';
import type { AdminWaitlistEntry } from '../../lib/adminApi';
import Pagination from '../../components/admin/Pagination';

interface WaitlistResponse {
  entries: AdminWaitlistEntry[];
  pagination: ApiPagination;
}

export default function AdminWaitlist() {
  const [entries, setEntries] = useState<AdminWaitlistEntry[]>([]);
  const [pagination, setPagination] = useState<ApiPagination | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      const res = await api.get<ApiResponse<WaitlistResponse>>(
        `/admin/waitlist?${params.toString()}`,
        true
      );
      setEntries(res.data.entries);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load waitlist');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  return (
    <div>
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
      ) : entries.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center text-gray-400">No waitlist entries found.</div>
      ) : (
        <>
          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {entries.map((entry) => (
              <div key={entry._id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                <p className="font-semibold text-gray-900 break-all mb-1">{entry.email}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                  <span>{entry.phone ?? '—'}</span>
                  {entry.service && (
                    <span className="text-gray-500">{entry.service}</span>
                  )}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {entry.discountCode && (
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium tracking-wide text-gray-700">
                      {entry.discountCode}
                    </span>
                  )}
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      entry.discountRedeemedAt
                        ? 'bg-gray-100 text-gray-500'
                        : 'bg-mint/10 text-mint'
                    }`}
                  >
                    {entry.discountRedeemedAt ? 'Redeemed' : 'Available'}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(entry.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>

          <div className="admin-table-wrap">
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Service Interest</th>
                    <th>Discount Code</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => (
                    <tr key={entry._id}>
                      <td className="font-medium text-gray-900">{entry.email}</td>
                      <td className="text-gray-600">{entry.phone ?? '—'}</td>
                      <td className="text-gray-600">{entry.service ?? '—'}</td>
                      <td>
                        {entry.discountCode ? (
                          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-gray-700">
                            {entry.discountCode}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                            entry.discountRedeemedAt
                              ? 'bg-gray-100 text-gray-500'
                              : 'bg-mint/10 text-mint'
                          }`}
                        >
                          {entry.discountRedeemedAt ? 'Redeemed' : 'Available'}
                        </span>
                      </td>
                      <td className="text-gray-500 text-xs whitespace-nowrap">
                        {new Date(entry.createdAt).toLocaleDateString()}
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
