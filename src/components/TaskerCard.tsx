import { Link } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { Message01Icon, StarIcon } from '@hugeicons/core-free-icons';
import type { Tasker } from '../data/taskers';
import { formatNaira } from '../lib/format';

type TaskerCardProps = {
  tasker: Tasker;
  className?: string;
  variant?: 'carousel' | 'grid';
};

const TaskerCard = ({ tasker, className = '', variant = 'carousel' }: TaskerCardProps) => {
  const isGrid = variant === 'grid';

  return (
    <Link
      to={`/taskers/${tasker.id}`}
      className={`flex bg-white rounded-2xl border border-gray-200 max-w-full overflow-hidden ${
        isGrid
          ? 'flex-col sm:flex-row items-stretch gap-5 sm:gap-5 p-5 sm:p-5 lg:p-6 w-full'
          : 'flex-row items-stretch gap-5 sm:gap-6 p-5 sm:p-6 min-w-[420px] sm:min-w-[520px] md:min-w-[560px]'
      } ${className}`}
    >
      <div
        className={`shrink-0 rounded-xl overflow-hidden bg-gray-100 ${
          isGrid
            ? 'w-full h-[200px] sm:w-[128px] sm:h-auto sm:self-stretch lg:w-[140px]'
            : 'w-[132px] h-[132px] sm:w-[148px] sm:h-[148px] md:w-[160px] md:h-[160px] self-center'
        }`}
      >
        <img
          src={tasker.image}
          alt={tasker.name}
          className={`w-full h-full object-cover ${isGrid ? 'min-h-[200px] sm:min-h-[128px]' : 'min-h-[128px]'}`}
        />
      </div>

      <div
        className={`flex flex-col flex-1 min-w-0 ${
          isGrid
            ? 'sm:min-h-[128px] lg:min-h-[140px] sm:justify-between'
            : 'min-h-[132px] sm:min-h-[148px] md:min-h-[160px] justify-center'
        }`}
      >
        <div className="min-w-0">
          <div className={`flex flex-wrap ${isGrid ? 'gap-2' : 'gap-1.5 sm:gap-2'}`}>
            {tasker.tags.map((tag) => (
              <span
                key={tag}
                className={`font-medium text-gray-900 border border-gray-200 rounded-full leading-none bg-white ${
                  isGrid
                    ? 'text-xs sm:text-xs px-3.5 py-1.5'
                    : 'text-[11px] sm:text-xs px-2.5 sm:px-3 py-1'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>

          <h3
            className={`mt-2.5 font-bold text-gray-900 leading-tight tracking-tight ${
              isGrid ? 'text-xl sm:text-lg lg:text-xl' : 'text-base sm:text-lg lg:text-xl'
            }`}
          >
            {tasker.name}
          </h3>

          <div
            className={`mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-gray-900 ${
              isGrid ? 'text-sm sm:text-sm' : 'text-xs sm:text-sm'
            }`}
          >
            <span className="inline-flex items-center gap-2">
              <HugeiconsIcon icon={StarIcon} size={isGrid ? 16 : 14} color="#FBBF24" strokeWidth={2} />
              <span>{tasker.rating} Rating</span>
            </span>
            <span className="inline-flex items-center gap-2">
              <HugeiconsIcon icon={Message01Icon} size={isGrid ? 16 : 14} color="#111827" strokeWidth={2} />
              <span>{tasker.reviews.toLocaleString()} Reviews</span>
            </span>
          </div>
        </div>

        <div
          className={`flex w-full min-w-0 ${
            isGrid
              ? 'mt-5 flex-col gap-4 sm:mt-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4'
              : 'mt-auto pt-4 flex-row items-center justify-between gap-4 sm:gap-10'
          }`}
        >
          <p className={`leading-snug sm:leading-none ${isGrid ? 'text-base sm:text-sm' : 'text-xs sm:text-sm'}`}>
            <span className="text-gray-500">Start from </span>
            <span className="text-gray-900 font-semibold sm:font-medium">{formatNaira(tasker.price)}/hr</span>
          </p>
          <span
            className={`shrink-0 ${
              isGrid
                ? 'inline-flex w-full sm:w-auto items-center justify-center rounded-full text-sm sm:text-xs font-semibold leading-none px-8 py-4 sm:px-7 sm:py-3.5 min-h-[52px] sm:min-h-0 bg-gray-100 text-gray-900'
                : 'btn-pill-secondary'
            }`}
          >
            Order Now
          </span>
        </div>
      </div>
    </Link>
  );
};

export default TaskerCard;
