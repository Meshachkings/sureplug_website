import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Search01Icon,
  ArrowRight01Icon,
  FilterHorizontalIcon,
} from '@hugeicons/core-free-icons';
import HeroHeader from '../components/HeroHeader';
import TaskerCard from '../components/TaskerCard';
import CtaBanner from '../components/CtaBanner';
import { api, type ApiResponse, type ApiService } from '../lib/api';
import type { Tasker } from '../data/taskers';

type SortOption = 'rating-desc' | 'rating-asc';

const AVATAR_PLACEHOLDER = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=019B5F&color=fff&size=200`;

const SERVICE_IMAGE_FALLBACK: Record<string, string> = {
  Plumbing: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&h=280&fit=crop',
  Cleaning: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=280&fit=crop',
  Electrical: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=280&fit=crop',
  Moving: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=280&fit=crop',
  Assembly: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=280&fit=crop',
  'Home Repair': 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&h=280&fit=crop',
};
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=280&fit=crop';

function mapServiceToTasker(service: ApiService): Tasker {
  const providerName = `${service.provider.firstName} ${service.provider.lastName}`.trim();
  const categoryName = (service.categoryId?.name ?? '').trim();
  const avatarUrl =
    service.images?.[0]?.url ||
    service.categoryId?.image?.url ||
    service.provider.avatar?.url ||
    SERVICE_IMAGE_FALLBACK[categoryName] ||
    AVATAR_PLACEHOLDER(providerName) ||
    DEFAULT_IMAGE;

  return {
    id: service.provider.suretag || service.provider._id,
    name: providerName,
    role: service.title,
    category: categoryName.trim(),
    tags: categoryName ? [categoryName] : [],
    image: avatarUrl,
    rating: service.averageRating ?? 0,
    reviews: service.reviewCount ?? 0,
    price: service.price ?? 0,
    location: service.state || 'Nigeria',
    featured: (service.averageRating ?? 0) >= 4.5,
  };
}

const Taskers = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialQuery = searchParams.get('q') ?? '';
  const [inputValue, setInputValue] = useState(initialQuery);
  const [committedQuery, setCommittedQuery] = useState(initialQuery);

  const [sort, setSort] = useState<SortOption>('rating-desc');
  const [services, setServices] = useState<Tasker[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const fetchServices = useCallback(async (search: string) => {
    setLoading(true);
    setFetchError('');
    try {
      const params = new URLSearchParams({ limit: '50' });
      const cleaned = search.trim().replace(/^@+/, '');
      if (cleaned) params.set('search', cleaned);
      const res = await api.get<ApiResponse<{ services: ApiService[] }>>(
        `/services/public?${params.toString()}`
      );
      setServices(res.data.services.map(mapServiceToTasker));
      setActiveCategory('All');
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : 'Failed to load services.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices(committedQuery);
  }, [fetchServices, committedQuery]);

  // Sync URL → input when navigating from another page with ?q=
  useEffect(() => {
    const q = searchParams.get('q') ?? '';
    setInputValue(q);
    setCommittedQuery(q);
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (trimmed === committedQuery) return;
    setSearchParams(trimmed ? { q: trimmed } : {}, { replace: true });
    setCommittedQuery(trimmed);
  };

  const categories = useMemo(() => {
    const names = new Set(services.map((s) => s.category).filter(Boolean));
    return ['All', ...Array.from(names).sort()];
  }, [services]);

  const filteredTaskers = useMemo(() => {
    const filtered =
      activeCategory === 'All'
        ? services
        : services.filter((t) => t.category === activeCategory);
    return [...filtered].sort((a, b) =>
      sort === 'rating-desc' ? b.rating - a.rating : a.rating - b.rating,
    );
  }, [services, activeCategory, sort]);

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

          <form onSubmit={handleSearch} className="mt-6 sm:mt-8 max-w-xl">
            <div className="flex items-center bg-white rounded-full pl-4 sm:pl-5 pr-1.5 py-1.5 border border-white/30">
              <HugeiconsIcon icon={Search01Icon} size={18} color="#9ca3af" strokeWidth={2} className="shrink-0 mr-2" />
              <input
                type="search"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search by name, skill, or city"
                className="flex-1 min-w-0 py-3 text-gray-800 text-[15px] sm:text-sm placeholder:text-gray-400 bg-transparent outline-none"
              />
              <button
                type="submit"
                className="bg-[#019B5F] hover:bg-[#017a4c] transition-colors rounded-full h-10 px-4 sm:px-5 text-white text-sm font-semibold shrink-0"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="section-wrap !py-5 sm:!py-10 lg:!py-14">
        <div className="flex items-center justify-between gap-3 mb-4 sm:mb-8 lg:mb-10">
          <div className="min-w-0">
            <h2 className="text-base sm:text-xl font-semibold text-gray-900 tracking-tight leading-snug">
              {loading
                ? 'Searching…'
                : committedQuery
                ? `${filteredTaskers.length} result${filteredTaskers.length === 1 ? '' : 's'} for "${committedQuery}"`
                : `${filteredTaskers.length} service${filteredTaskers.length === 1 ? '' : 's'} available`}
            </h2>
            <p className="hidden sm:block mt-1 text-sm text-gray-500">
              Filter by category to narrow your search.
            </p>
          </div>
          <button
            type="button"
            onClick={toggleSort}
            aria-label={`Sort by rating, ${sort === 'rating-desc' ? 'highest first' : 'lowest first'}`}
            className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-2 sm:px-4 sm:py-2.5 text-xs font-semibold text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-colors min-h-[36px] sm:min-h-[44px]"
          >
            <HugeiconsIcon icon={FilterHorizontalIcon} size={13} color="currentColor" strokeWidth={2} />
            <span className="truncate">
              Sort
              <span className="text-gray-400 font-normal">
                {' '}
                {sort === 'rating-desc' ? '↓' : '↑'}
              </span>
              <span className="hidden sm:inline text-gray-400 font-normal">
                {' '}({sort === 'rating-desc' ? 'high to low' : 'low to high'})
              </span>
            </span>
          </button>
        </div>

        <div className="flex gap-2.5 sm:gap-3 overflow-x-auto pb-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 scrollbar-none">
          {categories.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`shrink-0 rounded-full px-4 py-2.5 sm:px-6 sm:py-3 text-xs font-semibold leading-none transition-colors min-h-[44px] ${
                  isActive ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {loading && (
          <div className="mt-4 sm:mt-8 lg:mt-10 grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 lg:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/3] rounded-2xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        )}

        {!loading && fetchError && (
          <div className="mt-10 rounded-2xl border border-dashed border-red-200 px-6 py-12 text-center">
            <p className="text-base font-medium text-gray-900">Could not load services</p>
            <p className="mt-2 text-sm text-gray-500">{fetchError}</p>
          </div>
        )}

        {!loading && !fetchError && filteredTaskers.length > 0 && (
          <div className="mt-4 sm:mt-8 lg:mt-10 grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 lg:gap-6">
            {filteredTaskers.map((tasker) => (
              <TaskerCard key={`${tasker.id}-${tasker.role}`} tasker={tasker} variant="grid" />
            ))}
          </div>
        )}

        {!loading && !fetchError && filteredTaskers.length === 0 && (
          <div className="mt-10 rounded-2xl border border-dashed border-gray-200 px-6 py-12 text-center">
            <p className="text-base font-medium text-gray-900">No services found</p>
            <p className="mt-2 text-sm text-gray-500">
              {committedQuery
                ? `No results for "${committedQuery}". Try a different search term.`
                : 'Try a different category.'}
            </p>
            <button
              onClick={() => {
                setInputValue('');
                setCommittedQuery('');
                setSearchParams({}, { replace: true });
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
