import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, type ApiResponse } from '../../lib/api';
import {
  type BookingsResponse,
  type BookingStatus,
  BOOKING_STATUS_LABELS,
  type UserBooking,
} from '../../lib/bookings';

const STATUS_FILTERS: Array<{ value: BookingStatus | ''; label: string }> = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function DashboardBookings() {
  const [bookings, setBookings] = useState<UserBooking[]>([]);
  const [status, setStatus] = useState<BookingStatus | ''>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ page: String(page), limit: '10' });
      if (status) params.set('status', status);
      const res = await api.get<ApiResponse<BookingsResponse>>(`/bookings?${params}`, true);
      setBookings(res.data.bookings);
      setTotalPages(res.data.pagination.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }, [page, status]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return (
    <div className="max-w-3xl space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Bookings</h1>
        <p className="mt-1 text-sm text-gray-500">Track your service bookings and open disputes when needed.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((option) => (
          <button
            key={option.label}
            type="button"
            onClick={() => { setStatus(option.value); setPage(1); }}
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
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center text-sm text-gray-500">
          No bookings found.
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => (
            <Link
              key={booking._id}
              to={`/dashboard/bookings/${booking._id}`}
              className="block bg-white rounded-2xl border border-gray-100 p-5 hover:border-gray-200 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{booking.service.title}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    {new Date(booking.scheduledDate ?? booking.date ?? booking.createdAt).toLocaleDateString('en-NG')}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-700">
                  {BOOKING_STATUS_LABELS[booking.status]}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="disabled:opacity-40">
            Previous
          </button>
          <span>Page {page} of {totalPages}</span>
          <button type="button" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="disabled:opacity-40">
            Next
          </button>
        </div>
      )}
    </div>
  );
}
