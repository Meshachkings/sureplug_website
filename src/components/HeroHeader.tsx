import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { Menu01Icon, Cancel01Icon, ArrowRight01Icon, Logout01Icon } from '@hugeicons/core-free-icons';
import { useAuth } from '../context/AuthContext';

const logoWhite =
  'https://res.cloudinary.com/dujux4xcs/image/upload/v1743598694/Group_21_1_j2gixb.svg';

export const heroNavLinks = [
  { label: 'Explore Plugs', href: '/taskers' },
  { label: 'How it Works', href: '/#how-it-works' },
  { label: 'About Us', href: '/about' },
];

const AVATAR_PLACEHOLDER = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=019B5F&color=fff&size=64`;

const HeroHeader = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const close = () => setMobileMenuOpen(false);

  const handleLogout = () => {
    logout();
    close();
    navigate('/');
  };

  const displayName = user ? `${user.firstName} ${user.lastName}`.trim() : '';
  const avatarSrc = user?.avatar?.url ?? (user ? AVATAR_PLACEHOLDER(displayName) : '');

  return (
    <>
      <div className="h-[60px] sm:h-[68px] lg:h-[76px] bg-[#0f1c18]" aria-hidden="true" />

      <header
        className={`fixed top-0 left-0 right-0 z-[9999] w-full bg-[#0f1c18] transition-all duration-300 ${
          scrolled ? 'bg-opacity-95 backdrop-blur-md shadow-sm' : 'bg-opacity-100'
        }`}
      >
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6">
          <div className="flex items-center justify-between gap-3">
            <Link to="/" className="shrink-0" onClick={close}>
              <img src={logoWhite} alt="SurePlug" className="h-6 sm:h-7 lg:h-8 w-auto" />
            </Link>

            <nav className="hidden xl:flex items-center justify-center gap-6 2xl:gap-8 absolute left-1/2 -translate-x-1/2">
              {heroNavLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-white/75 text-[13px] font-normal hover:text-white transition-colors whitespace-nowrap"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3 sm:gap-5 shrink-0">
              {user ? (
                <div className="hidden lg:flex items-center gap-4">
                  {(user.role === 'admin' || user.role === 'subadmin') ? (
                    <Link
                      to="/admin"
                      className="text-white/70 text-[13px] font-medium hover:text-white transition-colors"
                    >
                      Admin panel
                    </Link>
                  ) : (
                    <Link
                      to="/dashboard"
                      className="text-white/70 text-[13px] font-medium hover:text-white transition-colors"
                    >
                      Dashboard
                    </Link>
                  )}
                  <div className="flex items-center gap-2.5">
                    <img
                      src={avatarSrc}
                      alt={displayName}
                      className="w-8 h-8 rounded-full object-cover border border-white/20"
                    />
                    <span className="text-white/80 text-[13px] font-medium truncate max-w-[120px]">
                      {user.firstName}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 text-white/60 text-[13px] hover:text-white transition-colors"
                    aria-label="Log out"
                  >
                    <HugeiconsIcon icon={Logout01Icon} size={15} color="currentColor" strokeWidth={2} />
                    Log out
                  </button>
                </div>
              ) : (
                <div className="hidden lg:flex items-center gap-5">
                  <Link
                    to="/login"
                    className="text-white/80 text-[13px] font-medium hover:text-white transition-colors"
                  >
                    Login
                  </Link>
                  <Link to="/become-a-provider" className="btn-pill">
                    Join as Pro
                  </Link>
                </div>
              )}

              <button
                className="xl:hidden text-white p-1 -mr-1"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
              >
                <HugeiconsIcon
                  icon={mobileMenuOpen ? Cancel01Icon : Menu01Icon}
                  size={22}
                  color="currentColor"
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Full-screen mobile menu overlay */}
      <div
        className={`fixed inset-0 z-[9998] xl:hidden flex flex-col transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ background: 'linear-gradient(160deg, #0d1a15 0%, #111f1a 60%, #0a1510 100%)' }}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5">
          <Link to="/" onClick={close}>
            <img src={logoWhite} alt="SurePlug" className="h-6 sm:h-7 w-auto" />
          </Link>
          <button
            onClick={close}
            aria-label="Close menu"
            className="w-10 h-10 flex items-center justify-center rounded-full border border-white/10 text-white hover:bg-white/5 transition-colors"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={18} color="currentColor" />
          </button>
        </div>

        <nav className="flex-1 flex flex-col justify-center px-6 sm:px-8 gap-1 mt-2">
          {heroNavLinks.map((link, i) => (
            <Link
              key={link.label}
              to={link.href}
              onClick={close}
              className="group flex items-center justify-between py-5 border-b border-white/8 last:border-b-0"
            >
              <div className="flex items-baseline gap-4">
                <span className="text-[11px] font-medium text-white/25 tabular-nums w-5">
                  0{i + 1}
                </span>
                <span className="text-2xl sm:text-3xl font-semibold text-white/90 group-hover:text-white transition-colors tracking-tight">
                  {link.label}
                </span>
              </div>
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={18}
                color="currentColor"
                className="text-white/20 group-hover:text-white/60 transition-colors -translate-x-1 group-hover:translate-x-0 duration-200"
              />
            </Link>
          ))}
        </nav>

        <div className="px-6 sm:px-8 pb-10 sm:pb-12 pt-6 flex flex-col gap-3">
          {user ? (
            <>
              <div className="flex items-center gap-3 px-1 mb-1">
                <img
                  src={avatarSrc}
                  alt={displayName}
                  className="w-9 h-9 rounded-full object-cover border border-white/20"
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{displayName}</p>
                  <p className="text-xs text-white/40 truncate">{user.email}</p>
                </div>
              </div>
              {(user.role === 'admin' || user.role === 'subadmin') ? (
                <Link
                  to="/admin"
                  onClick={close}
                  className="btn-pill w-full justify-center text-sm py-4"
                >
                  Admin panel
                </Link>
              ) : (
                <Link
                  to="/dashboard"
                  onClick={close}
                  className="btn-pill w-full justify-center text-sm py-4"
                >
                  Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="btn-pill-light w-full justify-center text-sm py-4"
              >
                <HugeiconsIcon icon={Logout01Icon} size={16} color="currentColor" strokeWidth={2} />
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/become-a-provider"
                onClick={close}
                className="btn-pill w-full justify-center text-sm py-4"
              >
                Join as Pro
              </Link>
              <Link
                to="/login"
                onClick={close}
                className="btn-pill-light w-full justify-center text-sm py-4"
              >
                Sign in
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default HeroHeader;
