export { api } from './api';
export type { ApiResponse, ApiPagination } from './api';

// ── Dashboard ────────────────────────────────────────────────────────────────

export interface AdminDashboardData {
  users: {
    total: number;
    providers: number;
    newThisMonth: number;
  };
  services: { total: number };
  bookings: {
    total: number;
    pending: number;
    completed: number;
  };
  reviews: { total: number };
  verifications: {
    total: number;
    successful: number;
  };
  revenue: { total: number };
  contacts: { total: number };
  waitlist: { total: number };
}

// ── Users ─────────────────────────────────────────────────────────────────────

export interface AdminUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'user' | 'seller' | 'admin';
  suretag?: string;
  verified: boolean;
  providerVerified: boolean;
  isBlocked: boolean;
  avatar: { url: string } | null;
  createdAt: string;
}

export interface AdminUserDetail {
  user: AdminUser;
  stats: {
    serviceCount: number;
    bookingCount: number;
    reviewCount: number;
  };
}

export type UserRole = 'user' | 'seller' | 'admin';

// ── Services ──────────────────────────────────────────────────────────────────

export interface AdminService {
  _id: string;
  title: string;
  price: number;
  status: string;
  createdAt: string;
  images?: Array<{ url: string; _id?: string }>;
  provider: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    suretag: string;
    providerVerified: boolean;
    avatar?: { url: string } | null;
  };
  category: {
    _id: string;
    name: string;
  };
}

// ── Bookings ──────────────────────────────────────────────────────────────────

export type BookingStatus =
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface AdminBooking {
  _id: string;
  status: BookingStatus;
  note?: string;
  scheduledDate?: string;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  service: {
    title: string;
    price: number;
  };
}

// ── Reviews ───────────────────────────────────────────────────────────────────

export interface AdminReview {
  _id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  service: { title: string } | null;
}

// ── Verifications ─────────────────────────────────────────────────────────────

export type VerificationStatus = 'pending' | 'successful' | 'failed';

export interface AdminVerification {
  _id: string;
  reference: string;
  amount: number;
  status: VerificationStatus;
  paidAt?: string;
  createdAt: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    suretag?: string;
    providerVerified: boolean;
  };
}

// ── Contacts ──────────────────────────────────────────────────────────────────

export interface AdminContact {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

// ── Waitlist ──────────────────────────────────────────────────────────────────

export interface AdminWaitlistEntry {
  _id: string;
  email: string;
  phone?: string;
  service?: string;
  createdAt: string;
}
