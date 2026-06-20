import { useEffect, useRef, useState } from 'react';
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

export function FilterSelect({ value, options, onChange }: FilterSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value) ?? options[0];
  const isDefault = value === '' || value === options[0]?.value;

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

      {open && (
        <div className="absolute left-0 top-full mt-1.5 z-30 min-w-[160px] bg-white rounded-xl shadow-lg border border-gray-100 py-1 overflow-hidden">
          {options.map((opt) => {
            const active = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`w-full flex items-center justify-between gap-3 px-3.5 py-2 text-sm text-left transition-colors ${
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
        </div>
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
