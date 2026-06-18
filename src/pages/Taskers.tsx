import { useMemo, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Search01Icon,
  ArrowRight01Icon,
  FilterHorizontalIcon,
} from '@hugeicons/core-free-icons';
import HeroHeader from '../components/HeroHeader';
import TaskerCard from '../components/TaskerCard';
import CtaBanner from '../components/CtaBanner';
import { taskerCategories, taskers } from '../data/taskers';

type SortOption = 'rating-desc' | 'rating-asc';

const Taskers = () => {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<(typeof taskerCategories)[number]>('All');
  const [sort, setSort] = useState<SortOption>('rating-desc');

  const filteredTaskers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const filtered = taskers.filter((tasker) => {
      const matchesCategory = activeCategory === 'All' || tasker.category === activeCategory;
      const matchesQuery =
        !normalizedQuery ||
        tasker.name.toLowerCase().includes(normalizedQuery) ||
        tasker.role.toLowerCase().includes(normalizedQuery) ||
        tasker.location.toLowerCase().includes(normalizedQuery) ||
        tasker.category.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });

    return [...filtered].sort((a, b) =>
      sort === 'rating-desc' ? b.rating - a.rating : a.rating - b.rating,
    );
  }, [activeCategory, query, sort]);

  const toggleSort = () => {
    setSort((current) => (current === 'rating-desc' ? 'rating-asc' : 'rating-desc'));
  };

  return (
    <div className="bg-white text-gray-900 min-h-screen overflow-x-hidden">
      <HeroHeader />
      <section className="hero-grain relative overflow-hidden rounded-b-[1.75rem] sm:rounded-b-[2.5rem]">

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-14">
          <div className="max-w-2xl">
            <p className="text-white/50 text-[11px] font-medium uppercase tracking-[0.18em] mb-3">
              Providers
            </p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white tracking-tight leading-tight">
              Find skilled taskers near you
            </h1>
            <p className="mt-3 text-sm sm:text-base text-white/65 leading-relaxed max-w-xl">
              Browse verified professionals, compare ratings, and book help for home repairs,
              cleaning, moving, and more.
            </p>
          </div>

          <div className="mt-6 sm:mt-8 max-w-xl">
            <div className="flex items-center bg-white rounded-full pl-4 sm:pl-5 pr-1.5 py-1.5 border border-white/30">
              <HugeiconsIcon icon={Search01Icon} size={18} color="#9ca3af" strokeWidth={2} className="shrink-0 mr-2" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by name, skill, or city"
                className="flex-1 min-w-0 py-3 text-gray-800 text-[15px] sm:text-sm placeholder:text-gray-400 bg-transparent outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section-wrap !py-6 sm:!py-10 lg:!py-14">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-6 sm:mb-8 lg:mb-10">
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 tracking-tight">
              {filteredTaskers.length} tasker{filteredTaskers.length === 1 ? '' : 's'} available
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Filter by category to narrow your search.
            </p>
          </div>
          <button
            type="button"
            onClick={toggleSort}
            aria-label={`Sort by rating, ${sort === 'rating-desc' ? 'highest first' : 'lowest first'}`}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-colors self-stretch sm:self-auto justify-center sm:justify-start min-h-[44px]"
          >
            <HugeiconsIcon icon={FilterHorizontalIcon} size={14} color="currentColor" strokeWidth={2} />
            <span className="truncate">
              Sort by rating
              <span className="text-gray-400 font-normal sm:hidden">
                {' '}
                ({sort === 'rating-desc' ? '↓' : '↑'})
              </span>
              <span className="hidden sm:inline text-gray-400 font-normal">
                {' '}
                ({sort === 'rating-desc' ? 'high to low' : 'low to high'})
              </span>
            </span>
          </button>
        </div>

        <div className="flex gap-2.5 sm:gap-3 overflow-x-auto pb-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 scrollbar-none">
          {taskerCategories.map((category) => {
            const isActive = activeCategory === category;

            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`shrink-0 rounded-full px-4 py-2.5 sm:px-6 sm:py-3 text-xs font-semibold leading-none transition-colors min-h-[44px] ${
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {filteredTaskers.length > 0 ? (
          <div className="mt-6 sm:mt-8 lg:mt-10 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {filteredTaskers.map((tasker) => (
              <TaskerCard key={tasker.id} tasker={tasker} variant="grid" />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed border-gray-200 px-6 py-12 text-center">
            <p className="text-base font-medium text-gray-900">No taskers found</p>
            <p className="mt-2 text-sm text-gray-500">
              Try a different search term or category.
            </p>
            <button
              onClick={() => {
                setQuery('');
                setActiveCategory('All');
              }}
              className="btn-link group justify-center mt-5"
            >
              Clear filters
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={16}
                color="currentColor"
                strokeWidth={2}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </button>
          </div>
        )}
      </section>

      <CtaBanner />
    </div>
  );
};

export default Taskers;
