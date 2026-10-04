import type { ApiPagination } from '../../lib/adminApi';

interface Props {
  pagination: ApiPagination;
  onPageChange: (page: number) => void;
  /** Keep the footer visible even when there is only one page */
  showWhenSinglePage?: boolean;
}

export default function Pagination({
  pagination,
  onPageChange,
  showWhenSinglePage = false,
}: Props) {
  const { page, totalPages, hasPrevPage, hasNextPage, total, limit } = pagination;

  if (totalPages <= 1 && !showWhenSinglePage) return null;

  const safeLimit = limit || 20;
  const from = total === 0 ? 0 : (page - 1) * safeLimit + 1;
  const to = Math.min(page * safeLimit, total);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3 border-t border-gray-100">
      <p className="text-sm text-gray-500">
        {typeof total === 'number' ? (
          <>
            Showing <span className="font-medium text-gray-700">{from}–{to}</span>
            {' '}of{' '}
            <span className="font-medium text-gray-700">{total.toLocaleString()}</span>
            {totalPages > 1 && (
              <span className="text-gray-400"> · Page {page} of {totalPages}</span>
            )}
          </>
        ) : (
          <>Page {page} of {totalPages}</>
        )}
      </p>
      {totalPages > 1 && (
        <div className="flex gap-2">
          <button
            type="button"
            disabled={!hasPrevPage}
            onClick={() => onPageChange(page - 1)}
            className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 disabled:opacity-40 hover:bg-gray-50 disabled:cursor-not-allowed transition-colors min-h-[44px] min-w-[44px]"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={!hasNextPage}
            onClick={() => onPageChange(page + 1)}
            className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 disabled:opacity-40 hover:bg-gray-50 disabled:cursor-not-allowed transition-colors min-h-[44px] min-w-[44px]"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
