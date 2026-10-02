import { useEffect, type ComponentType, type ReactNode } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Cancel01Icon,
  Call02Icon,
  Calendar03Icon,
  Clock01Icon,
  Location01Icon,
  Mail01Icon,
} from '@hugeicons/core-free-icons';
import type { AdminBooking, BookingStatus } from '../../lib/adminApi';
import StatusBadge from './StatusBadge';
import { formatNaira } from '../../lib/format';
import { bookingScheduleLabel, customerLabel } from './bookingHelpers';

type Props = {
  booking: AdminBooking;
  onClose: () => void;
  onStatusChange: (status: BookingStatus) => void;
  StatusSelect: ComponentType<{
    value: BookingStatus;
    onChange: (s: BookingStatus) => void;
    size?: 'sm' | 'md';
  }>;
};

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 mb-2.5">
        {title}
      </p>
      {children}
    </section>
  );
}

function MetaChip({
  icon,
  label,
  value,
}: {
  icon: typeof Call02Icon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/70 px-3.5 py-3">
      <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-slate-400 border border-slate-100">
        <HugeiconsIcon icon={icon} size={15} strokeWidth={1.8} color="currentColor" />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] text-slate-400">{label}</p>
        <p className="text-sm font-medium text-slate-900 break-words">{value}</p>
      </div>
    </div>
  );
}

export default function BookingDetailModal({
  booking,
  onClose,
  onStatusChange,
  StatusSelect,
}: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const customer = customerLabel(booking);
  const service = booking.service;
  const cover = service?.images?.[0]?.url;
  const schedule = bookingScheduleLabel(booking);
  const initials = booking.user
    ? `${booking.user.firstName?.[0] ?? ''}${booking.user.lastName?.[0] ?? ''}`.toUpperCase() || '?'
    : '?';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6">
      <div className="absolute inset-0 bg-black/55 backdrop-blur-[6px]" onClick={onClose} aria-hidden="true" />

      <div className="relative z-10 w-full sm:max-w-[480px] bg-white rounded-t-[1.75rem] sm:rounded-[1.75rem] shadow-[0_24px_80px_rgba(0,0,0,0.28)] flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header media */}
        <div className="relative shrink-0">
          {cover ? (
            <img src={cover} alt="" className="h-40 w-full object-cover" />
          ) : (
            <div className="h-28 bg-gradient-to-br from-slate-800 to-slate-600" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/45"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={2} color="currentColor" />
          </button>
          <div className="absolute bottom-4 left-5 right-14">
            <div className="mb-2">
              <StatusBadge status={booking.status} />
            </div>
            <h2 className="text-lg font-semibold text-white leading-snug line-clamp-2">
              {service?.title ?? 'Deleted service'}
            </h2>
            {typeof service?.price === 'number' && (
              <p className="mt-1 text-sm font-medium text-white/80">
                {formatNaira(service.price)}
                <span className="text-white/50 font-normal"> /hr</span>
              </p>
            )}
          </div>
        </div>

        <div className="overflow-y-auto min-h-0 px-5 sm:px-6 py-5 space-y-5">
          {/* Customer */}
          <Section title="Customer">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5">
              {booking.user?.avatar?.url ? (
                <img
                  src={booking.user.avatar.url}
                  alt=""
                  className="h-12 w-12 rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-600 shrink-0">
                  {initials}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900 truncate">{customer}</p>
                {booking.user?.email && (
                  <p className="text-xs text-slate-400 truncate">{booking.user.email}</p>
                )}
                {booking.user?.suretag && (
                  <p className="text-xs font-medium text-slate-500">@{booking.user.suretag}</p>
                )}
              </div>
            </div>
          </Section>

          {/* Schedule + contact */}
          <Section title="Details">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <MetaChip icon={Calendar03Icon} label="Scheduled" value={schedule} />
              <MetaChip
                icon={Clock01Icon}
                label="Created"
                value={new Date(booking.createdAt).toLocaleString('en-NG', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              />
              {booking.user?.phone && (
                <MetaChip icon={Call02Icon} label="Phone" value={booking.user.phone} />
              )}
              {booking.user?.email && (
                <MetaChip icon={Mail01Icon} label="Email" value={booking.user.email} />
              )}
              {(service?.address || service?.state) && (
                <div className="sm:col-span-2">
                  <MetaChip
                    icon={Location01Icon}
                    label="Service location"
                    value={[service?.address, service?.state, service?.country].filter(Boolean).join(', ')}
                  />
                </div>
              )}
            </div>
          </Section>

          {/* Request */}
          {(booking.description || booking.note) && (
            <Section title="Request">
              <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3.5">
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {booking.description || booking.note}
                </p>
              </div>
            </Section>
          )}

          {/* Attachments */}
          {(booking.attachments?.length ?? 0) > 0 && (
            <Section title={`Attachments (${booking.attachments!.length})`}>
              <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                {booking.attachments!.map((file) => (
                  <a
                    key={file._id ?? file.path}
                    href={file.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 overflow-hidden rounded-xl border border-slate-100 hover:opacity-90 transition-opacity"
                  >
                    <img
                      src={file.path}
                      alt={file.filename ?? 'Attachment'}
                      className="h-24 w-28 object-cover"
                    />
                  </a>
                ))}
              </div>
            </Section>
          )}

          {/* Service description */}
          {service?.description && (
            <Section title="Service">
              <p className="text-sm text-slate-600 leading-relaxed">{service.description}</p>
            </Section>
          )}

          <Section title="Status">
            <StatusSelect value={booking.status} onChange={onStatusChange} />
          </Section>

          <p className="text-[11px] font-mono text-slate-400 break-all">ID: {booking._id}</p>
        </div>

        <div className="shrink-0 border-t border-slate-100 px-5 sm:px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            Close
          </button>
        </div>

        <div className="h-[env(safe-area-inset-bottom)] bg-white sm:hidden shrink-0" />
      </div>
    </div>
  );
}
