import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { Search01Icon, ArrowDown01Icon, Tick01Icon } from '@hugeicons/core-free-icons';

export interface FilterSelectOption {
  label: string;
  value: string;
}

interface FilterSelectProps {
  value: string;
  options: FilterSelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
}

type MenuPosition = {
  left: number;
  top: number;
  minWidth: number;
  placement: 'up' | 'down';
};

export function FilterSelect({ value, options, onChange }: FilterSelectProps) {
  const [open, setOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value) ?? options[0];
  const isDefault = value === '' || value === options[0]?.value;

  useLayoutEffect(() => {
    if (!open || !buttonRef.current) return;

    const updatePosition = () => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      const menuHeight = menuRef.current?.offsetHeight ?? 220;
      const spaceBelow = window.innerHeight - rect.bottom;
      const placement: 'up' | 'down' =
        spaceBelow < menuHeight + 12 && rect.top > spaceBelow ? 'up' : 'down';

      setMenuPosition({
        left: Math.min(rect.left, window.innerWidth - Math.max(rect.width, 160) - 8),
        top: placement === 'up' ? rect.top - 6 : rect.bottom + 6,
        minWidth: Math.max(rect.width, 160),
        placement,
      });
    };

    updatePosition();
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
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={`flex items-center gap-2 pl-3.5 pr-2.5 py-2.5 rounded-xl text-sm font-medium border transition-colors whitespace-nowrap ${
          isDefault
            ? 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
            : 'bg-[#019B5F]/8 border-[#019B5F]/30 text-[#019B5F]'
        }`}
      >
        <span>{selected?.label}</span>
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          size={13}
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
              minWidth: menuPosition?.minWidth ?? 160,
              transform: menuPosition?.placement === 'up' ? 'translateY(-100%)' : undefined,
              zIndex: 10000,
              visibility: menuPosition ? 'visible' : 'hidden',
            }}
            className="bg-white rounded-xl shadow-xl border border-gray-100 py-1 max-h-64 overflow-y-auto"
          >
            {options.map((opt) => {
              const active = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 text-sm text-left transition-colors ${
                    active
                      ? 'bg-[#019B5F]/8 text-[#019B5F] font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span>{opt.label}</span>
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

interface AdminFilterBarProps {
  search?: string;
  onSearchChange?: (value: string) => void;
  onSearchSubmit?: (e: React.FormEvent) => void;
  searchPlaceholder?: string;
  children?: React.ReactNode;
}

export default function AdminFilterBar({
  search,
  onSearchChange,
  onSearchSubmit,
  searchPlaceholder = 'Search...',
  children,
}: AdminFilterBarProps) {
  const hasSearch = search !== undefined && onSearchChange !== undefined;

  return (
    <form
      onSubmit={onSearchSubmit ?? ((e) => e.preventDefault())}
      className="flex flex-wrap gap-2 mb-5 items-center"
    >
      {hasSearch && (
        <div className="relative flex-1 min-w-0 sm:min-w-[220px] sm:max-w-xs">
          <HugeiconsIcon
            icon={Search01Icon}
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            strokeWidth={1.75}
          />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#019B5F]/25 focus:border-[#019B5F] transition-colors placeholder:text-gray-400"
          />
        </div>
      )}

      {children}

      {hasSearch && (
        <button
          type="submit"
          className="px-4 py-2.5 text-sm font-semibold bg-[#019B5F] text-white rounded-xl hover:bg-[#017a4c] transition-colors whitespace-nowrap"
        >
          Search
        </button>
      )}
    </form>
  );
}
