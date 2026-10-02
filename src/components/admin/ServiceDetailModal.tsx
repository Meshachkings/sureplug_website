import { useEffect } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon, Delete02Icon } from '@hugeicons/core-free-icons';
import { ProviderBadges } from '../VerifiedBadge';
import { isUserVerified } from '../../lib/disputes';
import type { AdminService } from '../../lib/adminApi';
import StatusBadge from './StatusBadge';
import { formatNaira } from '../../lib/format';

type Props = {
  service: AdminService;
  onClose: () => void;
  onDelete: (service: AdminService) => void;
};

function MetaItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50/60 px-3.5 py-3">
      <p className="text-[11px] font-medium text-gray-400 mb-1">{label}</p>
      <div className="text-sm font-semibold text-gray-900">{children}</div>
    </div>
  );
}

export default function ServiceDetailModal({ service, onClose, onDelete }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const cover = service.images?.[0]?.url;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6">
      <div className="absolute inset-0 bg-black/55 backdrop-blur-[6px]" onClick={onClose} aria-hidden="true" />

      <div className="relative z-10 w-full sm:max-w-[420px] bg-white rounded-t-[1.75rem] sm:rounded-[1.75rem] shadow-[0_24px_80px_rgba(0,0,0,0.28)] flex flex-col max-h-[92vh] overflow-hidden">
        <div className="relative shrink-0">
          {cover ? (
            <img src={cover} alt="" className="h-40 w-full object-cover" />
          ) : (
            <div
              className="h-28"
              style={{
                background:
                  'radial-gradient(ellipse 90% 120% at 50% 0%, #2a5044 0%, transparent 60%), linear-gradient(180deg, #0f1c18 0%, #1a322c 100%)',
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/25 text-white backdrop-blur-sm transition-colors hover:bg-black/40"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={2} color="currentColor" />
          </button>
          <div className="absolute bottom-4 left-5 right-12">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/60 mb-1">Service</p>
            <h2 className="text-lg font-semibold text-white leading-snug line-clamp-2">{service.title}</h2>
          </div>
        </div>

        <div className="overflow-y-auto min-h-0 px-5 sm:px-6 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-2.5">
            <MetaItem label="Category">{service.category?.name ?? 'Uncategorized'}</MetaItem>
            <MetaItem label="Status"><StatusBadge status={service.status} /></MetaItem>
            <MetaItem label="Price">
              {formatNaira(service.price)}
              <span className="ml-1 text-xs font-medium text-gray-400">/hr</span>
            </MetaItem>
            <MetaItem label="Created">
              {new Date(service.createdAt).toLocaleDateString('en-NG', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </MetaItem>
          </div>

          {service.images && service.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {service.images.slice(1).map((img, i) => (
                <img
                  key={img._id ?? i}
                  src={img.url}
                  alt=""
                  className="h-20 w-28 rounded-xl object-cover shrink-0 border border-gray-100"
                />
              ))}
            </div>
          )}

          <div>
            <p className="text-[11px] font-medium text-gray-400 mb-2">Plug</p>
            {service.provider ? (
              <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50/70 p-3">
                {service.provider.avatar?.url ? (
                  <img
                    src={service.provider.avatar.url}
                    alt=""
                    className="h-11 w-11 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-mint/10 text-sm font-bold text-mint shrink-0">
                    {(service.provider.firstName?.[0] ?? '?')}
                    {(service.provider.lastName?.[0] ?? '')}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {service.provider.firstName} {service.provider.lastName}
                    </p>
                    <ProviderBadges
                      isVerified={isUserVerified(service.provider)}
                      isPremium={service.provider.isPremium}
                      size={15}
                    />
                  </div>
                  <p className="text-xs text-gray-400 truncate">{service.provider.email}</p>
                  {service.provider.suretag && (
                    <p className="text-xs font-medium text-mint">@{service.provider.suretag}</p>
                  )}
                </div>
              </div>
            ) : (
              <p className="rounded-2xl border border-gray-100 bg-gray-50 px-3 py-3 text-sm text-gray-400">
                Unknown plug
              </p>
            )}
          </div>
        </div>

        <div className="shrink-0 border-t border-gray-100 px-5 sm:px-6 py-4 grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onDelete(service);
              onClose();
            }}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600"
          >
            <HugeiconsIcon icon={Delete02Icon} size={14} strokeWidth={2} color="currentColor" />
            Delete
          </button>
        </div>

        <div className="h-[env(safe-area-inset-bottom)] bg-white sm:hidden shrink-0" />
      </div>
    </div>
  );
}
