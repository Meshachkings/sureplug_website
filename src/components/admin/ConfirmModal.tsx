import { useEffect } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon, Delete02Icon, AlertCircleIcon } from '@hugeicons/core-free-icons';

type Variant = 'danger' | 'warning' | 'error';

type Props = {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string | false;
  variant?: Variant;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmModal({
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
}: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
      if (e.key === 'Enter') onConfirm();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onConfirm, onCancel]);

  const isDanger = variant === 'danger' || variant === 'error';
  const isError = variant === 'error';

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-6">
      <div className="absolute inset-0 bg-black/55 backdrop-blur-[6px]" onClick={onCancel} aria-hidden="true" />

      <div className="relative z-10 w-full sm:max-w-[380px] bg-white rounded-t-[1.75rem] sm:rounded-[1.75rem] shadow-[0_24px_80px_rgba(0,0,0,0.28)] overflow-hidden">
        <div className="px-5 sm:px-6 pt-5 pb-6">
          <div className="flex items-start gap-3.5 mb-5">
            <div
              className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                isDanger ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-600'
              }`}
            >
              <HugeiconsIcon
                icon={isDanger ? Delete02Icon : AlertCircleIcon}
                size={18}
                strokeWidth={2}
                color="currentColor"
              />
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              <h3 className="text-base font-semibold tracking-tight text-gray-900 leading-snug">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-500">{message}</p>
            </div>
            <button
              type="button"
              onClick={onCancel}
              aria-label="Close"
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={15} strokeWidth={2} color="currentColor" />
            </button>
          </div>

          <div className={`grid gap-2.5 ${cancelLabel === false ? 'grid-cols-1' : 'grid-cols-2'}`}>
            {cancelLabel !== false && (
              <button
                type="button"
                onClick={onCancel}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                {cancelLabel}
              </button>
            )}
            <button
              type="button"
              onClick={onConfirm}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-colors ${
                isError
                  ? 'bg-gray-900 hover:bg-gray-800'
                  : isDanger
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-amber-500 hover:bg-amber-600'
              }`}
            >
              {confirmLabel}
            </button>
          </div>
        </div>

        <div className="h-[env(safe-area-inset-bottom)] bg-white sm:hidden" />
      </div>
    </div>
  );
}
