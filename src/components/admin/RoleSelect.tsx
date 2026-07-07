import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowDown01Icon, Tick01Icon } from '@hugeicons/core-free-icons';
import type { UserRole } from '../../lib/adminApi';

const ROLES: Array<{ value: UserRole; label: string }> = [
  { value: 'user', label: 'User' },
  { value: 'seller', label: 'Seller' },
  { value: 'subadmin', label: 'Subadmin' },
  { value: 'admin', label: 'Admin' },
];

const ROLE_STYLES: Record<UserRole, string> = {
  user: 'bg-gray-100 text-gray-700',
  seller: 'bg-blue-50 text-blue-700',
  subadmin: 'bg-slate-100 text-slate-700',
  admin: 'bg-purple-50 text-purple-700',
};

const ROLE_ACTIVE: Record<UserRole, string> = {
  user: 'bg-gray-100 text-gray-700',
  seller: 'bg-blue-50 text-blue-700',
  subadmin: 'bg-slate-100 text-slate-700',
  admin: 'bg-purple-50 text-purple-700',
};

type MenuPosition = {
  left: number;
  top?: number;
  minWidth: number;
};

type Props = {
  value: UserRole;
  onChange: (role: UserRole) => void;
  size?: 'sm' | 'md';
  dropUp?: boolean;
};

export default function RoleSelect({ value, onChange, size = 'md', dropUp = false }: Props) {
  const [open, setOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!open || !dropUp || !buttonRef.current) return;

    const updatePosition = () => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({
        left: rect.left,
        // anchor to the top edge of the button, then translateY(-100%) for "drop up"
        top: rect.top - 6,
        minWidth: Math.max(rect.width, 120),
      });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open, dropUp]);

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

  const menuItems = ROLES.map((r) => {
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
  });

  const menu = open ? (
    <div
      ref={dropUp ? menuRef : undefined}
      style={dropUp && menuPosition ? {
        position: 'fixed',
        left: menuPosition.left,
        top: menuPosition.top,
        minWidth: menuPosition.minWidth,
        transform: 'translateY(-100%)',
        zIndex: 9999,
      } : undefined}
      className={`bg-white rounded-xl shadow-lg border border-gray-100 py-1 ${
        dropUp ? '' : 'absolute left-0 top-full mt-1.5 z-50 min-w-[120px]'
      }`}
    >
      {menuItems}
    </div>
  ) : null;

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
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

      {dropUp ? (menu && createPortal(menu, document.body)) : menu}
    </div>
  );
}
