import { Link, useNavigate } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowLeft01Icon, Home01Icon, Search01Icon } from '@hugeicons/core-free-icons';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Minimal header */}
      <header className="px-4 sm:px-6 py-5">
        <Link to="/">
          <img
            src="https://res.cloudinary.com/dujux4xcs/image/upload/v1743598694/Group_21_1_j2gixb.svg"
            alt="SurePlug"
            className="h-7 w-auto invert"
          />
        </Link>
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 text-center pb-16">
        {/* 404 number */}
        <div className="relative mb-6 select-none">
          <span className="text-[120px] sm:text-[160px] font-extrabold leading-none tracking-tighter text-gray-100">
            404
          </span>
          <span className="absolute inset-0 flex items-center justify-center text-[120px] sm:text-[160px] font-extrabold leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-gray-300 to-gray-100">
            404
          </span>
        </div>

        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-[#019B5F]/10 flex items-center justify-center mb-6 -mt-4">
          <HugeiconsIcon icon={Search01Icon} size={28} color="#019B5F" strokeWidth={1.75} />
        </div>

        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight">
          Page not found
        </h1>
        <p className="mt-3 text-sm sm:text-base text-gray-500 leading-relaxed max-w-sm">
          The page you're looking for doesn't exist or may have been moved.
        </p>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs sm:max-w-none sm:justify-center">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-pill-outline w-full sm:w-auto inline-flex items-center justify-center gap-2"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={15} color="currentColor" strokeWidth={2} />
            Go back
          </button>
          <Link to="/" className="btn-pill w-full sm:w-auto inline-flex items-center justify-center gap-2">
            <HugeiconsIcon icon={Home01Icon} size={15} color="currentColor" strokeWidth={2} />
            Back to home
          </Link>
        </div>

        {/* Quick links */}
        <div className="mt-10 pt-8 border-t border-gray-100 w-full max-w-sm">
          <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-4">
            Quick links
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { label: 'Explore Taskers', to: '/taskers' },
              { label: 'About Us', to: '/about' },
              { label: 'Contact', to: '/contact' },
              { label: 'Become a Pro', to: '/become-a-provider' },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-600 hover:border-gray-300 hover:text-gray-900 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
