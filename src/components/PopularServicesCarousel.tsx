import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft01Icon, ArrowRight01Icon } from '@hugeicons/core-free-icons';
import { popularServices } from '../data/popularServices';
import { formatNaira } from '../lib/format';

const PopularServicesCarousel = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollRef.current;
    if (!container) return;

    const scrollAmount = Math.min(container.clientWidth * 0.85, 320);
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <section className="border-t border-gray-100 bg-white overflow-hidden">
      <div className="section-wrap">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-xl sm:text-2xl md:text-[1.75rem] lg:text-[2rem] font-semibold text-gray-900 tracking-tight leading-tight">
            Discover Most Popular Services
          </h2>
          <p className="mt-3 text-sm sm:text-[15px] text-gray-500 leading-relaxed">
            Explore our most in-demand services, trusted by customers for their exceptional quality
            and reliability.
          </p>
        </div>

        <div
          ref={scrollRef}
          className="mt-8 sm:mt-10 flex gap-4 sm:gap-5 overflow-x-auto pb-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 scrollbar-none snap-x snap-mandatory"
        >
          {popularServices.map((service) => (
            <Link
              key={service.id}
              to="/taskers"
              className="group relative shrink-0 w-[240px] sm:w-[260px] md:w-[280px] aspect-[3/4] rounded-3xl overflow-hidden snap-start"
            >
              <img
                src={service.image}
                alt={service.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/5" />

              <span className="absolute top-4 left-4 bg-white text-gray-900 text-[11px] font-medium px-3 py-1.5 rounded-full">
                Start from {formatNaira(service.price)}/hr
              </span>

              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="text-white font-semibold text-lg sm:text-xl leading-snug">
                  {service.title}
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] sm:text-[11px] text-white/95 bg-white/15 backdrop-blur-sm border border-white/20 px-2.5 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => scroll('left')}
            aria-label="Scroll popular services left"
            className="btn-icon"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={14} color="currentColor" strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            aria-label="Scroll popular services right"
            className="btn-icon"
          >
            <HugeiconsIcon icon={ArrowRight01Icon} size={14} color="currentColor" strokeWidth={2} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default PopularServicesCarousel;
