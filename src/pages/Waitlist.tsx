import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  ArrowUpRight01Icon,
  Facebook01Icon,
  InstagramIcon,
  NewTwitterIcon,
  PinIcon,
} from '@hugeicons/core-free-icons';
import { api, type ApiResponse } from '../lib/api';
import ServiceSelect from '../components/ServiceSelect';

function SurePlugMark({ size = 72, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 66 66"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <path
        d="M0 21.58C0 9.66169 9.66169 0 21.58 0H66V44.42C66 56.3383 56.3383 66 44.42 66H0V21.58Z"
        fill="#01DB86"
      />
      <path
        d="M15.9074 30.0507C15.9092 30.334 15.997 30.6099 16.1592 30.8421C16.3215 31.0743 16.5505 31.2517 16.8158 31.3507L30.3475 36.4116L36.0164 49.7013C36.1259 49.9584 36.3099 50.1767 36.5448 50.3281C36.7797 50.4794 37.0545 50.5569 37.3338 50.5505L37.3562 50.55C37.639 50.5391 37.9118 50.4426 38.1385 50.2733C38.3653 50.1039 38.5352 49.8697 38.6259 49.6017L49.1032 18.6203C49.189 18.3682 49.201 18.0969 49.1377 17.8382C49.0745 17.5796 48.9387 17.3444 48.7463 17.1604C48.5538 16.9764 48.3128 16.8511 48.0516 16.7995C47.7904 16.7478 47.5199 16.7719 47.2719 16.8688L16.7971 28.7393C16.5334 28.8423 16.3071 29.023 16.1482 29.2574C15.9893 29.4918 15.9053 29.7689 15.9074 30.0521L15.9074 30.0507Z"
        fill="black"
      />
    </svg>
  );
}

const siteLogo =
  'https://res.cloudinary.com/dujux4xcs/image/upload/v1743514302/Group_21_zddu9f.svg';

const socialLinks = [
  { icon: NewTwitterIcon, label: 'X', href: '#' },
  { icon: InstagramIcon, label: 'Instagram', href: '#' },
  { icon: Facebook01Icon, label: 'Facebook', href: '#' },
];

const waitlistFaces = [
  'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=80&h=80&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=80&h=80&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=80&h=80&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?w=80&h=80&fit=crop&crop=face',
];

const announcements = [
  {
    title: 'Waitlist is open',
    date: '25-08-2026',
    body: 'Sign up now and we will email you the moment SurePlug is ready in your city.',
    person: 'Product',
    role: 'SurePlug',
  },
  {
    title: 'iOS & Android',
    date: '12-08-2026',
    body: 'The apps are in development. You will get the download link as soon as we launch.',
    person: 'Mobile',
    role: 'SurePlug',
  },
  {
    title: 'Starting in Lagos',
    date: '04-08-2026',
    body: 'We are launching first in Lagos, then rolling out to more cities across Nigeria.',
    person: 'Launch',
    role: 'SurePlug',
  },
];

