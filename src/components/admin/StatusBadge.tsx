interface Props {
  status?: string;
}

const colorMap: Record<string, string> = {
  // Booking statuses
  pending: 'bg-yellow-100 text-yellow-700',
  accepted: 'bg-blue-100 text-blue-700',
  rejected: 'bg-red-100 text-red-700',
  in_progress: 'bg-indigo-100 text-indigo-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-gray-100 text-gray-600',
  // Verification statuses
  successful: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
  // User / generic
  active: 'bg-green-100 text-green-700',
  blocked: 'bg-red-100 text-red-700',
  verified: 'bg-mint/10 text-mint-dark',
  email_verified: 'bg-mint/10 text-mint-dark',
  premium: 'bg-amber-100 text-amber-700',
  unverified: 'bg-gray-100 text-gray-500',
  open: 'bg-yellow-100 text-yellow-700',
  under_review: 'bg-indigo-100 text-indigo-700',
  resolved_customer: 'bg-green-100 text-green-700',
  resolved_provider: 'bg-blue-100 text-blue-700',
  closed: 'bg-gray-100 text-gray-600',
};

export default function StatusBadge({ status }: Props) {
  const normalized = (status ?? 'unknown').toLowerCase();
  const classes = colorMap[normalized] ?? 'bg-gray-100 text-gray-600';
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${classes}`}
    >
      {normalized.replace('_', ' ')}
    </span>
  );
}
