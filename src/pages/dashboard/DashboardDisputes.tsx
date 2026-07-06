import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, type ApiResponse, type ApiPagination } from '../../lib/api';
import {
  type Dispute,
  type DisputeStatus,
  DISPUTE_STATUSES,
  disputeReasonLabel,
  disputeStatusLabel,
} from '../../lib/disputes';

type DisputesResponse = {
  disputes: Dispute[];
  pagination: ApiPagination;
};

export default function DashboardDisputes() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [pagination, setPagination] = useState<ApiPagination | null>(null);
  const [status, setStatus] = useState<DisputeStatus | ''>('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDisputes = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ page: String(page), limit: '10' });
      if (status) params.set('status', status);
      const res = await api.get<ApiResponse<DisputesResponse>>(`/disputes?${params}`, true);
      setDisputes(res.data.disputes);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load disputes');
    } finally {
      setLoading(false);
    }
  }, [page, status]);

  useEffect(() => {
    fetchDisputes();
  }, [fetchDisputes]);

  return (
    <div className="max-w-3xl space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Disputes</h1>
          <p className="mt-1 text-sm text-gray-500">View and manage booking disputes you are involved in.</p>
        </div>
        <Link to="/dashboard/bookings" className="btn-pill-outline shrink-0">
          View bookings
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        {DISPUTE_STATUSES.map((option) => (
          <button
            key={option.label}
            type="button"
            onClick={() => { setStatus(option.value as DisputeStatus | ''); setPage(1); }}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
              status === option.value ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-white rounded-2xl border border-gray-100 animate-pulse" />
          ))}
        </div>
      ) : disputes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-sm text-gray-500">
          No disputes found.
        </div>
      ) : (
        <div className="space-y-3">
          {disputes.map((dispute) => (
            <Link
              key={dispute._id}
              to={`/dashboard/disputes/${dispute._id}`}
              className="block bg-white rounded-2xl border border-gray-100 p-5 hover:border-gray-200 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {dispute.booking.service?.title ?? 'Booking dispute'}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {disputeReasonLabel(dispute.reason)} · {new Date(dispute.createdAt).toLocaleDateString('en-NG')}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-700 capitalize">
                  {disputeStatusLabel(dispute.status)}
                </span>
              </div>
              <p className="mt-3 text-sm text-gray-600 line-clamp-2">{dispute.description}</p>
            </Link>
          ))}
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <button
            type="button"
            disabled={!pagination.hasPrevPage}
            onClick={() => setPage((p) => p - 1)}
            className="disabled:opacity-40"
          >
            Previous
          </button>
          <span>Page {pagination.page} of {pagination.totalPages}</span>
          <button
            type="button"
            disabled={!pagination.hasNextPage}
            onClick={() => setPage((p) => p + 1)}
            className="disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
