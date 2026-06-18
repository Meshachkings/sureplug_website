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
} from '@hugeicons/core-free-icons';
import HeroHeader from '../components/HeroHeader';
import { taskers, type Tasker } from '../data/taskers';
import { formatNaira } from '../lib/format';

const getProfileStats = (tasker: Tasker) => ({
  profileViews: Math.round(tasker.reviews * 2.4),
  jobsCompleted: Math.round(tasker.reviews * 0.28),
  responseRate: Math.min(99, 88 + Math.round(tasker.rating * 2)),
});

const getSimilarTaskers = (tasker: Tasker, limit = 3) =>
  taskers
    .filter((item) => item.id !== tasker.id && item.category === tasker.category)
    .slice(0, limit);

const HeroStat = ({ value, label }: { value: string; label: string }) => (
  <div className="text-center min-w-[56px] sm:min-w-[80px]">
    <p className="text-sm sm:text-xl font-semibold text-white tabular-nums leading-none">{value}</p>
    <p className="mt-1 text-[10px] sm:text-xs text-white/55">{label}</p>
  </div>
);

const TaskerDetail = () => {
  const { id } = useParams();
  const tasker = taskers.find((item) => item.id === id);

  if (!tasker) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="profile-card p-8 text-center max-w-md">
          <h1 className="text-2xl font-semibold text-gray-900">Tasker not found</h1>
          <p className="mt-2 text-sm text-gray-500">This profile may have moved or is no longer available.</p>
          <Link to="/taskers" className="btn-pill inline-flex mt-6">
            Back to taskers
          </Link>
        </div>
      </div>
    );
  }

  const stats = getProfileStats(tasker);
  const similarTaskers = getSimilarTaskers(tasker);
  const firstName = tasker.name.split(' ')[0];

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
            {/* Avatar + name — always side by side */}
            <div className="flex items-center gap-3 sm:gap-5 min-w-0">
              <div className="shrink-0 w-[72px] h-[72px] sm:w-[100px] sm:h-[100px] lg:w-[120px] lg:h-[120px] rounded-full border-[3px] border-white/20 overflow-hidden bg-white/10">
                <img src={tasker.image} alt={tasker.name} className="w-full h-full object-cover" />
              </div>

              <div className="min-w-0">
                <p className="text-white/50 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.18em] mb-1">
                  {tasker.category}
                </p>
                <h1 className="text-xl sm:text-3xl md:text-4xl font-semibold text-white tracking-tight leading-tight truncate">
                  {tasker.name}
                </h1>
                <p className="mt-1 text-sm sm:text-lg text-white/75 truncate">{tasker.role}</p>
                <p className="mt-1 inline-flex items-center gap-1.5 text-xs sm:text-sm text-white/60">
                  <HugeiconsIcon icon={Location01Icon} size={13} color="currentColor" strokeWidth={2} />
                  {tasker.location}, Nigeria
                </p>
              </div>
            </div>

            {/* Stats row */}
            <div className="flex items-center justify-around sm:justify-start lg:justify-end border-t border-white/10 pt-4 lg:border-t-0 lg:pt-0 shrink-0">
              <HeroStat value={String(tasker.rating)} label="Rating" />
              <div className="w-px h-7 sm:h-10 bg-white/15 mx-3 sm:mx-5" />
              <HeroStat value={tasker.reviews.toLocaleString()} label="Reviews" />
              <div className="w-px h-7 sm:h-10 bg-white/15 mx-3 sm:mx-5" />
              <HeroStat value={stats.jobsCompleted.toLocaleString()} label="Jobs done" />
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <section className="profile-card p-5 sm:p-6">
          <div className="flex flex-wrap gap-2">
            {tasker.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-2 sm:gap-3">
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
                <button
                  type="button"
                  className="text-xs font-semibold text-mint hover:text-mint-dark transition-colors shrink-0"
                >
                  Show all stats →
                </button>
              </div>

              <div className="mt-4 space-y-1 divide-y divide-gray-100">
                <div className="flex items-start gap-3 py-3 first:pt-0">
                  <HugeiconsIcon icon={ViewIcon} size={18} color="#6b7280" strokeWidth={2} className="shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {stats.profileViews.toLocaleString()} profile views
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500">Discover who viewed this profile.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 py-3">
                  <HugeiconsIcon icon={Briefcase01Icon} size={18} color="#6b7280" strokeWidth={2} className="shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {stats.jobsCompleted.toLocaleString()} jobs completed
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500">Finished tasks on SurePlug.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 py-3">
                  <HugeiconsIcon icon={Message01Icon} size={18} color="#6b7280" strokeWidth={2} className="shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {stats.responseRate}% response rate
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500">Usually replies within 1 hour.</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="profile-card p-5 sm:p-6">
              <h2 className="text-base font-semibold text-gray-900">About</h2>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                {tasker.name} is a trusted {tasker.role.toLowerCase()} based in {tasker.location},
                with a strong track record on SurePlug. Customers praise their reliability,
                professionalism, and attention to detail on every job.
              </p>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                Specializing in {tasker.tags.join(', ').toLowerCase()}, {firstName} brings hands-on
                experience across residential and commercial projects throughout Nigeria.
              </p>
            </section>

            <section className="profile-card p-5 sm:p-6">
              <h2 className="text-base font-semibold text-gray-900">Skills & services</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {[tasker.role, tasker.category, ...tasker.tags, 'On-time delivery'].map((skill) => (
                  <span
                    key={skill}
                    className="text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-4">
            <section className="profile-card p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-gray-400">
                Hourly rate
              </p>
              <p className="mt-2 text-[1.75rem] font-semibold text-gray-900 tabular-nums leading-none">
                {formatNaira(tasker.price)}
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

            <section className="profile-card p-5">
              <h3 className="text-sm font-semibold text-gray-900">Availability</h3>
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                Usually responds within 1 hour. Available this week in {tasker.location}.
              </p>
              <div className="mt-3 flex items-center gap-2 text-sm text-gray-700">
                <HugeiconsIcon icon={StarIcon} size={14} color="#FBBF24" strokeWidth={2} />
                <span className="font-medium">{tasker.rating}</span>
                <span className="text-gray-400">·</span>
                <span>{tasker.reviews.toLocaleString()} reviews</span>
              </div>
            </section>

            {similarTaskers.length > 0 && (
              <section className="profile-card overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-900">Similar taskers</h3>
                  <p className="mt-0.5 text-xs text-gray-500">Others in {tasker.category}</p>
                </div>
                <ul className="divide-y divide-gray-100">
                  {similarTaskers.map((similar) => (
                    <li key={similar.id}>
                      <Link
                        to={`/taskers/${similar.id}`}
                        className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors"
                      >
                        <img
                          src={similar.image}
                          alt={similar.name}
                          className="h-11 w-11 rounded-full object-cover bg-gray-100 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-gray-900 truncate">{similar.name}</p>
                          <p className="text-xs text-gray-500 truncate">{similar.role}</p>
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
