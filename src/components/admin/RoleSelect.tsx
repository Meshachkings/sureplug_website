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

type MenuPosition = {
  left: number;
  top: number;
  minWidth: number;
  placement: 'up' | 'down';
};

type Props = {
  value: UserRole;
  onChange: (role: UserRole) => void;
  size?: 'sm' | 'md';
  /** @deprecated Menus now auto-place; kept for call-site compatibility */
  dropUp?: boolean;
  className?: string;
};

export default function RoleSelect({ value, onChange, size = 'md', className = '' }: Props) {
  const [open, setOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!open || !buttonRef.current) return;

    const updatePosition = () => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      const menuHeight = menuRef.current?.offsetHeight ?? 180;
      const spaceBelow = window.innerHeight - rect.bottom;
      const placement: 'up' | 'down' =
        spaceBelow < menuHeight + 12 && rect.top > spaceBelow ? 'up' : 'down';

      setMenuPosition({
        left: Math.min(rect.left, window.innerWidth - Math.max(rect.width, 140) - 8),
        top: placement === 'up' ? rect.top - 6 : rect.bottom + 6,
        minWidth: Math.max(rect.width, 140),
        placement,
      });
    };

    updatePosition();
    // Re-measure after menu mounts so height is accurate
    requestAnimationFrame(updatePosition);

    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (rootRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handler);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={`relative shrink-0 ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={`inline-flex w-full items-center justify-between gap-1.5 rounded-xl font-semibold transition-colors ${ROLE_STYLES[value]} ${
          size === 'sm' ? 'px-2.5 py-1.5 text-xs' : 'px-3.5 py-2.5 text-sm'
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

      {open &&
        createPortal(
          <div
            ref={menuRef}
            role="listbox"
            style={{
              position: 'fixed',
              left: menuPosition?.left ?? 0,
              top: menuPosition?.top ?? 0,
              minWidth: menuPosition?.minWidth ?? 140,
              transform: menuPosition?.placement === 'up' ? 'translateY(-100%)' : undefined,
              zIndex: 10000,
              visibility: menuPosition ? 'visible' : 'hidden',
            }}
            className="bg-white rounded-xl shadow-xl border border-gray-100 py-1 max-h-56 overflow-y-auto"
          >
            {ROLES.map((r) => {
              const active = r.value === value;
              return (
                <button
                  key={r.value}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    onChange(r.value);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 text-sm text-left transition-colors ${
                    active
                      ? `${ROLE_STYLES[r.value]} font-semibold`
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
          </div>,
          document.body
        )}
    </div>
  );
}
