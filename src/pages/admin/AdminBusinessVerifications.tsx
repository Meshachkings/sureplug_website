import { useCallback, useEffect, useRef, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { CheckmarkCircle01Icon, Cancel01Icon } from '@hugeicons/core-free-icons';
import { api, type ApiResponse, type ApiPagination } from '../../lib/adminApi';
import type { AdminBusinessVerification, BusinessVerificationStatus } from '../../lib/adminApi';
import Pagination from '../../components/admin/Pagination';
import AdminFilterBar, { FilterSelect } from '../../components/admin/AdminFilterBar';
import ConfirmModal from '../../components/admin/ConfirmModal';

interface BizVerificationsResponse {
  records: (Omit<AdminBusinessVerification, 'user'> & { userId: AdminBusinessVerification['user'] })[];
  pagination: ApiPagination;
}

const STATUS_OPTIONS: Array<{ label: string; value: string }> = [
  { label: 'All statuses', value: '' },
  { label: 'Awaiting Payment', value: 'awaiting_payment' },
  { label: 'Awaiting Documents', value: 'awaiting_documents' },
  { label: 'Pending Review', value: 'pending_review' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
];

const STATUS_STYLES: Record<BusinessVerificationStatus, string> = {
  awaiting_payment: 'bg-orange-50 text-orange-700',
  awaiting_documents: 'bg-yellow-50 text-yellow-700',
  pending_review: 'bg-blue-50 text-blue-700',
  approved: 'bg-green-50 text-green-700',
  rejected: 'bg-red-50 text-red-700',
};

const STATUS_LABELS: Record<BusinessVerificationStatus, string> = {
  awaiting_payment: 'Awaiting Payment',
  awaiting_documents: 'Awaiting Docs',
  pending_review: 'Pending Review',
  approved: 'Approved',
  rejected: 'Rejected',
};

function StatusPill({ status }: { status: BusinessVerificationStatus }) {
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function RejectModal({
  verification,
  onClose,
  onReject,
}: {
  verification: AdminBusinessVerification;
  onClose: () => void;
  onReject: (note: string) => Promise<void>;
}) {
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleSubmit = async () => {
    if (!note.trim()) return;
    setLoading(true);
    await onReject(note.trim());
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
              <h3 className="text-base font-semibold text-gray-900">Reject Verification</h3>
              <p className="text-sm text-gray-500 mt-0.5">
                {verification.businessName} · {verification.user.firstName} {verification.user.lastName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={15} strokeWidth={2} color="currentColor" />
            </button>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Rejection reason <span className="text-red-500">*</span>
            </label>
            <textarea
              ref={textareaRef}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
              placeholder="Explain why the verification is being rejected (visible to the user)…"
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent resize-none"
            />
          </div>
          <div className="flex gap-2.5">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!note.trim() || loading}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Rejecting…' : 'Reject'}
            </button>
          </div>
        </div>
        <div className="h-[env(safe-area-inset-bottom)] bg-white sm:hidden" />
      </div>
    </div>
  );
}

export default function AdminBusinessVerifications() {
  const [verifications, setVerifications] = useState<AdminBusinessVerification[]>([]);
  const [pagination, setPagination] = useState<ApiPagination | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rejectTarget, setRejectTarget] = useState<AdminBusinessVerification | null>(null);
  const [approveTarget, setApproveTarget] = useState<AdminBusinessVerification | null>(null);
  const [apiError, setApiError] = useState('');

  const fetchVerifications = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (statusFilter) params.set('status', statusFilter);
      const res = await api.get<ApiResponse<BizVerificationsResponse>>(
        `/admin/business-verifications?${params.toString()}`,
        true
      );
      const normalized = (res.data.records ?? []).map(({ userId, ...rest }) => ({
        ...rest,
        user: userId,
      }));
      setVerifications(normalized);
      setPagination(res.data.pagination ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load business verifications');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchVerifications();
  }, [fetchVerifications]);

  const handleApprove = async () => {
    if (!approveTarget) return;
    const target = approveTarget;
    setApproveTarget(null);
    try {
      await api.patch(`/admin/business-verifications/${target._id}/approve`, {}, true);
      setVerifications((prev) =>
        prev.map((v) =>
          v._id === target._id
            ? { ...v, status: 'approved' as BusinessVerificationStatus, user: { ...v.user, businessVerified: true } }
            : v
        )
      );
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Failed to approve verification');
    }
  };

  const handleReject = async (note: string) => {
    if (!rejectTarget) return;
    const target = rejectTarget;
    try {
      await api.patch(`/admin/business-verifications/${target._id}/reject`, { adminNote: note }, true);
      setVerifications((prev) =>
        prev.map((v) =>
          v._id === target._id
            ? { ...v, status: 'rejected' as BusinessVerificationStatus, adminNote: note }
            : v
        )
      );
      setRejectTarget(null);
    } catch (err) {
      setRejectTarget(null);
      setApiError(err instanceof Error ? err.message : 'Failed to reject verification');
    }
  };

  const canReview = (status: BusinessVerificationStatus) =>
    status === 'pending_review';

  return (
    <div>
      {approveTarget && (
        <ConfirmModal
          title="Approve Business Verification"
          message={`Approve "${approveTarget.businessName}" for ${approveTarget.user.firstName} ${approveTarget.user.lastName}? This will set their businessVerified status to true.`}
          confirmLabel="Approve"
          variant="warning"
          onConfirm={handleApprove}
          onCancel={() => setApproveTarget(null)}
        />
      )}
      {rejectTarget && (
        <RejectModal
          verification={rejectTarget}
          onClose={() => setRejectTarget(null)}
          onReject={handleReject}
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
          onChange={(v) => { setStatusFilter(v); setPage(1); }}
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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center text-gray-400">
          No business verifications found.
        </div>
      ) : (
        <>
          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {verifications.map((v) => (
              <div key={v._id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{v.businessName}</p>
                    <p className="text-xs text-gray-500">
                      {v.user.firstName} {v.user.lastName} · {v.user.email}
                    </p>
                  </div>
                  <StatusPill status={v.status} />
                </div>

                {v.documents.length > 0 && (
                  <div className="mb-2 space-y-1">
                    {v.documents.map((doc, i) => (
                      <a
                        key={i}
                        href={doc.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-[#019B5F] hover:underline"
                      >
                        <HugeiconsIcon icon={CheckmarkCircle01Icon} size={12} strokeWidth={2} color="currentColor" />
                        {doc.filename} ({formatBytes(doc.size)})
                      </a>
                    ))}
                  </div>
                )}

                {v.adminNote && (
                  <p className="text-xs text-gray-500 italic mb-2 bg-gray-50 rounded-lg px-2.5 py-1.5">
                    Note: {v.adminNote}
                  </p>
                )}

                <p className="text-xs text-gray-400 mb-3">
                  {new Date(v.createdAt).toLocaleDateString()}
                </p>

                {canReview(v.status) && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setApproveTarget(v)}
                      className="flex-1 py-2.5 text-sm rounded-xl font-medium bg-green-50 text-green-700 hover:bg-green-100 transition-colors min-h-[44px]"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => setRejectTarget(v)}
                      className="flex-1 py-2.5 text-sm rounded-xl font-medium bg-red-50 text-red-700 hover:bg-red-100 transition-colors min-h-[44px]"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-xs uppercase text-gray-500 tracking-wide">
                    <th className="px-4 py-3 text-left">Business</th>
                    <th className="px-4 py-3 text-left">Owner</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Documents</th>
                    <th className="px-4 py-3 text-left">Submitted</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {verifications.map((v) => (
                    <tr key={v._id} className="hover:bg-gray-50/50 transition-colors align-top">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{v.businessName}</p>
                        {v.adminNote && (
                          <p className="text-xs text-gray-400 italic mt-0.5 max-w-[200px] truncate" title={v.adminNote}>
                            Note: {v.adminNote}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">
                          {v.user.firstName} {v.user.lastName}
                        </p>
                        <p className="text-xs text-gray-400">{v.user.email}</p>
                      </td>
                      <td className="px-4 py-3">
                        <StatusPill status={v.status} />
                      </td>
                      <td className="px-4 py-3">
                        {v.documents.length === 0 ? (
                          <span className="text-gray-400 text-xs">—</span>
                        ) : (
                          <div className="space-y-0.5">
                            {v.documents.map((doc, i) => (
                              <a
                                key={i}
                                href={doc.path}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block text-xs text-[#019B5F] hover:underline truncate max-w-[160px]"
                                title={doc.filename}
                              >
                                {doc.filename}
                              </a>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                        {new Date(v.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {canReview(v.status) ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setApproveTarget(v)}
                              className="px-3 py-1 text-xs rounded-lg font-medium bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => setRejectTarget(v)}
                              className="px-3 py-1 text-xs rounded-lg font-medium bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                            >
                              Reject
                            </button>
                          </div>
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
