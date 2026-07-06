import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons';
import { useAuth } from '../../context/AuthContext';
import { api, type ApiResponse } from '../../lib/api';
import {
  BOOKING_STATUS_LABELS,
  DISPUTABLE_BOOKING_STATUSES,
  type UserBooking,
} from '../../lib/bookings';
import { DISPUTE_REASONS, type Dispute } from '../../lib/disputes';

export default function DashboardBookingDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [booking, setBooking] = useState<UserBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDisputeForm, setShowDisputeForm] = useState(false);
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [evidence, setEvidence] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.get<ApiResponse<UserBooking>>(`/bookings/${id}`, true)
      .then((res) => setBooking(res.data))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load booking'))
      .finally(() => setLoading(false));
  }, [id]);

  const isCustomer = user?._id === booking?.user._id;
  const canDispute = Boolean(
    booking && isCustomer && DISPUTABLE_BOOKING_STATUSES.includes(booking.status),
  );

  const handleOpenDispute = async (event: FormEvent) => {
    event.preventDefault();
    if (!booking || !reason || !description.trim()) return;
    setSubmitting(true);
    setNotice('');
    try {
      const form = new FormData();
      form.append('booking', booking._id);
      form.append('reason', reason);
      form.append('description', description.trim());
      evidence.forEach((file) => form.append('evidence', file));
      const res = await api.post<ApiResponse<Dispute>>('/disputes', form, true);
      navigate(`/dashboard/disputes/${res.data._id}`);
    } catch (err) {
      setNotice(err instanceof Error ? err.message : 'Failed to open dispute');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="h-40 bg-white rounded-2xl border border-gray-100 animate-pulse" />;
  }

  if (error || !booking) {
    return (
      <div className="max-w-2xl">
        <p className="text-sm text-red-600">{error || 'Booking not found'}</p>
        <Link to="/dashboard/bookings" className="btn-link mt-4">Back to bookings</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-5">
      <Link to="/dashboard/bookings" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900">
        <HugeiconsIcon icon={ArrowLeft01Icon} size={15} color="currentColor" strokeWidth={2} />
        Back to bookings
      </Link>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">{booking.service.title}</h1>
            <p className="mt-1 text-sm text-gray-500">
              Booked {new Date(booking.scheduledDate ?? booking.date ?? booking.createdAt).toLocaleString('en-NG')}
            </p>
          </div>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
            {BOOKING_STATUS_LABELS[booking.status]}
          </span>
        </div>

        {booking.description && (
          <p className="text-sm text-gray-600 leading-relaxed">{booking.description}</p>
        )}
        {booking.note && (
          <p className="text-sm text-gray-500"><span className="font-medium text-gray-700">Note:</span> {booking.note}</p>
        )}
        {booking.address && (
          <p className="text-sm text-gray-500">
            {[booking.address.street, booking.address.city, booking.address.state].filter(Boolean).join(', ')}
          </p>
        )}
      </div>

      {canDispute && !showDisputeForm && (
        <button type="button" onClick={() => setShowDisputeForm(true)} className="btn-pill">
          Open dispute
        </button>
      )}

      {showDisputeForm && (
        <form onSubmit={handleOpenDispute} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <h2 className="text-base font-semibold text-gray-900">Open a dispute</h2>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            className="auth-input"
          >
            <option value="">Select a reason</option>
            {DISPUTE_REASONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            required
            minLength={10}
            maxLength={2000}
            placeholder="Describe the issue (10–2000 characters)"
            className="auth-input resize-none"
          />
          <input
            type="file"
            multiple
            onChange={(e) => setEvidence(Array.from(e.target.files ?? []))}
            className="block w-full text-sm text-gray-500"
          />
          {notice && <p className="text-sm text-red-600">{notice}</p>}
          <div className="flex gap-2">
            <button type="submit" disabled={submitting} className="btn-pill">
              {submitting ? 'Submitting…' : 'Submit dispute'}
            </button>
            <button type="button" onClick={() => setShowDisputeForm(false)} className="btn-pill-outline">
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