const Waitlist = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [joined, setJoined] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    if (!service) {
      setError('Please pick a service from the list.');
      return;
    }
    setLoading(true);
    try {
      await api.post<ApiResponse<unknown>>('/waitlist', {
        email: email.trim(),
        phone: phone.trim(),
        service,
      });
      setJoined(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not join the waitlist. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#ececee] text-gray-900 selection:bg-mint/20">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1440 1024"
          fill="none"
          preserveAspectRatio="xMidYMin slice"
        >
          <rect width="1440" height="1024" fill="#ececee" />
          <path
            d="M-80 0 H1520 V90 C1280 40 1100 150 900 95 C680 35 480 155 280 85 C140 38 40 110 -80 70 Z"
            fill="#f7f7f8"
          />
          <path
            d="M-120 210 C80 130 280 290 520 200 C760 110 980 250 1220 175 C1340 140 1440 190 1560 160 L1560 0 L-120 0 Z"
            fill="#e8e8ea"
          />
          <path
            d="M-160 340 C140 240 420 430 720 330 C1000 235 1240 410 1600 310 L1600 1024 L-160 1024 Z"
            fill="#e3e3e5"
          />
          <path
            d="M-100 255 C200 175 460 345 740 255 C1020 165 1260 315 1540 245"
            stroke="#dddde0"
            strokeWidth="70"
            fill="none"
          />
          <path
            d="M-80 310 C240 230 520 390 800 300 C1060 220 1300 360 1560 290"
            stroke="#f4f4f5"
            strokeWidth="42"
            fill="none"
          />
        </svg>
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 sm:px-6 lg:px-8">
        <header className="grid grid-cols-[1fr_auto] items-center gap-3 py-5 sm:grid-cols-3 sm:py-7">
          <Link to="/" className="justify-self-start">
            <img src={siteLogo} alt="SurePlug" className="h-6 w-auto sm:h-7" />
          </Link>

          <a
            href="mailto:hello@sureplug.com"
            className="hidden items-center justify-center gap-2 justify-self-center text-[13px] text-gray-500 hover:text-gray-800 sm:inline-flex"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#22c55e] opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#22c55e]" />
            </span>
            hello@sureplug.com
          </a>

          <div className="flex items-center justify-self-end gap-3.5 text-gray-900">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="transition-opacity hover:opacity-60"
              >
                <HugeiconsIcon icon={social.icon} size={16} color="currentColor" strokeWidth={1.8} />
              </a>
            ))}
          </div>
        </header>

        <main className="flex flex-1 flex-col items-center pt-8 text-center sm:pt-14 lg:pt-16">
          <SurePlugMark size={72} className="drop-shadow-[0_18px_40px_rgba(0,0,0,0.14)]" />

          <h1 className="mt-7 max-w-xl text-[1.85rem] font-semibold leading-[1.15] tracking-tight text-gray-900 sm:mt-8 sm:text-[2.35rem] lg:text-[2.6rem]">
            Early access before launch
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-gray-500 sm:text-[15px]">
            Be first in line to book skilled plugs for home repairs, cleaning, moving, and more.
          </p>

          <div className="mt-8 w-full max-w-[440px] sm:mt-9">
            {joined ? (
              <p className="rounded-3xl bg-white px-6 py-5 text-sm leading-relaxed text-gray-600 shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
                You&apos;re on the list. We&apos;ll write to{' '}
                <span className="font-medium text-gray-900">{email}</span> when we launch.
              </p>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="relative overflow-visible rounded-3xl bg-white p-2 text-left shadow-[0_10px_40px_rgba(0,0,0,0.06)]"
              >
                <label htmlFor="waitlist-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="waitlist-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Your email here"
                  className="w-full bg-transparent px-4 py-3.5 text-sm text-gray-900 outline-none placeholder:text-gray-400"
                />

                <div className="mx-4 h-px bg-gray-100" />

                <label htmlFor="waitlist-phone" className="sr-only">
                  Phone number
                </label>
                <input
                  id="waitlist-phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="Phone number"
                  className="w-full bg-transparent px-4 py-3.5 text-sm text-gray-900 outline-none placeholder:text-gray-400"
                />

                <div className="mx-4 h-px bg-gray-100" />

                <ServiceSelect
                  value={service}
                  onChange={setService}
                  placeholder="Search a service"
                />

                {error && <p className="px-4 pb-2 text-sm text-red-600">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-1 inline-flex h-12 w-full items-center justify-center gap-1.5 rounded-full bg-[#111] text-sm font-medium text-white transition-colors hover:bg-black disabled:opacity-70"
                >
                  {loading ? 'Joining…' : 'Join Waitlist'}
                  {!loading && (
                    <HugeiconsIcon icon={ArrowUpRight01Icon} size={15} color="currentColor" strokeWidth={2} />
                  )}
                </button>
              </form>
            )}
          </div>

          <div className="mt-5 flex items-center justify-center gap-3">
            <div className="flex -space-x-2.5">
              {waitlistFaces.map((src) => (
                <img
                  key={src}
                  src={src}
                  alt=""
                  className="h-8 w-8 rounded-full border-2 border-white object-cover"
                />
              ))}
            </div>
            <p className="text-[13px] text-gray-500">Join others on the waitlist</p>
          </div>

          <section className="mt-16 w-full pb-16 sm:mt-20 sm:pb-20">
            <div className="mb-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-black/10" />
              <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-3 py-1 text-[12px] text-gray-600 shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-gray-900" />
                Announcements
              </span>
              <div className="h-px flex-1 bg-black/10" />
            </div>

            <div className="space-y-4 text-left">
              {announcements.map((item) => (
                <article
                  key={item.title}
                  className="relative ml-4 rounded-2xl bg-white py-5 pl-8 pr-5 shadow-[0_8px_30px_rgba(0,0,0,0.05)] sm:ml-5 sm:py-6 sm:pl-10 sm:pr-6"
                >
                  <span className="absolute -left-4 top-6 flex h-8 w-8 items-center justify-center rounded-full bg-[#111] sm:top-1/2 sm:-translate-y-1/2">
                    <HugeiconsIcon icon={PinIcon} size={14} color="#ffffff" strokeWidth={1.8} />
                  </span>

                  <div className="grid gap-4 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)_auto] sm:items-center sm:gap-6">
                    <div>
                      <h2 className="text-[15px] font-semibold text-gray-900">{item.title}</h2>
                      <p className="mt-1 text-xs text-gray-400">{item.date}</p>
                    </div>

                    <p className="border-black/5 text-sm leading-relaxed text-gray-500 sm:border-l sm:pl-6">
                      {item.body}
                    </p>

                    <div className="flex items-center gap-2.5 sm:border-l sm:border-black/5 sm:pl-6">
                      <SurePlugMark size={32} className="shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[13px] font-medium leading-tight text-gray-900">{item.person}</p>
                        <p className="text-[11px] text-gray-400">{item.role}</p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Waitlist;
