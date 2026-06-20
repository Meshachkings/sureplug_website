import type { ApiPagination } from '../../lib/adminApi';

interface Props {
  pagination: ApiPagination;
  onPageChange: (page: number) => void;
}

export default function Pagination({ pagination, onPageChange }: Props) {
  const { page, totalPages, hasPrevPage, hasNextPage } = pagination;

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
      <p className="text-sm text-gray-500">
        Page {page} of {totalPages}
      </p>
      <div className="flex gap-2">
        <button
          disabled={!hasPrevPage}
          onClick={() => onPageChange(page - 1)}
          className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 disabled:opacity-40 hover:bg-gray-50 disabled:cursor-not-allowed transition-colors min-h-[44px] min-w-[44px]"
        >
          Previous
        </button>
        <button
          disabled={!hasNextPage}
          onClick={() => onPageChange(page + 1)}
          className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 disabled:opacity-40 hover:bg-gray-50 disabled:cursor-not-allowed transition-colors min-h-[44px] min-w-[44px]"
        >
          Next
        </button>
      </div>
    </div>
  );
}
