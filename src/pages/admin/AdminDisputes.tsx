import { useCallback, useEffect, useState } from 'react';
import { api, type ApiResponse, type ApiPagination } from '../../lib/adminApi';
import {
  type Dispute,
  type DisputeStatus,
  DISPUTE_STATUSES,
  disputeReasonLabel,
} from '../../lib/disputes';
import AdminFilterBar, { FilterSelect } from '../../components/admin/AdminFilterBar';
import Pagination from '../../components/admin/Pagination';
import StatusBadge from '../../components/admin/StatusBadge';

type DisputesResponse = {
  disputes: Dispute[];
  pagination: ApiPagination;
};

export default function AdminDisputes() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [pagination, setPagination] = useState<ApiPagination | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState<Dispute | null>(null);
  const [resolution, setResolution] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchDisputes = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (statusFilter) params.set('status', statusFilter);
      const res = await api.get<ApiResponse<DisputesResponse>>(`/admin/disputes?${params}`, true);
      setDisputes(res.data.disputes);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load disputes');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchDisputes();
  }, [fetchDisputes]);

  const updateStatus = async (status: DisputeStatus) => {
    if (!selected) return;
    setActionLoading(true);
    try {
      const res = await api.patch<ApiResponse<Dispute>>(
        `/admin/disputes/${selected._id}/status`,
        { status, adminNote: adminNote || undefined },
        true,
      );
      setSelected(res.data);
      setDisputes((prev) => prev.map((d) => (d._id === res.data._id ? res.data : d)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  const resolveDispute = async (status: 'resolved_customer' | 'resolved_provider' | 'closed') => {
    if (!selected || !resolution.trim()) return;
    setActionLoading(true);
    try {
      const res = await api.patch<ApiResponse<Dispute>>(
        `/admin/disputes/${selected._id}/resolve`,
        { status, resolution: resolution.trim(), adminNote: adminNote || undefined },
        true,
      );
      setSelected(res.data);
      setDisputes((prev) => prev.map((d) => (d._id === res.data._id ? res.data : d)));
      setResolution('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resolve dispute');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Disputes</h1>
        <p className="mt-1 text-sm text-gray-500">Review and resolve customer–provider disputes.</p>
      </div>

      <AdminFilterBar>
        <FilterSelect
          value={statusFilter}
          onChange={(value) => { setStatusFilter(value); setPage(1); }}
          options={DISPUTE_STATUSES.map((s) => ({ label: s.label, value: s.value }))}
        />
      </AdminFilterBar>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-8 text-sm text-gray-400">Loading…</div>
          ) : disputes.length === 0 ? (
            <div className="p-8 text-sm text-gray-500">No disputes found.</div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {disputes.map((dispute) => (
                <li key={dispute._id}>
                  <button
                    type="button"
                    onClick={() => setSelected(dispute)}
                    className={`w-full text-left px-5 py-4 hover:bg-gray-50 transition-colors ${
                      selected?._id === dispute._id ? 'bg-gray-50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {dispute.booking.service?.title ?? 'Booking dispute'}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {dispute.raisedBy.firstName} {dispute.raisedBy.lastName} vs {dispute.provider.firstName} {dispute.provider.lastName}
                        </p>
                      </div>
                      <StatusBadge status={dispute.status} />
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {pagination && <Pagination pagination={pagination} onPageChange={setPage} />}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 min-h-[320px]">
          {!selected ? (
            <p className="text-sm text-gray-500">Select a dispute to review details.</p>
          ) : (
            <div className="space-y-4">
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  {selected.booking.service?.title ?? 'Booking dispute'}
                </h2>
                <p className="mt-1 text-sm text-gray-500">{disputeReasonLabel(selected.reason)}</p>
                <StatusBadge status={selected.status} />
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{selected.description}</p>
              {selected.providerResponse && (
                <div className="rounded-xl bg-gray-50 p-3 text-sm text-gray-700">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">Provider response</p>
                  {selected.providerResponse}
                </div>
              )}
              <textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                rows={2}
                placeholder="Internal admin note (optional)"
                className="auth-input resize-none"
              />
              <textarea
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                rows={3}
                placeholder="Resolution message for both parties"
                className="auth-input resize-none"
              />
              <div className="flex flex-wrap gap-2">
                <button type="button" disabled={actionLoading} onClick={() => updateStatus('under_review')} className="btn-pill-outline">
                  Mark under review
                </button>
                <button type="button" disabled={actionLoading} onClick={() => resolveDispute('resolved_customer')} className="btn-pill">
                  Resolve for customer
                </button>
                <button type="button" disabled={actionLoading} onClick={() => resolveDispute('resolved_provider')} className="btn-pill-outline">
                  Resolve for provider
                </button>
                <button type="button" disabled={actionLoading} onClick={() => resolveDispute('closed')} className="btn-pill-secondary">
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
