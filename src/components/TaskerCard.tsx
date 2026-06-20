import { Link } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { Location01Icon, Message01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons';
import StarFilled from './StarFilled';
import type { Tasker } from '../data/taskers';
import { formatNaira } from '../lib/format';
import { useBookingModal } from '../context/BookingModalContext';

type TaskerCardProps = {
  tasker: Tasker;
  className?: string;
  variant?: 'carousel' | 'grid';
};

const TaskerCard = ({ tasker, className = '', variant = 'carousel' }: TaskerCardProps) => {
  const { openBookingModal } = useBookingModal();

  if (variant === 'grid') {
    return (
      <Link
        to={`/taskers/${tasker.id}`}
        className={`group flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-gray-200 hover:shadow-lg hover:shadow-gray-100/80 transition-all duration-300 ${className}`}
      >
        {/* Image */}
        <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100">
          <img
            src={tasker.image}
            alt={tasker.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />

          {/* Category badge */}
          {tasker.category && (
            <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-gray-800 text-[11px] font-semibold px-2.5 py-1 rounded-full leading-none shadow-sm">
              {tasker.category}
            </span>
          )}

          {/* Rating badge */}
          {tasker.rating > 0 && (
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/45 backdrop-blur-sm border border-white/15 rounded-full px-2 py-1">
              <StarFilled size={10} color="#FBBF24" />
              <span className="text-[11px] font-semibold text-white tabular-nums leading-none">
                {tasker.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 p-3 sm:p-5">
          <h3 className="font-semibold text-[13px] sm:text-base text-gray-900 leading-snug line-clamp-2">
            {tasker.role}
          </h3>

          <div className="mt-1 flex items-center gap-1 text-[11px] sm:text-xs text-gray-400 flex-wrap">
            <span className="font-medium text-gray-600 truncate max-w-[80px] sm:max-w-none">{tasker.name}</span>
            {tasker.location && (
              <>
                <span>·</span>
                <span className="hidden sm:inline-flex items-center gap-0.5">
                  <HugeiconsIcon icon={Location01Icon} size={11} color="currentColor" strokeWidth={2} />
                  {tasker.location}
                </span>
              </>
            )}
          </div>

          {/* Rating row */}
          {(tasker.rating > 0 || tasker.reviews > 0) && (
            <div className="mt-2 sm:mt-3 flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs text-gray-500">
              <StarFilled size={11} color="#FBBF24" />
              <span className="font-semibold text-gray-900 tabular-nums">{tasker.rating > 0 ? tasker.rating.toFixed(1) : '—'}</span>
              <span className="text-gray-400 hidden sm:inline">
                {tasker.reviews > 0 && `(${tasker.reviews.toLocaleString()} review${tasker.reviews !== 1 ? 's' : ''})`}
              </span>
            </div>
          )}

          {/* Price + CTA */}
          <div className="mt-auto pt-3 sm:pt-4 flex items-end justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[9px] sm:text-[10px] text-gray-400 leading-none mb-0.5 sm:mb-1">From</p>
              <p className="text-[13px] sm:text-base font-bold text-gray-900 tabular-nums leading-none">
                {tasker.price > 0 ? (
                  <>
                    {formatNaira(tasker.price)}
                    <span className="text-[11px] sm:text-xs font-normal text-gray-400">/hr</span>
                  </>
                ) : (
                  <span className="text-xs font-medium text-gray-400">On request</span>
                )}
              </p>
            </div>
            {/* Mobile: icon-only circle */}
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); openBookingModal(); }}
              aria-label="Book now"
              className="sm:hidden shrink-0 w-9 h-9 rounded-full bg-mint flex items-center justify-center hover:bg-mint-dark transition-colors"
            >
              <HugeiconsIcon icon={ArrowRight01Icon} size={16} color="white" strokeWidth={2.5} />
            </button>
            {/* Desktop: full pill */}
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); openBookingModal(); }}
              className="hidden sm:inline-flex shrink-0 btn-pill text-xs px-4 py-2.5 leading-none"
            >
              Book now
            </button>
          </div>
        </div>
      </Link>
    );
  }

  /* ── Carousel variant (unchanged) ── */
  return (
    <Link
      to={`/taskers/${tasker.id}`}
      className={`flex flex-row bg-white rounded-2xl border border-gray-200 items-stretch gap-5 sm:gap-6 p-5 sm:p-6 min-w-[420px] sm:min-w-[520px] md:min-w-[560px] max-w-full overflow-hidden ${className}`}
    >
      <div className="shrink-0 w-[132px] h-[132px] sm:w-[148px] sm:h-[148px] md:w-[160px] md:h-[160px] rounded-xl overflow-hidden bg-gray-100 self-center">
        <img
          src={tasker.image}
          alt={tasker.name}
          className="w-full h-full object-cover min-h-[128px]"
        />
      </div>

      <div className="flex flex-col flex-1 min-w-0 min-h-[132px] sm:min-h-[148px] md:min-h-[160px] justify-center">
        <div className="min-w-0">
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {tasker.tags.map((tag) => (
              <span
                key={tag}
                className="font-medium text-gray-900 border border-gray-200 rounded-full leading-none bg-white text-[11px] sm:text-xs px-2.5 sm:px-3 py-1"
              >
                {tag}
              </span>
            ))}
          </div>

          <h3 className="mt-2.5 font-bold text-gray-900 leading-tight tracking-tight text-base sm:text-lg lg:text-xl">
            {tasker.name}
          </h3>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-gray-900 text-xs sm:text-sm">
            <span className="inline-flex items-center gap-2">
              <StarFilled size={14} color="#FBBF24" />
              <span>{tasker.rating > 0 ? tasker.rating.toFixed(1) : '—'} Rating</span>
            </span>
            <span className="inline-flex items-center gap-2">
              <HugeiconsIcon icon={Message01Icon} size={14} color="#111827" strokeWidth={2} />
              <span>{tasker.reviews.toLocaleString()} Reviews</span>
            </span>
          </div>
        </div>

        <div className="mt-auto pt-4 flex flex-row items-center justify-between gap-4 sm:gap-10">
          <p className="text-xs sm:text-sm leading-snug sm:leading-none">
            <span className="text-gray-500">Start from </span>
            <span className="text-gray-900 font-semibold sm:font-medium">
              {formatNaira(tasker.price)}/hr
            </span>
          </p>
          <button
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); openBookingModal(); }}
            className="btn-pill-secondary shrink-0"
          >
            Order Now
          </button>
        </div>
      </div>
    </Link>
  );
};

export default TaskerCard;
