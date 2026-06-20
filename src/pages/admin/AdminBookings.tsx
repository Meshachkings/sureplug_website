import { useCallback, useEffect, useRef, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowDown01Icon, Tick01Icon } from '@hugeicons/core-free-icons';
import { api, type ApiResponse, type ApiPagination } from '../../lib/adminApi';
import type { AdminBooking, BookingStatus } from '../../lib/adminApi';
import StatusBadge from '../../components/admin/StatusBadge';
import Pagination from '../../components/admin/Pagination';
import AdminFilterBar, { FilterSelect } from '../../components/admin/AdminFilterBar';
import ConfirmModal from '../../components/admin/ConfirmModal';
import { formatNaira } from '../../lib/format';

interface BookingsResponse {
  bookings: AdminBooking[];
  pagination: ApiPagination;
}

const STATUS_OPTIONS: Array<{ label: string; value: string }> = [
  { label: 'All statuses', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'Accepted', value: 'accepted' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

const CHANGE_TO_OPTIONS: BookingStatus[] = [
  'pending',
  'accepted',
  'rejected',
  'in_progress',
  'completed',
  'cancelled',
];

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-50 text-yellow-700',
  accepted: 'bg-blue-50 text-blue-700',
  rejected: 'bg-red-50 text-red-600',
  in_progress: 'bg-purple-50 text-purple-700',
  completed: 'bg-green-50 text-green-700',
  cancelled: 'bg-gray-100 text-gray-500',
};

function BookingStatusSelect({
  value,
  onChange,
  size = 'md',
}: {
  value: BookingStatus;
  onChange: (s: BookingStatus) => void;
  size?: 'sm' | 'md';
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className={`relative ${size === 'md' ? 'w-full' : 'inline-flex'}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 rounded-lg font-semibold capitalize transition-colors ${STATUS_COLORS[value] ?? 'bg-gray-100 text-gray-600'} ${
          size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-2.5 text-sm w-full justify-between'
        }`}
      >
        <span>{value.replace('_', ' ')}</span>
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          size={size === 'sm' ? 11 : 13}
          strokeWidth={2.5}
          color="currentColor"
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className={`absolute z-30 mt-1.5 bg-white rounded-xl shadow-lg border border-gray-100 py-1 overflow-hidden min-w-[140px] ${size === 'sm' ? 'right-0' : 'left-0'} top-full`}>
          {CHANGE_TO_OPTIONS.map((s) => {
            const active = s === value;
            return (
              <button
                key={s}
                type="button"
                onClick={() => { onChange(s); setOpen(false); }}
                className={`w-full flex items-center justify-between gap-3 px-3.5 py-2 text-sm capitalize text-left transition-colors ${
                  active
                    ? `${STATUS_COLORS[s] ?? 'bg-gray-100 text-gray-600'} font-semibold`
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span>{s.replace('_', ' ')}</span>
                {active && <HugeiconsIcon icon={Tick01Icon} size={13} strokeWidth={2.5} color="currentColor" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [pagination, setPagination] = useState<ApiPagination | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [apiError, setApiError] = useState('');

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (statusFilter) params.set('status', statusFilter);
      const res = await api.get<ApiResponse<BookingsResponse>>(
        `/admin/bookings?${params.toString()}`,
        true
      );
      setBookings(res.data.bookings);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleStatusChange = async (booking: AdminBooking, newStatus: BookingStatus) => {
    try {
      await api.patch(`/admin/bookings/${booking._id}/status`, { status: newStatus }, true);
      setBookings((prev) =>
        prev.map((b) => (b._id === booking._id ? { ...b, status: newStatus } : b))
      );
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Failed to update booking status');
    }
  };

  return (
    <div>
      {apiError && (
        <ConfirmModal
          title="Something went wrong"
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
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center text-gray-400">No bookings found.</div>
      ) : (
        <>
          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {bookings.map((booking) => (
              <div key={booking._id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                {/* Header */}
                <button
                  className="w-full text-left"
                  onClick={() => setExpandedId(expandedId === booking._id ? null : booking._id)}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {booking.user.firstName} {booking.user.lastName}
                      </p>
                      <p className="text-sm text-gray-600 truncate">{booking.service.title}</p>
                      <p className="text-xs text-gray-400">{formatNaira(booking.service.price)}</p>
                    </div>
                    <div className="flex-shrink-0 flex flex-col items-end gap-1.5">
                      <StatusBadge status={booking.status} />
                      <span className="text-xs text-gray-400">
                        {booking.scheduledDate
                          ? new Date(booking.scheduledDate).toLocaleDateString()
                          : new Date(booking.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </button>
                {/* Status change */}
                <BookingStatusSelect
                  value={booking.status}
                  onChange={(s) => handleStatusChange(booking, s)}
                />
                {/* Expandable detail */}
                {expandedId === booking._id && (
                  <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Phone</p>
                      <p className="font-medium text-gray-800">{booking.user.phone ?? '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-0.5">Note</p>
                      <p className="font-medium text-gray-800">{booking.note ?? '—'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-gray-400 mb-0.5">Booking ID</p>
                      <p className="font-mono text-xs text-gray-600 break-all">{booking._id}</p>
                    </div>
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
                    <th className="px-4 py-3 text-left">Customer</th>
                    <th className="px-4 py-3 text-left">Service</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Scheduled</th>
                    <th className="px-4 py-3 text-left">Created</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {bookings.map((booking) => (
                    <>
                      <tr
                        key={booking._id}
                        className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                        onClick={() =>
                          setExpandedId(expandedId === booking._id ? null : booking._id)
                        }
                      >
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-900">
                            {booking.user.firstName} {booking.user.lastName}
                          </p>
                          <p className="text-xs text-gray-400">{booking.user.email}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-gray-700 max-w-[150px] truncate">
                            {booking.service.title}
                          </p>
                          <p className="text-xs text-gray-400">
                            {formatNaira(booking.service.price)}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={booking.status} />
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                          {booking.scheduledDate
                            ? new Date(booking.scheduledDate).toLocaleDateString()
                            : '—'}
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                          <BookingStatusSelect
                            value={booking.status}
                            onChange={(s) => handleStatusChange(booking, s)}
                            size="sm"
                          />
                        </td>
                      </tr>
                      {expandedId === booking._id && (
                        <tr key={`${booking._id}-detail`} className="bg-gray-50/70">
                          <td colSpan={6} className="px-6 py-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-xs text-gray-400 mb-0.5">Phone</p>
                                <p className="font-medium">{booking.user.phone ?? '—'}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-400 mb-0.5">Note</p>
                                <p className="font-medium">{booking.note ?? '—'}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-400 mb-0.5">Booking ID</p>
                                <p className="font-mono text-xs">{booking._id}</p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
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
