import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Search01Icon,
  PlayIcon,
  ArrowUp01Icon,
  ArrowDown01Icon,
  ArrowRight01Icon,
  InstagramIcon,
  YoutubeIcon,
  NewTwitterIcon,
} from '@hugeicons/core-free-icons';
import StoreBadges from '../components/StoreBadges';
import PopularServicesCarousel from '../components/PopularServicesCarousel';
import CtaBanner from '../components/CtaBanner';
import HeroHeader from '../components/HeroHeader';
import { api, type ApiResponse, type ApiService } from '../lib/api';
import { formatNaira } from '../lib/format';
import StarFilled from '../components/StarFilled';
import type { Tasker } from '../data/taskers';

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
  const image =
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
    category: categoryName,
    tags: categoryName ? [categoryName] : [],
    image,
    rating: service.averageRating ?? 0,
    reviews: service.reviewCount ?? 0,
    price: service.price ?? 0,
    location: service.state ?? '',
    featured: (service.averageRating ?? 0) >= 4.5,
  };
}

const logoWhite =
  'https://res.cloudinary.com/dujux4xcs/image/upload/v1743598694/Group_21_1_j2gixb.svg';

const floatingImages = [
  {
    src: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=200&h=200&fit=crop',
    alt: 'Cleaning service',
    className: 'top-[8%] left-[6%] w-[72px] h-[72px] sm:w-20 sm:h-20',
  },
  {
    src: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200&h=200&fit=crop',
    alt: 'Construction worker',
    className: 'top-[4%] right-[8%] w-16 h-16 sm:w-[72px] sm:h-[72px]',
  },
  {
    src: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=200&h=200&fit=crop',
    alt: 'Plumber',
    className: 'top-[28%] left-[2%] w-14 h-14 sm:w-16 sm:h-16',
  },
  {
    src: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=200&h=200&fit=crop',
    alt: 'Moving boxes',
    className: 'top-[24%] right-[3%] w-[72px] h-[72px] sm:w-20 sm:h-20',
  },
  {
    src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop',
    alt: 'Handyman',
    className: 'top-[52%] left-[10%] w-14 h-14 sm:w-16 sm:h-16',
  },
  {
    src: 'https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=200&h=200&fit=crop',
    alt: 'Organizing',
    className: 'top-[48%] right-[12%] w-14 h-14 sm:w-16 sm:h-16',
  },
  {
    src: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=200&h=200&fit=crop',
    alt: 'Electrician',
    className: 'bottom-[18%] left-[5%] w-12 h-12 sm:w-14 sm:h-14',
  },
  {
    src: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop',
    alt: 'Professional',
    className: 'bottom-[14%] right-[6%] w-12 h-12 sm:w-14 sm:h-14',
  },
];

const stats = [
  { value: '1.7 Million +', label: 'Furniture Assemblies' },
  { value: '700K +', label: 'Moving Tasks' },
  { value: '820K +', label: 'Home Repairs' },
  { value: '1.4 Million +', label: 'Homes Cleaned' },
];

const services = [
  {
    id: '01',
    title: 'Home Repairs & Maintenance',
    description:
      'From fixing a leaky faucet to painting your walls, our taskers have the skills to tackle all your home improvement needs.',
  },
  {
    id: '02',
    title: 'Cleaning & Organization',
    description:
      'Keep your space spotless and organized with professional cleaners who handle everything from deep cleans to decluttering.',
  },
  {
    id: '03',
    title: 'Furniture Assembly',
    description:
      'Skip the frustration of flat-pack furniture. Our taskers assemble beds, desks, shelves, and more quickly and correctly.',
  },
  {
    id: '04',
    title: 'Moving Assistance',
    description:
      'Make your move stress-free with reliable help for packing, loading, unloading, and setting up your new home.',
  },
];

const companyLogos = ['Google', 'VISA', 'ORACLE', 'Walmart', 'mastercard'];

const howItWorksSteps = [
  {
    title: 'Choose Your Service',
    description:
      'Browse our wide range of service categories and select the one that fits your needs. Whether it is home maintenance, cleaning, moving, or personal assistance, we have got you covered.',
  },
  {
    title: 'Book a Service Provider',
    description:
      'Pick from our list of top-rated professionals, review their profiles and customer feedback, and schedule your service at a time that works best for you.',
  },
  {
    title: 'Get It Done',
    description:
      'Relax while our trusted service provider completes the task to your satisfaction. Enjoy the convenience and quality of our seamless service experience.',
  },
];

