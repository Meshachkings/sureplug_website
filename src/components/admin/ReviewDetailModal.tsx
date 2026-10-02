import { useEffect } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Cancel01Icon, Delete02Icon } from '@hugeicons/core-free-icons';
import type { AdminReview } from '../../lib/adminApi';
import StarFilled from '../StarFilled';

type Props = {
  review: AdminReview;
  onClose: () => void;
  onDelete: (review: AdminReview) => void;
};

function reviewerLabel(review: AdminReview): string {
  if (!review.user) return 'Unknown reviewer';
  const name = `${review.user.firstName ?? ''} ${review.user.lastName ?? ''}`.trim();
  return name || review.user.email || 'Unknown reviewer';
}

export default function ReviewDetailModal({ review, onClose, onDelete }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const initials = review.user
    ? `${review.user.firstName?.[0] ?? ''}${review.user.lastName?.[0] ?? ''}`.toUpperCase() || '?'
    : '?';
  const cover = review.service?.images?.[0]?.url;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6">
      <div className="absolute inset-0 bg-black/55 backdrop-blur-[6px]" onClick={onClose} aria-hidden="true" />

      <div className="relative z-10 w-full sm:max-w-[440px] bg-white rounded-t-[1.75rem] sm:rounded-[1.75rem] shadow-[0_24px_80px_rgba(0,0,0,0.28)] flex flex-col max-h-[92vh] overflow-hidden">
        <div className="relative shrink-0">
          {cover ? (
            <img src={cover} alt="" className="h-32 w-full object-cover" />
          ) : (
            <div className="h-24 bg-gradient-to-br from-amber-500/90 to-slate-700" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/45"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={2} color="currentColor" />
          </button>
          <div className="absolute bottom-4 left-5 right-14">
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-black/35 px-2.5 py-1 backdrop-blur-sm">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarFilled
                  key={i}
                  size={12}
                  color={i < review.rating ? '#FBBF24' : 'rgba(255,255,255,0.35)'}
                />
              ))}
              <span className="ml-0.5 text-xs font-semibold text-white tabular-nums">
                {review.rating}/5
              </span>
            </div>
            <h2 className="text-lg font-semibold text-white leading-snug line-clamp-2">
              {review.service?.title ?? 'Deleted service'}
            </h2>
          </div>
        </div>

        <div className="overflow-y-auto min-h-0 px-5 sm:px-6 py-5 space-y-5">
          <section>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 mb-2.5">
              Reviewer
            </p>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5">
              {review.user?.avatar?.url ? (
                <img
                  src={review.user.avatar.url}
                  alt=""
                  className="h-12 w-12 rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 text-sm font-bold text-slate-600 shrink-0">
                  {initials}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-900 truncate">{reviewerLabel(review)}</p>
                {review.user?.email && (
                  <p className="text-xs text-slate-400 truncate">{review.user.email}</p>
                )}
                {review.user?.suretag && (
                  <p className="text-xs font-medium text-slate-500">@{review.user.suretag}</p>
                )}
              </div>
            </div>
          </section>

          <section>
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400 mb-2.5">
              Comment
            </p>
            <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3.5">
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                {review.comment?.trim() ? review.comment : 'No comment provided.'}
              </p>
            </div>
          </section>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="rounded-xl border border-slate-100 bg-slate-50/70 px-3.5 py-3">
              <p className="text-[11px] text-slate-400">Posted</p>
              <p className="mt-0.5 text-sm font-medium text-slate-900">
                {new Date(review.createdAt).toLocaleDateString('en-NG', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/70 px-3.5 py-3">
              <p className="text-[11px] text-slate-400">Rating</p>
              <p className="mt-0.5 text-sm font-medium text-slate-900 tabular-nums">
                {review.rating} of 5 stars
              </p>
            </div>
          </div>

          <p className="text-[11px] font-mono text-slate-400 break-all">ID: {review._id}</p>
        </div>

        <div className="shrink-0 border-t border-slate-100 px-5 sm:px-6 py-4 grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => onDelete(review)}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100"
          >
            <HugeiconsIcon icon={Delete02Icon} size={15} strokeWidth={1.8} color="currentColor" />
            Delete
          </button>
        </div>

        <div className="h-[env(safe-area-inset-bottom)] bg-white sm:hidden shrink-0" />
      </div>
    </div>
  );
}
