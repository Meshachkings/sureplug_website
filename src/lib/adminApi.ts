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
  role: 'user' | 'seller' | 'subadmin' | 'admin';
  accountType?: 'customer' | 'handyman' | 'business';
  suretag?: string;
  bio?: string;
  verified: boolean;
  providerVerified: boolean;
  providerVerificationExpiresAt?: string | null;
  businessVerified?: boolean;
  autoRenewEnabled?: boolean;
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

export type UserRole = 'user' | 'seller' | 'subadmin' | 'admin';

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
    accountType?: string;
    providerVerified: boolean;
    providerVerificationExpiresAt?: string | null;
  };
}

// ── Business Verifications ────────────────────────────────────────────────────

export type BusinessVerificationStatus =
  | 'awaiting_payment'
  | 'awaiting_documents'
  | 'pending_review'
  | 'approved'
  | 'rejected';

export interface AdminBusinessVerification {
  _id: string;
  businessName: string;
  status: BusinessVerificationStatus;
  paymentStatus?: string;
  paidAt?: string;
  adminNote?: string | null;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  documents: Array<{
    path: string;
    filename: string;
    size: number;
    mimetype: string;
  }>;
  createdAt: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    accountType?: string;
    businessVerified: boolean;
  };
}

// ── Staff ─────────────────────────────────────────────────────────────────────

export const STAFF_PERMISSIONS = [
  'view_dashboard',
  'manage_users',
  'manage_services',
  'manage_bookings',
  'manage_reviews',
  'manage_verifications',
  'manage_business_verifications',
  'manage_categories',
  'manage_contacts',
  'manage_waitlist',
  'send_notifications',
  'manage_staff',
] as const;

export type StaffPermission = (typeof STAFF_PERMISSIONS)[number];

export interface AdminStaff {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'subadmin';
  verified: boolean;
  permissions: StaffPermission[];
  createdAt: string;
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