const testimonials = [
  {
    name: 'Daniel',
    location: 'Lagos',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    quote:
      'I posted a plumbing job and had a verified tasker at my door within two hours. Fast, professional, and fairly priced.',
    service: 'Plumbing',
  },
  {
    name: 'Amara',
    location: 'Abuja',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    quote:
      'SurePlug made finding a cleaner for my apartment effortless. The ratings helped me pick someone I could trust right away.',
    service: 'Cleaning',
  },
  {
    name: 'Tunde',
    location: 'Port Harcourt',
    image: 'https://randomuser.me/api/portraits/men/75.jpg',
    quote:
      'Used SurePlug for furniture assembly before moving in. Everything was set up perfectly and on time.',
    service: 'Assembly',
  },
  {
    name: 'Chioma',
    location: 'Ibadan',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
    quote:
      'The electrician I booked was punctual and transparent about costs. I have already recommended SurePlug to friends.',
    service: 'Electrical',
  },
  {
    name: 'Ibrahim',
    location: 'Kano',
    image: 'https://randomuser.me/api/portraits/men/52.jpg',
    quote:
      'Moving day was stressful until I found help on SurePlug. The team handled packing and lifting without a hitch.',
    service: 'Moving',
  },
  {
    name: 'Ngozi',
    location: 'Enugu',
    image: 'https://randomuser.me/api/portraits/women/26.jpg',
    quote:
      'From posting my task to payment, the whole process felt smooth. Exactly what I needed for a busy work week.',
    service: 'Handyman',
  },
];

