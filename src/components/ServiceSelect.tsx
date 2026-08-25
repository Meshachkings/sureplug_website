import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowDown01Icon, Cancel01Icon, Search01Icon, Tick01Icon } from '@hugeicons/core-free-icons';
import { serviceCategories } from '../data/serviceCategories';

type ServiceSelectProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

function filterGroups(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return serviceCategories;

  return serviceCategories
    .map((group) => ({
      category: group.category,
      services: group.services.filter(
        (service) =>
          service.toLowerCase().includes(q) || group.category.toLowerCase().includes(q)
      ),
    }))
    .filter((group) => group.services.length > 0);
}

const ServiceSelect = ({
  id = 'waitlist-service',
  value,
  onChange,
  placeholder = 'Search a service',
}: ServiceSelectProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const [activeIndex, setActiveIndex] = useState(0);

  const groups = useMemo(() => filterGroups(query), [query]);
  const flat = useMemo(
    () => groups.flatMap((group) => group.services.map((service) => ({ category: group.category, service }))),
    [groups]
  );

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setQuery(value);
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [value]);

  const selectService = (service: string) => {
    onChange(service);
    setQuery(service);
    setOpen(false);
    setActiveIndex(0);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!open && (event.key === 'ArrowDown' || event.key === 'Enter')) {
      event.preventDefault();
      setOpen(true);
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      setQuery(value);
      return;
    }

    if (!open || flat.length === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % flat.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((current) => (current - 1 + flat.length) % flat.length);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const match = flat[activeIndex];
      if (match) selectService(match.service);
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <label htmlFor={id} className="sr-only">
        Service
      </label>
      <div className="flex items-center">
        <span className="pl-4 text-gray-400">
          <HugeiconsIcon icon={Search01Icon} size={15} color="currentColor" strokeWidth={2} />
        </span>
        <input
          ref={inputRef}
          id={id}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={`${id}-listbox`}
          aria-autocomplete="list"
          autoComplete="off"
          value={query}
          placeholder={placeholder}
          onFocus={() => {
            setOpen(true);
            setActiveIndex(0);
          }}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
            setActiveIndex(0);
            if (value) onChange('');
          }}
          onKeyDown={handleKeyDown}
          className="min-w-0 flex-1 bg-transparent py-3.5 pl-2.5 pr-2 text-sm text-gray-900 outline-none placeholder:text-gray-400"
        />
        {query ? (
          <button
            type="button"
            aria-label="Clear service"
            className="mr-2 flex h-7 w-7 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            onClick={() => {
              setQuery('');
              onChange('');
              setOpen(true);
              inputRef.current?.focus();
            }}
          >
            <HugeiconsIcon icon={Cancel01Icon} size={14} color="currentColor" strokeWidth={2} />
          </button>
        ) : (
          <span className="pr-3.5 text-gray-400">
            <HugeiconsIcon icon={ArrowDown01Icon} size={16} color="currentColor" strokeWidth={2} />
          </span>
        )}
      </div>

      {open && (
        <div
          id={`${id}-listbox`}
          role="listbox"
          className="absolute left-0 right-0 top-[calc(100%+6px)] z-30 max-h-64 overflow-y-auto rounded-2xl border border-gray-100 bg-white py-1.5 text-left shadow-[0_16px_40px_rgba(0,0,0,0.12)]"
        >
          {flat.length === 0 ? (
            <p className="px-4 py-3 text-sm text-gray-400">No matching services</p>
          ) : (
            groups.map((group) => (
              <div key={group.category}>
                <p className="px-4 pb-1 pt-2.5 text-[11px] font-medium uppercase tracking-[0.12em] text-gray-400">
                  {group.category}
                </p>
                {group.services.map((service) => {
                  const index = flat.findIndex((item) => item.service === service && item.category === group.category);
                  const active = index === activeIndex;
                  const selected = value === service;
                  return (
                    <button
                      key={`${group.category}-${service}`}
                      type="button"
                      role="option"
                      aria-selected={selected}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => selectService(service)}
                      className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors ${
                        active ? 'bg-gray-50 text-gray-900' : 'text-gray-700'
                      }`}
                    >
                      <span>{service}</span>
                      {selected && (
                        <HugeiconsIcon icon={Tick01Icon} size={14} color="#019B5F" strokeWidth={2} />
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ServiceSelect;
