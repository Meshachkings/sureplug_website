import { useId } from 'react';

interface BadgeProps {
  size?: number;
  className?: string;
}

export function VerifiedBadge({ size = 18, className }: BadgeProps) {
  const uid = useId().replace(/:/g, '');
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-label="Verified Plug"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
    >
      <defs>
        <linearGradient id={`vbg${uid}`} x1="12" y1="2" x2="12" y2="23" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2dda89" />
          <stop offset="1" stopColor="#019B5F" />
        </linearGradient>
      </defs>
      {/* Shield body */}
      <path
        d="M12 2.25L20.5 5.5V13C20.5 17.8 16.8 21.2 12 22.5C7.2 21.2 3.5 17.8 3.5 13V5.5Z"
        fill={`url(#vbg${uid})`}
      />
      {/* Top shine */}
      <path
        d="M12 2.25L20.5 5.5V9.5C18 9.5 15.5 9.8 12 9.8C8.5 9.8 6 9.5 3.5 9.5V5.5Z"
        fill="white"
        fillOpacity="0.15"
      />
      {/* Checkmark */}
      <path
        d="M8 13L10.8 15.8L16.5 9.5"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function VerifiedPill({ label = 'Verified', size = 'sm' }: { label?: string; size?: 'sm' | 'md' }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold bg-[#019B5F]/10 text-[#019B5F] ${size === 'sm' ? 'text-[11px]' : 'text-xs'}`}>
      <VerifiedBadge size={size === 'sm' ? 12 : 14} />
      {label}
    </span>
  );
}

export function BusinessBadge({ size = 18, className }: BadgeProps) {
  const uid = useId().replace(/:/g, '');
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-label="Business Verified"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
    >
      <defs>
        <linearGradient id={`bbg${uid}`} x1="12" y1="2" x2="12" y2="23" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fcd34d" />
          <stop offset="1" stopColor="#d97706" />
        </linearGradient>
      </defs>
      {/* Shield body */}
      <path
        d="M12 2.25L20.5 5.5V13C20.5 17.8 16.8 21.2 12 22.5C7.2 21.2 3.5 17.8 3.5 13V5.5Z"
        fill={`url(#bbg${uid})`}
      />
      {/* Top shine */}
      <path
        d="M12 2.25L20.5 5.5V9.5C18 9.5 15.5 9.8 12 9.8C8.5 9.8 6 9.5 3.5 9.5V5.5Z"
        fill="white"
        fillOpacity="0.15"
      />
      {/* Building icon */}
      <rect x="8.5" y="11" width="7" height="6" rx="0.5" stroke="white" strokeWidth="1.6" fill="none" />
      <rect x="11" y="14" width="2" height="3" rx="0.3" fill="white" />
      <path d="M10.5 11V9.5H13.5V11" stroke="white" strokeWidth="1.6" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function BusinessPill({ label = 'Business', size = 'sm' }: { label?: string; size?: 'sm' | 'md' }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold bg-amber-50 text-amber-700 ${size === 'sm' ? 'text-[11px]' : 'text-xs'}`}>
      <BusinessBadge size={size === 'sm' ? 12 : 14} />
      {label}
    </span>
  );
}
