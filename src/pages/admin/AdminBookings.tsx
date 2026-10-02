import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowDown01Icon, Tick01Icon } from '@hugeicons/core-free-icons';
import { api, type ApiResponse, type ApiPagination } from '../../lib/adminApi';
import type { AdminBooking, BookingStatus } from '../../lib/adminApi';
import StatusBadge from '../../components/admin/StatusBadge';
import Pagination from '../../components/admin/Pagination';
import AdminFilterBar, { FilterSelect } from '../../components/admin/AdminFilterBar';
import ConfirmModal from '../../components/admin/ConfirmModal';
import BookingDetailModal from '../../components/admin/BookingDetailModal';
import { bookingScheduleLabel, customerLabel } from '../../components/admin/bookingHelpers';
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
  const [menuPosition, setMenuPosition] = useState<{
    left: number;
    top: number;
    minWidth: number;
    placement: 'up' | 'down';
  } | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!open || !buttonRef.current) return;
    const updatePosition = () => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      const menuHeight = menuRef.current?.offsetHeight ?? 220;
      const spaceBelow = window.innerHeight - rect.bottom;
      const placement: 'up' | 'down' =
        spaceBelow < menuHeight + 12 && rect.top > spaceBelow ? 'up' : 'down';
      const minWidth = Math.max(rect.width, 140);
      setMenuPosition({
        left: size === 'sm'
          ? Math.max(8, rect.right - minWidth)
          : Math.min(rect.left, window.innerWidth - minWidth - 8),
        top: placement === 'up' ? rect.top - 6 : rect.bottom + 6,
        minWidth,
        placement,
      });
    };
    updatePosition();
    requestAnimationFrame(updatePosition);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open, size]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (rootRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={rootRef} className={`relative ${size === 'md' ? 'w-full' : 'inline-flex'}`}>
      <button
        ref={buttonRef}
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

      {open &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: 'fixed',
              left: menuPosition?.left ?? 0,
              top: menuPosition?.top ?? 0,
              minWidth: menuPosition?.minWidth ?? 140,
              transform: menuPosition?.placement === 'up' ? 'translateY(-100%)' : undefined,
              zIndex: 10000,
              visibility: menuPosition ? 'visible' : 'hidden',
            }}
            className="bg-white rounded-xl shadow-xl border border-gray-100 py-1 max-h-64 overflow-y-auto"
          >
            {CHANGE_TO_OPTIONS.map((s) => {
              const active = s === value;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    onChange(s);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 text-sm capitalize text-left transition-colors ${
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
          </div>,
          document.body
        )}
    </div>
  );
}

function CustomerCell({ booking }: { booking: AdminBooking }) {
  const initials = booking.user
    ? `${booking.user.firstName?.[0] ?? ''}${booking.user.lastName?.[0] ?? ''}`.toUpperCase() || '?'
    : '?';

  return (
    <div className="flex items-center gap-3 min-w-0">
      {booking.user?.avatar?.url ? (
        <img
          src={booking.user.avatar.url}
          alt=""
          className="h-9 w-9 rounded-full object-cover shrink-0"
        />
      ) : (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-500 shrink-0">
          {initials}
        </div>
      )}
      <div className="min-w-0">
        <p className="font-semibold text-gray-900 truncate">{customerLabel(booking)}</p>
        {booking.user?.email ? (
          <p className="text-xs text-gray-400 mt-0.5 truncate">{booking.user.email}</p>
        ) : (
          <p className="text-xs text-gray-400 mt-0.5">No customer linked</p>
        )}
      </div>
    </div>
  );
}

function ServiceCell({ booking }: { booking: AdminBooking }) {
  const thumb = booking.service?.images?.[0]?.url;
  const attachmentCount = booking.attachments?.length ?? 0;

  return (
    <div className="flex items-center gap-3 min-w-0">
      {thumb ? (
        <img src={thumb} alt="" className="h-10 w-10 rounded-lg object-cover shrink-0" />
      ) : (
        <div className="h-10 w-10 rounded-lg bg-slate-100 shrink-0" />
      )}
      <div className="min-w-0">
        <p className="font-medium text-gray-900 max-w-[200px] truncate">
          {booking.service?.title ?? 'Deleted service'}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          {typeof booking.service?.price === 'number'
            ? formatNaira(booking.service.price)
            : 'No price'}
          {attachmentCount > 0 && (
            <span className="text-slate-300"> · </span>
          )}
          {attachmentCount > 0 && (
            <span>
              {attachmentCount} file{attachmentCount === 1 ? '' : 's'}
            </span>
          )}
        </p>
      </div>
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
  const [selectedBooking, setSelectedBooking] = useState<AdminBooking | null>(null);
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
      setSelectedBooking((prev) =>
        prev && prev._id === booking._id ? { ...prev, status: newStatus } : prev
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

      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onStatusChange={(s) => handleStatusChange(selectedBooking, s)}
          StatusSelect={BookingStatusSelect}
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
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center text-gray-400">No bookings found.</div>
      ) : (
        <>
          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {bookings.map((booking) => (
              <button
                key={booking._id}
                type="button"
                onClick={() => setSelectedBooking(booking)}
                className="w-full text-left bg-white rounded-2xl border border-gray-100 p-4 shadow-sm transition-colors active:bg-slate-50"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <CustomerCell booking={booking} />
                  <StatusBadge status={booking.status} />
                </div>
                <div className="flex items-center gap-3">
                  <ServiceCell booking={booking} />
                </div>
                <div className="mt-3 flex items-center justify-between gap-2 text-xs text-gray-400">
                  <span className="truncate">{bookingScheduleLabel(booking)}</span>
                  <span className="shrink-0 font-medium text-slate-500">View details</span>
                </div>
              </button>
            ))}
          </div>

          <div className="admin-table-wrap">
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Service</th>
                    <th>Status</th>
                    <th>Scheduled</th>
                    <th>Created</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr
                      key={booking._id}
                      className="cursor-pointer"
                      onClick={() => setSelectedBooking(booking)}
                    >
                      <td>
                        <CustomerCell booking={booking} />
                      </td>
                      <td>
                        <ServiceCell booking={booking} />
                      </td>
                      <td>
                        <StatusBadge status={booking.status} />
                      </td>
                      <td className="text-gray-500 text-xs whitespace-nowrap">
                        {bookingScheduleLabel(booking)}
                      </td>
                      <td className="text-gray-500 text-xs whitespace-nowrap">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </td>
                      <td className="text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedBooking(booking)}
                            className="admin-btn-secondary !px-2.5 !py-1.5 !text-xs"
                          >
                            Details
                          </button>
                          <BookingStatusSelect
                            value={booking.status}
                            onChange={(s) => handleStatusChange(booking, s)}
                            size="sm"
                          />
                        </div>
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
