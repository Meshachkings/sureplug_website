import type { ApiPagination } from './api';

export type BookingStatus =
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type UserBooking = {
  _id: string;
  status: BookingStatus;
  description?: string;
  note?: string;
  date?: string;
  time?: string;
  scheduledDate?: string;
  createdAt: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email?: string;
    avatar?: { url: string } | null;
  };
  service: {
    _id: string;
    title: string;
    price?: number;
    userId?: {
      _id: string;
      firstName: string;
      lastName: string;
    };
  };
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
  };
};

export type BookingsResponse = {
  bookings: UserBooking[];
  pagination: ApiPagination;
};

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  pending: 'Pending',
  accepted: 'Accepted',
  rejected: 'Rejected',
  in_progress: 'In progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const DISPUTABLE_BOOKING_STATUSES: BookingStatus[] = ['in_progress', 'completed'];
