import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft01Icon } from '@hugeicons/core-free-icons';

const logoWhite =
  'https://res.cloudinary.com/dujux4xcs/image/upload/v1743598694/Group_21_1_j2gixb.svg';

type AuthLayoutProps = {
  title: string;
  subtitle?: string;
  backTo?: { label: string; href: string };
  children: ReactNode;
  maxWidth?: 'md' | 'lg' | 'xl';
};

const maxWidthClass = {
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

const AuthLayout = ({ title, subtitle, backTo, children, maxWidth = 'md' }: AuthLayoutProps) => {
  return (
    <div className="bg-white text-gray-900 min-h-screen flex flex-col overflow-x-hidden">
      <section className="hero-grain sticky top-0 z-50 relative overflow-hidden rounded-b-[1.75rem] sm:rounded-b-[2.5rem] shrink-0">
        <header className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 flex items-center justify-center">
          <Link to="/" className="shrink-0">
            <img src={logoWhite} alt="SurePlug" className="h-7 sm:h-8 w-auto" />
          </Link>
        </header>
      </section>

      <main className="flex-1 flex items-start sm:items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
        <div className={`w-full ${maxWidthClass[maxWidth]}`}>
          {backTo && (
            <Link
              to={backTo.href}
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} size={15} color="currentColor" strokeWidth={2} />
              {backTo.label}
            </Link>
          )}

          <div className="profile-card p-6 sm:p-8">
            <div className="mb-6">
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight">{title}</h1>
              {subtitle && <p className="mt-2 text-sm text-gray-500 leading-relaxed">{subtitle}</p>}
            </div>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
