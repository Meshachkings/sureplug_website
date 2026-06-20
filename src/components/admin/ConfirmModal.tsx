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
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} aria-hidden="true" />

      <div className="relative z-10 w-full sm:max-w-sm bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden">
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        <div className="px-6 pt-5 pb-6">
          {/* Icon + title */}
          <div className="flex items-start gap-4 mb-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isDanger ? 'bg-red-50' : 'bg-yellow-50'}`}>
              <HugeiconsIcon
                icon={isDanger ? Delete02Icon : AlertCircleIcon}
                size={18}
                strokeWidth={2}
                color={isDanger ? '#dc2626' : '#ca8a04'}
              />
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              <h3 className="text-base font-semibold text-gray-900 leading-snug">{title}</h3>
              <p className="text-sm text-gray-500 mt-1 leading-relaxed">{message}</p>
            </div>
            <button
              onClick={onCancel}
              className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors shrink-0"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={15} strokeWidth={2} color="currentColor" />
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-2.5">
            {cancelLabel !== false && (
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                {cancelLabel}
              </button>
            )}
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                isError
                  ? 'bg-gray-900 text-white hover:bg-gray-800'
                  : isDanger
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-yellow-500 text-white hover:bg-yellow-600'
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
