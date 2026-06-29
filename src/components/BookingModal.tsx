import { useEffect } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon } from '@hugeicons/core-free-icons';
import StoreBadges from './StoreBadges';

type Props = {
  onClose: () => void;
};

const BookingModal = ({ onClose }: Props) => {
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
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Card — full-width bottom sheet on mobile, centered card on sm+ */}
      <div className="relative z-10 w-full sm:max-w-[380px] rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden">

        {/* Drag handle (mobile only) */}
        <div className="flex justify-center pt-3 pb-1 bg-[#0f1f18] sm:hidden">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Dark header */}
        <div className="relative bg-[#0f1f18] px-5 sm:px-6 pt-5 sm:pt-7 pb-7 sm:pb-8">
          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 p-1.5 rounded-full text-white/40 hover:text-white/80 hover:bg-white/10 transition-colors"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={16} color="currentColor" strokeWidth={2} />
          </button>

          {/* Logo */}
          <div className="mb-4 sm:mb-5">
            <img
              src="https://res.cloudinary.com/dujux4xcs/image/upload/v1743598694/Group_21_1_j2gixb.svg"
              alt="SurePlug"
              className="h-6 sm:h-7 w-auto"
            />
          </div>

          <h2
            id="booking-modal-title"
            className="text-xl sm:text-[1.35rem] font-semibold text-white leading-snug tracking-tight"
          >
            Get the app to book plugs
          </h2>
          <p className="mt-2 sm:mt-2.5 text-sm text-white/50 leading-relaxed">
            Download SurePlug to book, message plugs, and track your requests in real time.
          </p>
        </div>

        {/* White body */}
        <div className="bg-white px-5 sm:px-6 pt-4 sm:pt-5 pb-6 sm:pb-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400 mb-3">
            Available on
          </p>
          <StoreBadges layout="row" className="gap-3" />
        </div>

        {/* Safe-area spacer for notched phones */}
        <div className="h-[env(safe-area-inset-bottom)] bg-white sm:hidden" />
      </div>
    </div>
  );
};

export default BookingModal;
