export type DisputeReason =
  | 'service_not_delivered'
  | 'poor_quality'
  | 'payment_issue'
  | 'provider_no_show'
  | 'other';

export type DisputeStatus =
  | 'open'
  | 'under_review'
  | 'resolved_customer'
  | 'resolved_provider'
  | 'closed';

export const DISPUTE_REASONS: Array<{ value: DisputeReason; label: string }> = [
  { value: 'service_not_delivered', label: 'Service not delivered' },
  { value: 'poor_quality', label: 'Poor quality' },
  { value: 'payment_issue', label: 'Payment issue' },
  { value: 'provider_no_show', label: 'Provider no-show' },
  { value: 'other', label: 'Other' },
];

export const DISPUTE_STATUSES: Array<{ value: DisputeStatus | ''; label: string }> = [
  { value: '', label: 'All statuses' },
  { value: 'open', label: 'Open' },
  { value: 'under_review', label: 'Under review' },
  { value: 'resolved_customer', label: 'Resolved (customer)' },
  { value: 'resolved_provider', label: 'Resolved (provider)' },
  { value: 'closed', label: 'Closed' },
];

export const ACTIVE_DISPUTE_STATUSES: DisputeStatus[] = ['open', 'under_review'];

export type DisputeEvidence = {
  path: string;
  filename: string;
  size?: number;
  mimetype?: string;
};

export type Dispute = {
  _id: string;
  booking: {
    _id: string;
    status: string;
    description?: string;
    date?: string;
    time?: string;
    user?: { _id: string; firstName: string; lastName: string; avatar?: { url: string } | null };
    service?: {
      _id: string;
      title: string;
      userId?: { _id: string; firstName: string; lastName: string };
    };
    address?: { street?: string; city?: string; state?: string };
  };
  raisedBy: { _id: string; firstName: string; lastName: string };
  provider: { _id: string; firstName: string; lastName: string };
  reason: DisputeReason;
  description: string;
  evidence: DisputeEvidence[];
  providerResponse: string | null;
  providerRespondedAt: string | null;
  status: DisputeStatus;
  adminNote?: string | null;
  resolution?: string | null;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export function disputeReasonLabel(reason: DisputeReason): string {
  return DISPUTE_REASONS.find((r) => r.value === reason)?.label ?? reason;
}

export function disputeStatusLabel(status: DisputeStatus): string {
  return DISPUTE_STATUSES.find((s) => s.value === status)?.label ?? status.replace(/_/g, ' ');
}

export function isUserVerified(user: { isVerified?: boolean; businessVerified?: boolean }): boolean {
  return Boolean(user.isVerified || user.businessVerified);
}
