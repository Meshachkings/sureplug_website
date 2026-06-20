import { useEffect, useRef, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowDown01Icon, Tick01Icon } from '@hugeicons/core-free-icons';
import type { UserRole } from '../../lib/adminApi';

const ROLES: Array<{ value: UserRole; label: string }> = [
  { value: 'user', label: 'User' },
  { value: 'seller', label: 'Seller' },
  { value: 'admin', label: 'Admin' },
];

const ROLE_STYLES: Record<UserRole, string> = {
  user: 'bg-gray-100 text-gray-700',
  seller: 'bg-blue-50 text-blue-700',
  admin: 'bg-purple-50 text-purple-700',
};

const ROLE_ACTIVE: Record<UserRole, string> = {
  user: 'bg-gray-100 text-gray-700',
  seller: 'bg-blue-50 text-blue-700',
  admin: 'bg-purple-50 text-purple-700',
};

type Props = {
  value: UserRole;
  onChange: (role: UserRole) => void;
  size?: 'sm' | 'md';
};

export default function RoleSelect({ value, onChange, size = 'md' }: Props) {
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
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 rounded-lg font-semibold transition-colors ${ROLE_STYLES[value]} ${
          size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-2.5 text-sm'
        }`}
      >
        <span>{ROLES.find((r) => r.value === value)?.label}</span>
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          size={size === 'sm' ? 11 : 13}
          strokeWidth={2.5}
          color="currentColor"
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1.5 z-30 min-w-[120px] bg-white rounded-xl shadow-lg border border-gray-100 py-1 overflow-hidden">
          {ROLES.map((r) => {
            const active = r.value === value;
            return (
              <button
                key={r.value}
                type="button"
                onClick={() => { onChange(r.value); setOpen(false); }}
                className={`w-full flex items-center justify-between gap-3 px-3.5 py-2 text-sm text-left transition-colors ${
                  active
                    ? `${ROLE_ACTIVE[r.value]} font-semibold`
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span>{r.label}</span>
                {active && (
                  <HugeiconsIcon icon={Tick01Icon} size={13} strokeWidth={2.5} color="currentColor" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
