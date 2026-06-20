import { useEffect } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon, CheckmarkBadge01Icon, Delete02Icon } from '@hugeicons/core-free-icons';
import type { AdminService } from '../../lib/adminApi';
import StatusBadge from './StatusBadge';
import { formatNaira } from '../../lib/format';

type Props = {
  service: AdminService;
  onClose: () => void;
  onDelete: (service: AdminService) => void;
};

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-gray-100 last:border-0">
      <span className="text-xs font-semibold uppercase tracking-[0.1em] text-gray-400 shrink-0 pt-0.5 w-28">{label}</span>
      <span className="text-sm text-gray-900 text-right">{children}</span>
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

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      <div className="relative z-10 w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden">
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between px-5 sm:px-6 pt-4 sm:pt-5 pb-4 border-b border-gray-100">
          <div className="min-w-0 pr-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400 mb-1">Service Details</p>
            <h2 className="text-base font-semibold text-gray-900 leading-snug line-clamp-2">{service.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors shrink-0"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={2} color="currentColor" />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[60vh] overflow-y-auto">
          {/* Image gallery */}
          {service.images && service.images.length > 0 && (
            <div className="flex gap-2 overflow-x-auto px-5 sm:px-6 pt-3 pb-2 scrollbar-none snap-x snap-mandatory">
              {service.images.map((img, i) => (
                <img
                  key={img._id ?? i}
                  src={img.url}
                  alt={`${service.title} ${i + 1}`}
                  className="h-36 w-auto max-w-[80%] rounded-xl object-cover shrink-0 snap-start"
                />
              ))}
            </div>
          )}
          <div className="px-5 sm:px-6 py-1">
          <Row label="Category">{service.category.name}</Row>
          <Row label="Price">
            <span className="font-semibold">{formatNaira(service.price)}</span>
            <span className="text-gray-400 font-normal">/hr</span>
          </Row>
          <Row label="Status"><StatusBadge status={service.status} /></Row>
          <Row label="Created">{new Date(service.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}</Row>

          {/* Provider section */}
          <div className="mt-3 mb-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400 mb-3">Provider</p>
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
              {service.provider.avatar?.url ? (
                <img
                  src={service.provider.avatar.url}
                  alt=""
                  className="w-9 h-9 rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-[#019B5F]/10 flex items-center justify-center text-[#019B5F] text-sm font-bold shrink-0">
                  {service.provider.firstName[0]}{service.provider.lastName[0]}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {service.provider.firstName} {service.provider.lastName}
                  </p>
                  {service.provider.providerVerified && (
                    <HugeiconsIcon icon={CheckmarkBadge01Icon} size={14} color="#019B5F" strokeWidth={2} />
                  )}
                </div>
                <p className="text-xs text-gray-400 truncate">{service.provider.email}</p>
                {service.provider.suretag && (
                  <p className="text-xs text-gray-400">@{service.provider.suretag}</p>
                )}
              </div>
            </div>
          </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-4 border-t border-gray-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => { onDelete(service); onClose(); }}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition-colors"
          >
            <HugeiconsIcon icon={Delete02Icon} size={14} strokeWidth={2} color="currentColor" />
            Delete
          </button>
        </div>

        <div className="h-[env(safe-area-inset-bottom)] bg-white sm:hidden" />
      </div>
    </div>
  );
}
