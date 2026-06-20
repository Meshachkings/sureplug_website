import { useCallback, useEffect, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Delete02Icon, FavouriteIcon } from '@hugeicons/core-free-icons';
import { api, type ApiResponse, type ApiPagination } from '../../lib/adminApi';
import type { AdminReview } from '../../lib/adminApi';
import Pagination from '../../components/admin/Pagination';
import ConfirmModal from '../../components/admin/ConfirmModal';

interface ReviewsResponse {
  reviews: AdminReview[];
  pagination: ApiPagination;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <HugeiconsIcon
          key={i}
          icon={FavouriteIcon}
          size={13}
          strokeWidth={1.5}
          className={i < rating ? 'text-yellow-400' : 'text-gray-200'}
        />
      ))}
    </div>
  );
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [pagination, setPagination] = useState<ApiPagination | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirm, setConfirm] = useState<{ review: AdminReview } | null>(null);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      const res = await api.get<ApiResponse<ReviewsResponse>>(
        `/admin/reviews?${params.toString()}`,
        true
      );
      setReviews(res.data.reviews);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reviews');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleDelete = (review: AdminReview) => setConfirm({ review });

  const confirmDelete = async () => {
    if (!confirm) return;
    const { review } = confirm;
    setConfirm(null);
    try {
      await api.delete(`/admin/reviews/${review._id}`, true);
      setReviews((prev) => prev.filter((r) => r._id !== review._id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete review');
    }
  };

  return (
    <div>
      {confirm && (
        <ConfirmModal
          title="Delete review"
          message="Permanently delete this review? This cannot be undone."
          confirmLabel="Delete"
          variant="danger"
          onConfirm={confirmDelete}
          onCancel={() => setConfirm(null)}
        />
      )}
      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="px-4 py-3 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center text-red-500">{error}</div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center text-gray-400">No reviews found.</div>
      ) : (
        <>
          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {reviews.map((review) => (
              <div key={review._id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <StarRating rating={review.rating} />
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => handleDelete(review)}
                      className="p-2 rounded-xl text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                      title="Delete review"
                    >
                      <HugeiconsIcon icon={Delete02Icon} size={18} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-gray-700 line-clamp-2 mb-2">{review.comment}</p>
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  <span className="text-xs text-gray-500 truncate">
                    <span className="text-gray-400">Service: </span>
                    {review.service?.title ?? '—'}
                  </span>
                  <span className="text-xs text-gray-500 truncate">
                    <span className="text-gray-400">By: </span>
                    {review.user?.firstName} {review.user?.lastName}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-xs uppercase text-gray-500 tracking-wide">
                    <th className="px-4 py-3 text-left">Rating</th>
                    <th className="px-4 py-3 text-left">Comment</th>
                    <th className="px-4 py-3 text-left">Service</th>
                    <th className="px-4 py-3 text-left">Reviewer</th>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {reviews.map((review) => (
                    <tr key={review._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <StarRating rating={review.rating} />
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-gray-700 max-w-[220px] truncate" title={review.comment}>
                          {review.comment}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-gray-600 max-w-[140px] truncate">
                        {review.service?.title ?? <span className="text-gray-400">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-gray-700">
                          {review.user?.firstName} {review.user?.lastName}
                        </p>
                        <p className="text-xs text-gray-400">{review.user?.email}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleDelete(review)}
                          className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Delete review"
                        >
                          <HugeiconsIcon icon={Delete02Icon} size={15} strokeWidth={1.5} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {pagination && (
              <Pagination pagination={pagination} onPageChange={setPage} />
            )}
          </div>

          {/* Mobile pagination */}
          <div className="md:hidden">
            {pagination && (
              <div className="bg-white rounded-2xl border border-gray-100 mt-3">
                <Pagination pagination={pagination} onPageChange={setPage} />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
