import { FormEvent, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons';
import { useAuth } from '../../context/AuthContext';
import { api, type ApiResponse } from '../../lib/api';
import {
  ACTIVE_DISPUTE_STATUSES,
  type Dispute,
  disputeReasonLabel,
  disputeStatusLabel,
} from '../../lib/disputes';

export default function DashboardDisputeDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [dispute, setDispute] = useState<Dispute | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [evidence, setEvidence] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState('');

  const isProvider = user?._id === dispute?.provider._id;
  const isCustomer = user?._id === dispute?.raisedBy._id;
  const isActive = dispute ? ACTIVE_DISPUTE_STATUSES.includes(dispute.status) : false;

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.get<ApiResponse<Dispute>>(`/disputes/${id}`, true)
      .then((res) => setDispute(res.data))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load dispute'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleRespond = async (event: FormEvent) => {
    event.preventDefault();
    if (!id || !message.trim()) return;
    setSubmitting(true);
    setNotice('');
    try {
      const form = new FormData();
      form.append('message', message.trim());
      evidence.forEach((file) => form.append('evidence', file));
      const res = await api.post<ApiResponse<Dispute>>(`/disputes/${id}/respond`, form, true);
      setDispute(res.data);
      setMessage('');
      setEvidence([]);
      setNotice('Response submitted.');
    } catch (err) {
      setNotice(err instanceof Error ? err.message : 'Failed to submit response');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddEvidence = async (event: FormEvent) => {
    event.preventDefault();
    if (!id || !evidence.length) return;
    setSubmitting(true);
    setNotice('');
    try {
      const form = new FormData();
      evidence.forEach((file) => form.append('evidence', file));
      const res = await api.post<ApiResponse<Dispute>>(`/disputes/${id}/evidence`, form, true);
      setDispute(res.data);
      setEvidence([]);
      setNotice('Evidence uploaded.');
    } catch (err) {
      setNotice(err instanceof Error ? err.message : 'Failed to upload evidence');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="h-40 bg-white rounded-2xl border border-gray-100 animate-pulse" />;
  }

  if (error || !dispute) {
    return (
      <div className="max-w-2xl">
        <p className="text-sm text-red-600">{error || 'Dispute not found'}</p>
        <Link to="/dashboard/disputes" className="btn-link mt-4">Back to disputes</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-5">
      <Link to="/dashboard/disputes" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900">
        <HugeiconsIcon icon={ArrowLeft01Icon} size={15} color="currentColor" strokeWidth={2} />
        Back to disputes
      </Link>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              {dispute.booking.service?.title ?? 'Booking dispute'}
            </h1>
            <p className="mt-1 text-sm text-gray-500">{disputeReasonLabel(dispute.reason)}</p>
          </div>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 capitalize">
            {disputeStatusLabel(dispute.status)}
          </span>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed">{dispute.description}</p>

        {dispute.evidence.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Evidence</p>
            <ul className="space-y-1">
              {dispute.evidence.map((file) => (
                <li key={file.path}>
                  <a href={file.path} target="_blank" rel="noreferrer" className="text-sm text-mint hover:underline">
                    {file.filename}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {dispute.providerResponse && (
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Provider response</p>
            <p className="text-sm text-gray-700 leading-relaxed">{dispute.providerResponse}</p>
            {dispute.providerRespondedAt && (
              <p className="mt-2 text-xs text-gray-400">
                {new Date(dispute.providerRespondedAt).toLocaleString('en-NG')}
              </p>
            )}
          </div>
        )}

        {dispute.resolution && (
          <div className="rounded-xl border border-green-100 bg-green-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-green-700 mb-2">Resolution</p>
            <p className="text-sm text-green-900 leading-relaxed">{dispute.resolution}</p>
          </div>
        )}
      </div>

      {notice && <p className="text-sm text-gray-600">{notice}</p>}

      {isProvider && isActive && !dispute.providerResponse && (
        <form onSubmit={handleRespond} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h2 className="text-base font-semibold text-gray-900">Respond to dispute</h2>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            required
            minLength={10}
            maxLength={2000}
            placeholder="Explain your side of the dispute (10–2000 characters)"
            className="auth-input resize-none"
          />
          <input
            type="file"
            multiple
            onChange={(e) => setEvidence(Array.from(e.target.files ?? []))}
            className="block w-full text-sm text-gray-500"
          />
          <button type="submit" disabled={submitting} className="btn-pill">
            {submitting ? 'Submitting…' : 'Submit response'}
          </button>
        </form>
      )}

      {(isProvider || isCustomer) && isActive && (
        <form onSubmit={handleAddEvidence} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h2 className="text-base font-semibold text-gray-900">Add evidence</h2>
          <input
            type="file"
            multiple
            onChange={(e) => setEvidence(Array.from(e.target.files ?? []))}
            className="block w-full text-sm text-gray-500"
          />
          <button type="submit" disabled={submitting || !evidence.length} className="btn-pill-outline">
            {submitting ? 'Uploading…' : 'Upload evidence'}
          </button>
        </form>
      )}
    </div>
  );
}
