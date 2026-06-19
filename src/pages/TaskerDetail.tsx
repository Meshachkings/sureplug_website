import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Briefcase01Icon,
  Location01Icon,
  Message01Icon,
  Share01Icon,
  StarIcon,
  ViewIcon,
  CheckmarkBadge01Icon,
} from '@hugeicons/core-free-icons';
import HeroHeader from '../components/HeroHeader';
import { api, type ApiResponse, type ApiProviderProfile, type ApiReview } from '../lib/api';
import { formatNaira } from '../lib/format';
import StarFilled from '../components/StarFilled';

const AVATAR_PLACEHOLDER = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=019B5F&color=fff&size=200`;

const HeroStat = ({ value, label }: { value: string; label: string }) => (
  <div className="text-center min-w-[56px] sm:min-w-[80px]">
    <p className="text-sm sm:text-xl font-semibold text-white tabular-nums leading-none">{value}</p>
    <p className="mt-1 text-[10px] sm:text-xs text-white/55">{label}</p>
  </div>
);

const ReviewCard = ({ review }: { review: ApiReview }) => {
  const name = `${review.user.firstName} ${review.user.lastName}`.trim();
  return (
    <div className="border border-gray-100 rounded-xl p-4">
      <div className="flex items-center gap-3 mb-2">
        <img
          src={review.user.avatar?.url ?? AVATAR_PLACEHOLDER(name)}
          alt={name}
          className="w-8 h-8 rounded-full object-cover bg-gray-100"
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-900 truncate">{name}</p>
          <p className="text-xs text-gray-400">
            {new Date(review.createdAt).toLocaleDateString('en-NG', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </p>
        </div>
        <div className="flex items-center gap-0.5 shrink-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <StarFilled key={i} size={11} color={i < review.rating ? '#FBBF24' : '#e5e7eb'} />
          ))}
        </div>
      </div>
      {review.comment && (
        <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
      )}
    </div>
  );
};

const TaskerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<ApiProviderProfile | null>(null);
  const [similar, setSimilar] = useState<{ name: string; suretag: string; role: string; avatar?: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError('');
    const isObjectId = /^[0-9a-f]{24}$/i.test(id ?? '');
    const endpoint = isObjectId ? `/users/provider/id/${id}` : `/users/provider/${id}`;
    api
      .get<ApiResponse<ApiProviderProfile>>(endpoint)
      .then((res) => {
        setProfile(res.data);
        const categoryName = res.data.services[0]?.categoryId?.name;
        if (categoryName) {
          api
            .get<ApiResponse<{ services: { provider: { firstName: string; lastName: string; suretag: string; avatar?: { url: string } }; title: string }[] }>>(
              `/services/public?limit=8`
            )
            .then((sRes) => {
              const seen = new Set<string>();
              const results = sRes.data.services
                .filter((s) => s.provider.suretag !== id)
                .reduce<{ name: string; suretag: string; role: string; avatar?: string }[]>((acc, s) => {
                  if (!seen.has(s.provider.suretag)) {
                    seen.add(s.provider.suretag);
                    acc.push({
                      name: `${s.provider.firstName} ${s.provider.lastName}`.trim(),
                      suretag: s.provider.suretag,
                      role: s.title,
                      avatar: s.provider.avatar?.url,
                    });
                  }
                  return acc;
                }, [])
                .slice(0, 3);
              setSimilar(results);
            })
            .catch(() => {});
        }
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Provider not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="bg-white min-h-screen overflow-x-hidden">
        <HeroHeader />
        <section className="hero-grain relative overflow-hidden rounded-b-[1.75rem] sm:rounded-b-[2.5rem]">
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
            <div className="h-6 w-32 bg-white/20 rounded animate-pulse mb-8" />
            <div className="flex items-center gap-5">
              <div className="w-[100px] h-[100px] rounded-full bg-white/20 animate-pulse" />
              <div className="space-y-3">
                <div className="h-4 w-24 bg-white/20 rounded animate-pulse" />
                <div className="h-8 w-48 bg-white/20 rounded animate-pulse" />
                <div className="h-4 w-32 bg-white/20 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </section>
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-40 rounded-2xl bg-gray-100 animate-pulse" />
          ))}
        </main>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="profile-card p-8 text-center max-w-md">
          <h1 className="text-2xl font-semibold text-gray-900">Provider not found</h1>
          <p className="mt-2 text-sm text-gray-500">
            {error || 'This profile may have moved or is no longer available.'}
          </p>
          <Link to="/taskers" className="btn-pill inline-flex mt-6">
            Back to taskers
          </Link>
        </div>
      </div>
    );
  }

  const { provider, stats, services } = profile;
  const fullName = `${provider.firstName} ${provider.lastName}`.trim();
  const firstName = provider.firstName;
  const avatarUrl = provider.avatar?.url ?? AVATAR_PLACEHOLDER(fullName);
  const primaryService = services[0];
  const categoryName = primaryService?.categoryId?.name ?? '';
  const serviceTags = [...new Set(services.map((s) => s.title))].slice(0, 6);
  const allReviews = services.flatMap((s) => s.reviews ?? []).slice(0, 6);
  const price = primaryService?.price ?? 0;

  return (
    <div className="bg-white text-gray-900 min-h-screen overflow-x-hidden">
      <HeroHeader />
      <section className="hero-grain relative overflow-hidden rounded-b-[1.75rem] sm:rounded-b-[2.5rem]">
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 lg:pt-12 pb-8 sm:pb-10 lg:pb-14">
          <Link
            to="/taskers"
            className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors mb-6 sm:mb-8"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={15} color="currentColor" strokeWidth={2} />
            Back to taskers
          </Link>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex items-center gap-3 sm:gap-5 min-w-0">
              <div className="shrink-0 w-[72px] h-[72px] sm:w-[100px] sm:h-[100px] lg:w-[120px] lg:h-[120px] rounded-full border-[3px] border-white/20 overflow-hidden bg-white/10">
                <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                {categoryName && (
                  <p className="text-white/50 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.18em] mb-1">
                    {categoryName}
                  </p>
                )}
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-3xl md:text-4xl font-semibold text-white tracking-tight leading-tight">
                    {fullName}
                  </h1>
                  {provider.providerVerified && (
                    <HugeiconsIcon icon={CheckmarkBadge01Icon} size={22} color="#4ade80" strokeWidth={2} />
                  )}
                </div>
                {primaryService && (
                  <p className="mt-1 text-sm sm:text-lg text-white/75 truncate">{primaryService.title}</p>
                )}
                {provider.suretag && (
                  <p className="mt-1 inline-flex items-center gap-1.5 text-xs sm:text-sm text-white/60">
                    <HugeiconsIcon icon={Location01Icon} size={13} color="currentColor" strokeWidth={2} />
                    @{provider.suretag}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-around sm:justify-start lg:justify-end border-t border-white/10 pt-4 lg:border-t-0 lg:pt-0 shrink-0">
              <HeroStat value={stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '—'} label="Rating" />
              <div className="w-px h-7 sm:h-10 bg-white/15 mx-3 sm:mx-5" />
              <HeroStat value={stats.reviewCount.toLocaleString()} label="Reviews" />
              <div className="w-px h-7 sm:h-10 bg-white/15 mx-3 sm:mx-5" />
              <HeroStat value={stats.orderCount.toLocaleString()} label="Jobs done" />
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <section className="profile-card p-5 sm:p-6">
          {serviceTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {serviceTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className={`flex flex-wrap gap-2 sm:gap-3 ${serviceTags.length > 0 ? 'mt-4' : ''}`}>
            <button type="button" className="btn-pill">
              Book {firstName}
            </button>
            <button type="button" className="btn-pill-outline">
              <HugeiconsIcon icon={Message01Icon} size={14} color="currentColor" strokeWidth={2} />
              Message
            </button>
            <button type="button" className="btn-pill-outline">
              <HugeiconsIcon icon={Share01Icon} size={14} color="currentColor" strokeWidth={2} />
              Share profile
            </button>
          </div>
        </section>

        <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
          <div className="space-y-4">
            <section className="profile-card p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">Performance</h2>
                  <p className="mt-0.5 text-xs text-gray-500">Public profile insights</p>
                </div>
              </div>

              <div className="mt-4 space-y-1 divide-y divide-gray-100">
                <div className="flex items-start gap-3 py-3 first:pt-0">
                  <HugeiconsIcon icon={ViewIcon} size={18} color="#6b7280" strokeWidth={2} className="shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {stats.serviceCount} service{stats.serviceCount !== 1 ? 's' : ''} listed
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500">Active offerings on SurePlug.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 py-3">
                  <HugeiconsIcon icon={Briefcase01Icon} size={18} color="#6b7280" strokeWidth={2} className="shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {stats.orderCount.toLocaleString()} jobs completed
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500">Finished tasks on SurePlug.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 py-3">
                  <HugeiconsIcon icon={Message01Icon} size={18} color="#6b7280" strokeWidth={2} className="shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {stats.reviewCount.toLocaleString()} reviews
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500">Feedback from verified customers.</p>
                  </div>
                </div>
              </div>
            </section>

            {provider.bio && (
              <section className="profile-card p-5 sm:p-6">
                <h2 className="text-base font-semibold text-gray-900">About</h2>
                <p className="mt-3 text-sm text-gray-600 leading-relaxed">{provider.bio}</p>
              </section>
            )}

            {services.length > 0 && (
              <section className="profile-card p-5 sm:p-6">
                <h2 className="text-base font-semibold text-gray-900">Services offered</h2>
                <div className="mt-3 divide-y divide-gray-100">
                  {services.map((service) => (
                    <div key={service._id} className="py-3 first:pt-0 last:pb-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900">{service.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {service.categoryId.name}
                            {service.reviewCount > 0 && (
                              <> · {service.reviewCount} review{service.reviewCount !== 1 ? 's' : ''}</>
                            )}
                            {service.averageRating > 0 && (
                              <> · ★ {service.averageRating.toFixed(1)}</>
                            )}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-gray-900 shrink-0 tabular-nums">
                          {formatNaira(service.price)}
                          <span className="text-xs font-normal text-gray-400">/hr</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {allReviews.length > 0 && (
              <section className="profile-card p-5 sm:p-6">
                <h2 className="text-base font-semibold text-gray-900">
                  Reviews
                  <span className="ml-2 text-sm font-normal text-gray-400">({stats.reviewCount})</span>
                </h2>
                <div className="mt-3 space-y-3">
                  {allReviews.map((review, i) => (
                    <ReviewCard key={i} review={review} />
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-4">
            {price > 0 && (
              <section className="profile-card p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400">
                  Starting rate
                </p>
                <p className="mt-2 text-[1.75rem] font-semibold text-gray-900 tabular-nums leading-none">
                  {formatNaira(price)}
                  <span className="text-base font-normal text-gray-400">/hr</span>
                </p>
                <p className="mt-2 text-sm text-gray-500">Transparent pricing with no hidden fees.</p>
                <button type="button" className="btn-pill group w-full mt-4">
                  Book {firstName}
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    size={14}
                    color="currentColor"
                    strokeWidth={2}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </button>
              </section>
            )}

            <section className="profile-card p-5">
              <h3 className="text-sm font-semibold text-gray-900">Rating</h3>
              <div className="mt-2 flex items-center gap-2 text-sm text-gray-700">
                <StarFilled size={14} color="#FBBF24" />
                <span className="font-semibold tabular-nums">
                  {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '—'}
                </span>
                {stats.reviewCount > 0 && (
                  <>
                    <span className="text-gray-400">·</span>
                    <span>{stats.reviewCount.toLocaleString()} reviews</span>
                  </>
                )}
              </div>
              {provider.suretag && (
                <p className="mt-3 text-xs text-gray-500">
                  Share: sureplug.com/p/{provider.suretag}
                </p>
              )}
            </section>

            {similar.length > 0 && (
              <section className="profile-card overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-900">Other providers</h3>
                  <p className="mt-0.5 text-xs text-gray-500">More taskers on SurePlug</p>
                </div>
                <ul className="divide-y divide-gray-100">
                  {similar.map((item) => (
                    <li key={item.suretag}>
                      <Link
                        to={`/taskers/${item.suretag}`}
                        className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors"
                      >
                        <img
                          src={item.avatar ?? AVATAR_PLACEHOLDER(item.name)}
                          alt={item.name}
                          className="h-11 w-11 rounded-full object-cover bg-gray-100 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                          <p className="text-xs text-gray-500 truncate">{item.role}</p>
                        </div>
                        <span className="text-xs font-semibold text-mint shrink-0">View</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
};

export default TaskerDetail;
