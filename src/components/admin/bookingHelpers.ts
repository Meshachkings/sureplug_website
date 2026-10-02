import type { AdminBooking } from '../../lib/adminApi';

export function customerLabel(booking: AdminBooking): string {
  if (!booking.user) return 'Unknown customer';
  const name = `${booking.user.firstName ?? ''} ${booking.user.lastName ?? ''}`.trim();
  return name || booking.user.email || 'Unknown customer';
}

export function bookingScheduleLabel(booking: AdminBooking): string {
  const dateSrc = booking.date || booking.scheduledDate;
  if (!dateSrc) return '—';

  const date = new Date(dateSrc);
  const datePart = date.toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  if (!booking.time) return datePart;

  const time = new Date(booking.time);
  const timePart = time.toLocaleTimeString('en-NG', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return `${datePart} · ${timePart}`;
}
