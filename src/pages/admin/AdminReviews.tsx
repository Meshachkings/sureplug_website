import { useCallback, useEffect, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Delete02Icon } from '@hugeicons/core-free-icons';
import { api, type ApiResponse, type ApiPagination } from '../../lib/adminApi';
import type { AdminReview } from '../../lib/adminApi';
import Pagination from '../../components/admin/Pagination';
import ConfirmModal from '../../components/admin/ConfirmModal';
import AdminFilterBar, { FilterSelect } from '../../components/admin/AdminFilterBar';
import ReviewDetailModal from '../../components/admin/ReviewDetailModal';
import StarFilled from '../../components/StarFilled';

interface ReviewsResponse {
  reviews: AdminReview[];
  pagination: ApiPagination;
}

const RATING_OPTIONS = [
  { label: 'All ratings', value: '' },
  { label: '5 stars', value: '5' },
  { label: '4 stars', value: '4' },
  { label: '3 stars', value: '3' },
  { label: '2 stars', value: '2' },
  { label: '1 star', value: '1' },
];

function reviewerLabel(review: AdminReview): string {
  if (!review.user) return 'Unknown reviewer';
  const name = `${review.user.firstName ?? ''} ${review.user.lastName ?? ''}`.trim();
  return name || review.user.email || 'Unknown reviewer';
}

function StarRating({ rating, size = 13 }: { rating: number; size?: number }) {
  return (
    <div className="inline-flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <StarFilled
          key={i}
          size={size}
          color={i < rating ? '#FBBF24' : '#E5E7EB'}
        />
      ))}
    </div>
  );
}

function RatingPill({ rating }: { rating: number }) {
  const tone =
    rating >= 4
      ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
      : rating >= 3
        ? 'bg-amber-50 text-amber-700 border-amber-100'
        : 'bg-red-50 text-red-600 border-red-100';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold tabular-nums ${tone}`}
    >
      <StarFilled size={11} color="currentColor" />
      {rating.toFixed(1)}
    </span>
  );
}

function ReviewerCell({ review }: { review: AdminReview }) {
  const initials = review.user
    ? `${review.user.firstName?.[0] ?? ''}${review.user.lastName?.[0] ?? ''}`.toUpperCase() || '?'
    : '?';

  return (
    <div className="flex items-center gap-3 min-w-0">
      {review.user?.avatar?.url ? (
        <img
          src={review.user.avatar.url}
          alt=""
          className="h-9 w-9 rounded-full object-cover shrink-0"
        />
      ) : (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-500 shrink-0">
          {initials}
        </div>
      )}
      <div className="min-w-0">
        <p className="font-semibold text-gray-900 truncate">{reviewerLabel(review)}</p>
        {review.user?.email ? (
          <p className="text-xs text-gray-400 mt-0.5 truncate">{review.user.email}</p>
        ) : (
          <p className="text-xs text-gray-400 mt-0.5">No reviewer linked</p>
        )}
      </div>
    </div>
  );
}

function ServiceCell({ review }: { review: AdminReview }) {
  const thumb = review.service?.images?.[0]?.url;

  return (
    <div className="flex items-center gap-3 min-w-0">
      {thumb ? (
        <img src={thumb} alt="" className="h-10 w-10 rounded-lg object-cover shrink-0" />
      ) : (
        <div className="h-10 w-10 rounded-lg bg-slate-100 shrink-0" />
      )}
      <p className="font-medium text-gray-900 truncate max-w-[180px]">
        {review.service?.title ?? 'Deleted service'}
      </p>
    </div>
  );
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [pagination, setPagination] = useState<ApiPagination | null>(null);
  const [page, setPage] = useState(1);
  const [ratingFilter, setRatingFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedReview, setSelectedReview] = useState<AdminReview | null>(null);
  const [confirm, setConfirm] = useState<{ review: AdminReview } | null>(null);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (ratingFilter) params.set('rating', ratingFilter);
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
  }, [page, ratingFilter]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const openDelete = (review: AdminReview) => {
    setSelectedReview(null);
    setConfirm({ review });
  };

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

      {selectedReview && (
        <ReviewDetailModal
          review={selectedReview}
          onClose={() => setSelectedReview(null)}
          onDelete={openDelete}
        />
      )}

      <AdminFilterBar>
        <FilterSelect
          value={ratingFilter}
          options={RATING_OPTIONS}
          onChange={(v) => {
            setRatingFilter(v);
            setPage(1);
          }}
          placeholder="All ratings"
        />
      </AdminFilterBar>

      {loading ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-100">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="px-4 py-3.5 animate-pulse flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-gray-200 shrink-0" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center text-red-500">{error}</div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center text-gray-400">No reviews found.</div>
      ) : (
        <>
          {/* Cards — phone & tablet */}
          <div className="lg:hidden space-y-3">
            {reviews.map((review) => (
              <div
                key={review._id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedReview(review)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedReview(review);
                  }
                }}
                className="w-full text-left bg-white rounded-2xl border border-gray-100 p-4 shadow-sm transition-colors active:bg-slate-50 cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <ReviewerCell review={review} />
                  <div className="flex items-center gap-1.5 shrink-0">
                    <RatingPill rating={review.rating} />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDelete(review);
                      }}
                      className="admin-btn-icon"
                      title="Delete review"
                    >
                      <HugeiconsIcon icon={Delete02Icon} size={15} strokeWidth={1.75} />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-gray-700 leading-relaxed line-clamp-3 mb-3">
                  {review.comment?.trim() || 'No comment provided.'}
                </p>

                <div className="flex items-center justify-between gap-3">
                  <ServiceCell review={review} />
                  <span className="text-xs text-gray-400 whitespace-nowrap shrink-0">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Table — desktop */}
          <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="admin-table min-w-[720px]">
                <thead>
                  <tr>
                    <th>Reviewer</th>
                    <th>Rating</th>
                    <th>Comment</th>
                    <th>Service</th>
                    <th>Date</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((review) => (
                    <tr
                      key={review._id}
                      className="cursor-pointer"
                      onClick={() => setSelectedReview(review)}
                    >
                      <td>
                        <ReviewerCell review={review} />
                      </td>
                      <td>
                        <div className="flex flex-col gap-1.5">
                          <RatingPill rating={review.rating} />
                          <StarRating rating={review.rating} size={11} />
                        </div>
                      </td>
                      <td>
                        <p
                          className="text-gray-700 max-w-[280px] line-clamp-2 leading-relaxed"
                          title={review.comment}
                        >
                          {review.comment?.trim() || (
                            <span className="text-gray-400">No comment</span>
                          )}
                        </p>
                      </td>
                      <td>
                        <ServiceCell review={review} />
                      </td>
                      <td className="text-gray-500 text-xs whitespace-nowrap">
                        {new Date(review.createdAt).toLocaleDateString('en-NG', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedReview(review)}
                            className="admin-btn-secondary !px-2.5 !py-1.5 !text-xs"
                          >
                            Details
                          </button>
                          <button
                            type="button"
                            onClick={() => openDelete(review)}
                            className="admin-btn-icon"
                            title="Delete review"
                          >
                            <HugeiconsIcon icon={Delete02Icon} size={15} strokeWidth={1.75} />
                          </button>
                        </div>
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

          <div className="lg:hidden">
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
