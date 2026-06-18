import { Link } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  ArrowRight01Icon,
  SecurityCheckIcon,
  UserGroupIcon,
  ZapIcon,
} from '@hugeicons/core-free-icons';
import HeroHeader from '../components/HeroHeader';
import CtaBanner from '../components/CtaBanner';

const values = [
  {
    title: 'Trust',
    description:
      'Every tasker on SurePlug is verified so you can book with confidence and know who is coming to your door.',
    icon: SecurityCheckIcon,
  },
  {
    title: 'Innovation',
    description:
      'We use technology to make finding, booking, and paying for help simple, from search to checkout in minutes.',
    icon: ZapIcon,
  },
  {
    title: 'Community',
    description:
      'We connect skilled professionals with people who need help, building stronger local communities across Nigeria.',
    icon: UserGroupIcon,
  },
];

const stats = [
  { value: '12K+', label: 'Verified taskers' },
  { value: '850K+', label: 'Tasks completed' },
  { value: '4.8', label: 'Average rating' },
  { value: '20+', label: 'Cities served' },
];

const team = [
  {
    name: 'John Smith',
    role: 'CEO & Founder',
    image: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    name: 'Sarah Johnson',
    role: 'Chief Technology Officer',
    image: 'https://randomuser.me/api/portraits/women/2.jpg',
  },
  {
    name: 'Michael Chen',
    role: 'Head of Operations',
    image: 'https://randomuser.me/api/portraits/men/3.jpg',
  },
];

const About = () => {
  return (
    <div className="bg-white text-gray-900 min-h-screen overflow-x-hidden">
      <HeroHeader />
      <section className="hero-grain relative overflow-hidden rounded-b-[1.75rem] sm:rounded-b-[2.5rem]">

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-14">
          <div className="max-w-2xl">
            <p className="text-white/50 text-[11px] font-medium uppercase tracking-[0.18em] mb-3">
              About Us
            </p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white tracking-tight leading-tight">
              Connecting skilled taskers with people who need help
            </h1>
            <p className="mt-3 text-sm sm:text-base text-white/65 leading-relaxed max-w-xl">
              SurePlug makes it easy to find trusted professionals for home repairs, cleaning,
              moving, and everyday tasks, booked in minutes, done with confidence.
            </p>
          </div>
        </div>
      </section>

      <section className="section-wrap">
        <div className="max-w-3xl">
          <p className="section-label mb-3">Our mission</p>
          <h2 className="section-title">
            Dependable help should be one tap away
          </h2>
          <p className="section-desc mt-3">
            We started SurePlug to solve a simple problem: finding reliable help for everyday
            tasks is harder than it should be. Our platform connects verified taskers with
            customers across Nigeria, with transparent pricing, real reviews, and secure booking
            from start to finish.
          </p>
        </div>

        <div className="mt-10 sm:mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`${index % 2 === 1 ? 'border-l border-gray-200 pl-4 md:pl-0 md:border-l-0' : ''} ${
                index > 0 && index % 2 === 0 ? 'md:border-l md:border-gray-200 md:pl-8' : ''
              }`}
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
      </section>

      <section className="border-t border-gray-100 bg-gray-50/50">
        <div className="section-wrap">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <p className="section-label mb-3">What we stand for</p>
            <h2 className="section-title">Built on trust, speed, and community</h2>
            <p className="section-desc mx-auto mt-2">
              These principles guide every product decision and every partnership we build.
            </p>
          </div>

          <div className="grid gap-8 sm:gap-10 md:grid-cols-3">
            {values.map((value) => (
              <div key={value.title}>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-mint/10 text-mint">
                  <HugeiconsIcon icon={value.icon} size={18} color="currentColor" strokeWidth={2} />
                </span>
                <h3 className="mt-4 text-base font-semibold text-gray-900">{value.title}</h3>
                <p className="mt-1.5 text-sm text-gray-500 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-wrap">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          <div>
            <p className="section-label mb-3">For customers & taskers</p>
            <h2 className="section-title">A platform that works for everyone</h2>
            <p className="section-desc mt-3">
              Customers get fast access to skilled help with clear pricing and ratings they can
              trust. Taskers get flexible work, fair pay, and tools to grow their business on their
              own terms.
            </p>
            <Link to="/taskers" className="btn-link group mt-5">
              Explore taskers
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={16}
                color="currentColor"
                strokeWidth={2}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          <div className="overflow-hidden rounded-2xl aspect-[4/3] sm:aspect-[16/11]">
            <img
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=600&fit=crop"
              alt="SurePlug tasker helping a customer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="border-t border-gray-100 bg-gray-50/50">
        <div className="section-wrap">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <p className="section-label mb-3">Leadership</p>
            <h2 className="section-title">Meet the team behind SurePlug</h2>
            <p className="section-desc mx-auto mt-2">
              A small, focused team working to make local services more accessible across Nigeria.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member) => (
              <div key={member.name} className="text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mx-auto object-cover"
                />
                <h3 className="mt-3 text-base font-semibold text-gray-900">{member.name}</h3>
                <p className="mt-0.5 text-sm text-gray-500">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </div>
  );
};

export default About;
