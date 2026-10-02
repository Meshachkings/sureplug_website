import { FormEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  ArrowRight01Icon,
  Copy01Icon,
  Facebook01Icon,
  InstagramIcon,
  NewTwitterIcon,
  PinIcon,
  Tick01Icon,
} from '@hugeicons/core-free-icons';
import { api, type ApiResponse } from '../lib/api';
import ServiceSelect from '../components/ServiceSelect';

const PAGE_BG = '#0f1c18';

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
  'https://res.cloudinary.com/dujux4xcs/image/upload/v1743598694/Group_21_1_j2gixb.svg';

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
  },
  {
    title: 'iOS & Android',
    date: '12-08-2026',
    body: 'The apps are in development. You will get the download link as soon as we launch.',
    person: 'Mobile',
  },
  {
    title: 'Starting in Lagos',
    date: '04-08-2026',
    body: 'We are launching first in Lagos, then rolling out to more cities across Nigeria.',
    person: 'Launch',
  },
];

const Waitlist = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [joined, setJoined] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    if (!service) {
      setError('Please pick a service from the list.');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post<ApiResponse<{ discountCode?: string }>>('/waitlist', {
        email: email.trim(),
        phone: phone.trim(),
        service,
      });
      setDiscountCode(res.data?.discountCode ?? 'EARLYACCESS');
      setJoined(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not join the waitlist. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = async () => {
    if (!discountCode) return;
    try {
      await navigator.clipboard.writeText(discountCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtml = html.style.backgroundColor;
    const prevBody = body.style.backgroundColor;
    html.style.backgroundColor = PAGE_BG;
    body.style.backgroundColor = PAGE_BG;
    return () => {
      html.style.backgroundColor = prevHtml;
      body.style.backgroundColor = prevBody;
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden text-white selection:bg-mint/30" style={{ backgroundColor: PAGE_BG }}>
      <div className="pointer-events-none fixed inset-0 -z-10" style={{ backgroundColor: PAGE_BG }} aria-hidden />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 sm:px-6 lg:px-8">
        <header className="grid grid-cols-[1fr_auto] items-center gap-3 py-5 sm:grid-cols-3 sm:py-7">
          <Link to="/" className="justify-self-start">
            <img src={siteLogo} alt="SurePlug" className="h-6 w-auto sm:h-7" />
          </Link>

          <a
            href="mailto:hello@sureplug.com"
            className="hidden items-center justify-center gap-2 justify-self-center text-[13px] text-white/55 hover:text-white sm:inline-flex"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#22c55e] opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#22c55e]" />
            </span>
            hello@sureplug.com
          </a>

          <div className="flex items-center justify-self-end gap-3.5 text-white/80">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="transition-opacity hover:opacity-100 hover:text-white"
              >
                <HugeiconsIcon icon={social.icon} size={16} color="currentColor" strokeWidth={1.8} />
              </a>
            ))}
          </div>
        </header>

        <main className="flex flex-1 flex-col items-center pt-8 text-center sm:pt-14 lg:pt-16">
          <SurePlugMark size={72} className="drop-shadow-[0_18px_50px_rgba(1,219,134,0.28)]" />

          <h1 className="mt-7 max-w-xl text-[1.85rem] font-semibold leading-[1.15] tracking-tight text-white sm:mt-8 sm:text-[2.35rem] lg:text-[2.6rem]">
            Early access before launch
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/55 sm:text-[15px]">
            Be first in line to book skilled plugs for home repairs, cleaning, moving, and more.
          </p>

          <div className="mt-8 w-full max-w-[440px] sm:mt-9">
            {joined ? (
              <div className="rounded-3xl bg-white px-6 py-6 text-left shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
                <p className="text-sm leading-relaxed text-gray-600">
                  You&apos;re on the list. We&apos;ll write to{' '}
                  <span className="font-medium text-gray-900">{email}</span> when we launch.
                </p>
                {discountCode && (
                  <div className="mt-5 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                    <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-gray-400">
                      Your discount code
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <code className="flex-1 truncate text-lg font-semibold tracking-[0.08em] text-gray-900">
                        {discountCode}
                      </code>
                      <button
                        type="button"
                        onClick={handleCopyCode}
                        className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[#111] px-3.5 text-xs font-medium text-white transition-colors hover:bg-black"
                      >
                        <HugeiconsIcon
                          icon={copied ? Tick01Icon : Copy01Icon}
                          size={14}
                          color="currentColor"
                          strokeWidth={2}
                        />
                        {copied ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-gray-500">
                      Use this on your first Premium subscription for early-access pricing.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="relative overflow-visible rounded-3xl bg-white p-2 text-left shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
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
                  className="w-full appearance-none bg-transparent px-4 py-4 text-[16px] text-gray-900 outline-none placeholder:text-gray-400 [-webkit-text-size-adjust:100%]"
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
                  className="w-full appearance-none bg-transparent px-4 py-4 text-[16px] text-gray-900 outline-none placeholder:text-gray-400 [-webkit-text-size-adjust:100%]"
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
                  className="mt-1 inline-flex h-14 w-full items-center justify-center gap-1.5 rounded-full bg-[#019B5F] text-base font-medium text-white transition-colors hover:bg-[#017a4c] disabled:opacity-70 sm:h-12 sm:text-sm"
                >
                  {loading ? 'Joining…' : 'Join Waitlist'}
                  {!loading && (
                    <HugeiconsIcon icon={ArrowRight01Icon} size={16} color="currentColor" strokeWidth={2.5} />
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
                  className="h-8 w-8 rounded-full border-2 border-[#0f1c18] object-cover"
                />
              ))}
            </div>
            <p className="text-[13px] text-white/50">Join others on the waitlist</p>
          </div>

          <section className="mt-16 w-full pb-16 sm:mt-20 sm:pb-20">
            <div className="mb-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10" />
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[12px] text-white/65 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-mint" />
                Announcements
              </span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <div className="space-y-4 text-left">
              {announcements.map((item) => (
                <article
                  key={item.title}
                  className="relative ml-4 rounded-2xl border border-white/10 bg-white/[0.06] py-5 pl-8 pr-5 backdrop-blur-sm sm:ml-5 sm:py-6 sm:pl-10 sm:pr-6"
                >
                  <span className="absolute -left-4 top-6 flex h-8 w-8 items-center justify-center rounded-full bg-mint sm:top-1/2 sm:-translate-y-1/2">
                    <HugeiconsIcon icon={PinIcon} size={14} color="#ffffff" strokeWidth={1.8} />
                  </span>

                  <div className="grid gap-3 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)_auto] sm:items-center sm:gap-6">
                    <div>
                      <h2 className="text-[15px] font-semibold text-white">{item.title}</h2>
                      <p className="mt-1 text-xs text-white/40">{item.date}</p>
                    </div>

                    <p className="border-white/10 text-sm leading-relaxed text-white/55 sm:border-l sm:pl-6">
                      {item.body}
                    </p>

                    <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-white/35 sm:border-l sm:border-white/10 sm:pl-6 sm:text-right">
                      {item.person}
                    </p>
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
