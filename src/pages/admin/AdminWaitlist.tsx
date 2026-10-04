import { useCallback, useEffect, useState } from 'react';
import { api, type ApiResponse, type ApiPagination } from '../../lib/adminApi';
import type { AdminWaitlistEntry } from '../../lib/adminApi';
import Pagination from '../../components/admin/Pagination';

interface WaitlistResponse {
  entries: AdminWaitlistEntry[];
  pagination: ApiPagination;
}

function formatJoinedAt(value: string) {
  return new Date(value).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
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

  const total = pagination?.total ?? 0;
  const limit = pagination?.limit ?? 20;
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="space-y-4">
      {!loading && !error && (
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
              Waitlist
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-900 tracking-tight">
              {total.toLocaleString()}{' '}
              <span className="text-base font-medium text-slate-400">
                {total === 1 ? 'person' : 'people'}
              </span>
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {total === 0
                ? 'No one has joined yet.'
                : `Showing ${from}–${to} of ${total.toLocaleString()}`}
            </p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="px-4 py-3.5 animate-pulse flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-gray-200 shrink-0" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center text-red-500">{error}</div>
      ) : entries.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center text-gray-400">
          No waitlist entries found.
        </div>
      ) : (
        <>
          {/* Mobile / tablet cards */}
          <div className="lg:hidden space-y-3">
            {entries.map((entry) => (
              <div key={entry._id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <p className="font-semibold text-gray-900 break-all">{entry.email}</p>
                  <span className="text-xs text-gray-400 whitespace-nowrap shrink-0">
                    {formatJoinedAt(entry.createdAt)}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                  <span>{entry.phone ?? '—'}</span>
                  {entry.service && (
                    <span className="text-gray-500">{entry.service}</span>
                  )}
                </div>
                <div className="mt-2.5 flex flex-wrap items-center gap-2">
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
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="admin-table min-w-[720px]">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Service Interest</th>
                    <th>Discount Code</th>
                    <th>Status</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => (
                    <tr key={entry._id}>
                      <td className="font-medium text-gray-900">{entry.email}</td>
                      <td className="text-gray-600 whitespace-nowrap">{entry.phone ?? '—'}</td>
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
                        {formatJoinedAt(entry.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {pagination && (
              <Pagination pagination={pagination} onPageChange={setPage} showWhenSinglePage />
            )}
          </div>

          <div className="lg:hidden">
            {pagination && (
              <div className="bg-white rounded-2xl border border-gray-100">
                <Pagination pagination={pagination} onPageChange={setPage} showWhenSinglePage />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