const footerLinks = {
  customers: [
    { label: 'How SurePlug works', href: '#how-it-works' },
    { label: 'Sign Up', href: '#' },
    { label: 'Get the App', href: '#' },
    { label: 'Service Estimates', href: '/taskers' },
    { label: 'Cost Estimates', href: '/taskers' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '#' },
    { label: 'Partner with Us', href: '#' },
    { label: 'Press', href: '#' },
    { label: 'Blog', href: '#' },
  ],
  support: [
    { label: 'Help', href: '/contact' },
    { label: 'Safety', href: '#' },
    { label: 'Terms of Use', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Do not Sell Information', href: '#' },
  ],
};

const socialLinks = [
  { icon: InstagramIcon, label: 'Instagram', href: '#' },
  { icon: YoutubeIcon, label: 'YouTube', href: '#' },
  { icon: NewTwitterIcon, label: 'X', href: '#' },
];

const LandingPage = () => {
  const [expandedService, setExpandedService] = useState('01');
  const [activeHowItWorksStep, setActiveHowItWorksStep] = useState(0);
  const [showcaseTaskers, setShowcaseTaskers] = useState<Tasker[]>([]);

  useEffect(() => {
    api
      .get<ApiResponse<{ services: ApiService[] }>>('/services/public?limit=8')
      .then((res) => {
        const seen = new Set<string>();
        const unique = res.data.services
          .map(mapServiceToTasker)
          .filter((t) => {
            if (seen.has(t.id)) return false;
            seen.add(t.id);
            return true;
          });
        setShowcaseTaskers(unique);
      })
      .catch(() => {});
  }, []);

  const toggleService = (id: string) => {
    setExpandedService((current) => (current === id ? '' : id));
  };

  const renderFooterLink = (href: string, label: string) => {
    if (href.startsWith('#')) {
      return (
        <a href={href} className="text-sm text-white/50 hover:text-white transition-colors">
          {label}
        </a>
      );
    }

    return (
      <Link to={href} className="text-sm text-white/50 hover:text-white transition-colors">
        {label}
      </Link>
    );
  };

  return (
    <div className="bg-white text-gray-900 selection:bg-mint/20 overflow-x-hidden">
      <HeroHeader />
      {/* Hero Section */}
      <section className="hero-grain relative overflow-hidden rounded-b-[1.75rem] sm:rounded-b-[2.5rem] lg:rounded-b-[3rem] min-h-[520px] sm:min-h-[600px] md:min-h-[660px] lg:min-h-[700px] flex flex-col">

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          <div className="hidden md:block absolute inset-0 pointer-events-none overflow-hidden">
            {floatingImages.map((img) => (
              <div
                key={img.alt}
                className={`absolute ${img.className} rounded-xl overflow-hidden border border-white/10 opacity-90`}
              >
                <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

          <div className="relative max-w-2xl mx-auto text-center w-full">
            <h1 className="text-[1.625rem] leading-[1.15] sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-white tracking-tight px-1">
              Book Skilled Taskers, Anytime
            </h1>
            <p className="mt-3 sm:mt-4 text-white/60 text-sm sm:text-base max-w-md mx-auto leading-relaxed px-2">
              From home repairs to errands, get connected with reliable help in minutes
            </p>

            <div className="mt-6 sm:mt-8 max-w-lg mx-auto w-full px-1">
              <div className="flex items-center bg-white rounded-full pl-4 sm:pl-6 pr-1.5 py-1.5 sm:py-1 border border-white/30">
                <input
                  type="text"
                  placeholder="What do you need help with?"
                  className="flex-1 min-w-0 py-3 sm:py-3 text-gray-800 text-[15px] sm:text-sm placeholder:text-gray-400 bg-transparent outline-none"
                />
                <button
                  className="bg-mint hover:bg-mint-dark transition-colors rounded-full w-11 h-11 sm:w-11 sm:h-11 flex items-center justify-center shrink-0"
                  aria-label="Search"
                >
                  <HugeiconsIcon icon={Search01Icon} size={20} color="#ffffff" strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center pb-6 sm:pb-10">
          <p className="text-white/40 text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.16em] sm:tracking-[0.18em] mb-3 sm:mb-4">
            Trusted by Top Companies
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 sm:gap-8 md:gap-10">
            {companyLogos.map((logo) => (
              <span
                key={logo}
                className="text-white/50 text-xs sm:text-sm font-medium tracking-wide"
              >
                {logo}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Stats Section */}
      <section className="border-b border-gray-100 bg-gray-50/50">
        <div className="section-wrap">
          <p className="section-label mb-3">Why SurePlug</p>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 max-w-2xl leading-snug tracking-tight">
            Dependable help for the tasks you keep putting off.
          </h2>
          <p className="mt-3 text-gray-500 text-sm sm:text-base leading-relaxed max-w-2xl">
            From quick fixes to full-day projects, SurePlug helps you find skilled taskers you can
            trust. Compare ratings, book in minutes, and get the work done without the runaround.
          </p>

          <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:gap-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 flex-1">
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={`${
                    index % 2 === 1 ? 'border-l border-gray-200 pl-4 md:pl-0 md:border-l-0' : ''
                  } ${index > 0 && index % 2 === 0 ? 'md:border-l md:border-gray-200 md:pl-8' : ''}`}
                >
                  <p className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 leading-tight tabular-nums">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-[11px] sm:text-xs md:text-sm text-gray-500 leading-snug">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <Link to="/about" className="btn-link group shrink-0 self-start lg:self-auto">
              Learn about us
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={16}
                color="currentColor"
                strokeWidth={2}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>
      </section>

      <PopularServicesCarousel />

      {/* Services Section */}
      <section className="section-wrap">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-start">
          <div className="relative rounded-xl sm:rounded-2xl overflow-hidden aspect-[16/11] sm:aspect-[4/5] md:aspect-[3/4] lg:aspect-auto lg:min-h-[400px] border border-gray-200 w-full">
            <img
              src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&h=1000&fit=crop"
              alt="Tasker repairing furniture"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <button className="absolute inset-0 flex items-center justify-center group" aria-label="Play video">
              <div className="w-12 h-12 sm:w-11 sm:h-11 rounded-full bg-white/95 flex items-center justify-center text-gray-900 group-hover:bg-mint group-hover:text-white transition-all duration-300">
                <HugeiconsIcon icon={PlayIcon} size={16} color="currentColor" strokeWidth={2} />
              </div>
            </button>
          </div>

          <div>
            <p className="section-label mb-3">Services</p>
            <h2 className="section-title">
              Discover the Help You Need, When You Need It
            </h2>
            <p className="section-desc">
              From everyday tasks to specialized projects, we&apos;ve got you covered.
            </p>

            <div className="mt-6 border border-gray-200 rounded-xl divide-y divide-gray-200">
              {services.map((service) => {
                const isExpanded = expandedService === service.id;
                return (
                  <div key={service.id} className="px-4 sm:px-6">
                    <button
                      className="w-full flex items-start gap-3 sm:gap-4 text-left py-4 group"
                      onClick={() => toggleService(service.id)}
                      aria-expanded={isExpanded}
                    >
                      <span className="shrink-0 w-8 h-8 sm:w-7 sm:h-7 rounded-full border border-gray-200 flex items-center justify-center text-xs sm:text-[11px] text-gray-400 font-medium">
                        {service.id}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-sm sm:text-base font-medium text-gray-900 group-hover:text-gray-700 transition-colors pr-2">
                            {service.title}
                          </h3>
                          <HugeiconsIcon
                            icon={isExpanded ? ArrowUp01Icon : ArrowDown01Icon}
                            size={18}
                            color="#9ca3af"
                            strokeWidth={1.5}
                            className="shrink-0"
                          />
                        </div>
                        {isExpanded && (
                          <p className="mt-2.5 text-sm text-gray-500 leading-relaxed pr-6">
                            {service.description}
                          </p>
                        )}
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>

            <Link to="/taskers" className="btn-link group mt-5">
              Browse all taskers
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={16}
                color="currentColor"
                strokeWidth={2}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="border-t border-gray-100 bg-gray-50/80">
        <div className="section-wrap">
          <div className="grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] gap-10 lg:gap-16 xl:gap-20 items-start">
            <div className="max-w-md lg:sticky lg:top-8">
              <h2 className="text-xl sm:text-2xl md:text-[1.75rem] lg:text-[2rem] font-semibold text-gray-900 tracking-tight leading-tight">
                Step-by-Step Guide to Getting Your Tasks Done with Ease
              </h2>
              <p className="mt-4 text-sm sm:text-[15px] text-gray-500 leading-relaxed">
                Discover how simple it is to get professional help for your everyday needs. Follow
                these three straightforward steps to connect with skilled service providers and
                complete your tasks effortlessly.
              </p>
            </div>

            <div className="space-y-2 sm:space-y-3">
              {howItWorksSteps.map((step, index) => {
                const isActive = activeHowItWorksStep === index;

                return (
                  <button
                    key={step.title}
                    type="button"
                    onClick={() => setActiveHowItWorksStep(index)}
                    className={`w-full text-left rounded-2xl p-5 sm:p-6 transition-all duration-300 ${
                      isActive
                        ? 'bg-white border border-gray-100'
                        : 'bg-transparent border border-transparent hover:bg-white/50'
                    }`}
                  >
                    <div className="flex gap-4 sm:gap-5">
                      <span
                        className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                          isActive
                            ? 'bg-mint text-white'
                            : 'bg-gray-100 text-gray-300'
                        }`}
                      >
                        {index + 1}
                      </span>

                      <div className="min-w-0 pt-0.5">
                        <h3
                          className={`font-semibold text-base sm:text-lg leading-snug transition-colors ${
                            isActive ? 'text-gray-900' : 'text-gray-300'
                          }`}
                        >
                          {step.title}
                        </h3>
                        <p
                          className={`mt-2 text-sm leading-relaxed transition-colors ${
                            isActive ? 'text-gray-500' : 'text-gray-300'
                          }`}
                        >
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Meet Top Taskers Section */}
      <section className="bg-gray-50/80 border-t border-gray-100 overflow-hidden">
        <div className="section-wrap">

          {/* Header — left-aligned on mobile with inline CTA, centered on desktop */}
          <div className="flex items-end justify-between gap-4 sm:flex-col sm:items-center sm:text-center sm:max-w-2xl sm:mx-auto">
            <div>
              <p className="section-label mb-2 sm:mb-3">Top Taskers</p>
              <h2 className="text-xl sm:text-2xl md:text-[1.75rem] lg:text-[2rem] font-semibold text-gray-900 tracking-tight leading-tight">
                Meet Our Top-rated Taskers
              </h2>
              <p className="hidden sm:block mt-3 text-[15px] text-gray-500 leading-relaxed">
                Get to know the taskers who consistently deliver excellent results.
              </p>
            </div>
            <Link
              to="/taskers"
              className="sm:hidden inline-flex items-center gap-1.5 text-xs font-semibold text-mint hover:text-mint-dark shrink-0 pb-0.5"
            >
              View all
              <HugeiconsIcon icon={ArrowRight01Icon} size={13} color="currentColor" strokeWidth={2.5} />
            </Link>
          </div>

          {/* Portrait overlay cards — single scroll row, responsive widths */}
          <div className="mt-6 sm:mt-10 flex gap-3 sm:gap-4 overflow-x-auto pb-3 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 scrollbar-none snap-x snap-mandatory">
            {showcaseTaskers.map((tasker) => (
              <Link
                key={tasker.id}
                to={`/taskers/${tasker.id}`}
                className="group relative shrink-0 w-[185px] sm:w-[220px] lg:w-[245px] aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden snap-start bg-gray-200"
              >
                <img
                  src={tasker.image}
                  alt={tasker.name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04] group-active:scale-[1.02]"
                />
                {/* Bottom gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/20 to-transparent" />
                {/* Top vignette */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />

                {/* Rating pill */}
                {tasker.rating > 0 && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/35 backdrop-blur-sm border border-white/15 rounded-full px-2 py-1">
                    <StarFilled size={10} color="#FBBF24" />
                    <span className="text-[11px] font-semibold text-white tabular-nums leading-none">
                      {tasker.rating.toFixed(1)}
                    </span>
                  </div>
                )}

                {/* Info overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-3.5 sm:p-4">
                  {tasker.category && (
                    <p className="text-[9px] sm:text-[10px] font-semibold text-white/50 uppercase tracking-[0.14em] leading-none mb-1.5">
                      {tasker.category}
                    </p>
                  )}
                  <h3 className="text-sm sm:text-[15px] font-bold text-white leading-snug tracking-tight line-clamp-1">
                    {tasker.name}
                  </h3>
                  <p className="mt-0.5 text-[11px] sm:text-xs text-white/50 leading-snug line-clamp-1">
                    {tasker.role}
                  </p>
                  {tasker.price > 0 && (
                    <div className="mt-2.5 flex items-center justify-between gap-2">
                      <p className="text-[11px] sm:text-xs font-semibold text-mint leading-none">
                        from {formatNaira(tasker.price)}/hr
                      </p>
                      <span className="text-[10px] font-semibold text-white/80 bg-white/10 border border-white/15 rounded-full px-2 py-0.5 leading-none shrink-0">
                        Book
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* Testimonials Section */}
      <section className="border-t border-gray-100">
        <div className="section-wrap">
          <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
            <p className="section-label mb-3">Testimonials</p>
            <h2 className="section-title">What our customers say</h2>
            <p className="section-desc mx-auto">
              Real stories from people who found reliable help through SurePlug.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
            {testimonials.map((item) => (
              <article
                key={item.name}
                className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 flex flex-col"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 rounded-full object-cover shrink-0"
                    />
                    <p className="text-sm font-medium text-gray-900">
                      {item.name}, {item.location}
                    </p>
                  </div>
                  <div className="flex items-center gap-0.5 shrink-0 sm:pt-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <StarFilled key={i} size={12} color="#019B5F" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed flex-1">
                  {item.quote}
                </p>
                <span className="mt-4 self-start text-[11px] font-medium text-gray-500 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-full">
                  {item.service}
                </span>
              </article>
            ))}
          </div>

          <div className="text-center mt-8">
            <button className="btn-link group">
              View all reviews
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={16}
                color="currentColor"
                strokeWidth={2}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </button>
          </div>
        </div>
      </section>

      <CtaBanner />

      {/* Footer */}
      <footer className="bg-[#1a2e35] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_auto] gap-10 lg:gap-12">
            <div>
              <Link to="/">
                <img src={logoWhite} alt="SurePlug" className="h-6 sm:h-7 w-auto" />
              </Link>
              <p className="mt-3 sm:mt-4 text-sm text-white/55 leading-relaxed max-w-xs">
                Consider it done.
              </p>
              <div className="mt-4 sm:mt-5 flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="w-11 h-11 sm:w-9 sm:h-9 rounded-full border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:border-white/30 transition-colors"
                  >
                    <HugeiconsIcon icon={social.icon} size={16} color="currentColor" strokeWidth={1.5} />
                  </a>
                ))}
              </div>

              <div className="mt-6 xl:hidden">
                <StoreBadges />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-6">
              <div>
                <h4 className="text-sm font-medium text-white mb-3 sm:mb-4">Customers</h4>
                <ul className="space-y-2 sm:space-y-2.5">
                  {footerLinks.customers.map((link) => (
                    <li key={link.label}>{renderFooterLink(link.href, link.label)}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-medium text-white mb-3 sm:mb-4">Company</h4>
                <ul className="space-y-2 sm:space-y-2.5">
                  {footerLinks.company.map((link) => (
                    <li key={link.label}>{renderFooterLink(link.href, link.label)}</li>
                  ))}
                </ul>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <h4 className="text-sm font-medium text-white mb-3 sm:mb-4">Support</h4>
                <ul className="space-y-2 sm:space-y-2.5">
                  {footerLinks.support.map((link) => (
                    <li key={link.label}>{renderFooterLink(link.href, link.label)}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="hidden xl:block shrink-0">
              <StoreBadges layout="column" />
            </div>
          </div>

          <p className="mt-8 sm:mt-10 pt-5 sm:pt-6 border-t border-white/10 text-xs text-white/40 text-center md:text-left">
            © {new Date().getFullYear()} SurePlug. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
