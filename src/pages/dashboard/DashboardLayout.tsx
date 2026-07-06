import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Home01Icon,
  UserIcon,
  Package01Icon,
  Bookmark01Icon,
  Certificate01Icon,
  LegalDocument01Icon,
  Logout01Icon,
  Menu01Icon,
  Cancel01Icon,
  ArrowLeft01Icon,
} from '@hugeicons/core-free-icons';
import { useAuth } from '../../context/AuthContext';

const LOGO = 'https://res.cloudinary.com/dujux4xcs/image/upload/v1743514302/Group_21_zddu9f.svg';

const AVATAR_PLACEHOLDER = (name: string) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=019B5F&color=fff&size=64`;

interface NavItem {
  label: string;
  to: string;
  icon: typeof Home01Icon;
  end?: boolean;
}

const navItems: NavItem[] = [
  { label: 'Overview',     to: '/dashboard',                icon: Home01Icon,       end: true },
  { label: 'Profile',      to: '/dashboard/profile',        icon: UserIcon },
  { label: 'Services',     to: '/dashboard/services',       icon: Package01Icon },
  { label: 'Bookings',     to: '/dashboard/bookings',       icon: Bookmark01Icon },
  { label: 'Verification', to: '/dashboard/verification',   icon: Certificate01Icon },
  { label: 'Disputes',     to: '/dashboard/disputes',       icon: LegalDocument01Icon },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const close = () => setSidebarOpen(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const displayName = user ? `${user.firstName} ${user.lastName}`.trim() : '';
  const avatarSrc = user?.avatar?.url ?? (user ? AVATAR_PLACEHOLDER(displayName) : '');

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-6 pb-5 border-b border-gray-100">
        <Link to="/" onClick={close} className="inline-block mb-4">
          <img src={LOGO} alt="SurePlug" className="h-6 w-auto" />
        </Link>
        <div className="flex items-center gap-3">
          <img
            src={avatarSrc}
            alt={displayName}
            className="w-10 h-10 rounded-full object-cover border border-gray-200 shrink-0"
          />
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-gray-900 truncate">{displayName}</p>
            <p className="text-[11px] text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-3 space-y-0.5">
        {navItems.map(({ label, to, icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={close}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
                isActive
                  ? 'bg-[#019B5F] text-white shadow-sm shadow-[#019B5F]/20'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <HugeiconsIcon icon={icon} size={16} strokeWidth={isActive ? 2 : 1.75} color="currentColor" />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 pb-5 pt-3 border-t border-gray-100 space-y-0.5">
        <Link
          to="/"
          onClick={close}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={16} strokeWidth={1.75} color="currentColor" />
          Back to site
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[13px] font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        >
          <HugeiconsIcon icon={Logout01Icon} size={16} strokeWidth={1.75} color="currentColor" />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#f5f5f7] overflow-hidden">

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 lg:w-60 flex-shrink-0 flex-col bg-white border-r border-gray-200">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={close} />
          <aside className="relative flex flex-col w-64 bg-white z-50">
            <button
              onClick={close}
              className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={2} color="currentColor" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex items-center gap-3 px-4 sm:px-6 py-3.5 bg-white border-b border-gray-200/70 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <HugeiconsIcon icon={Menu01Icon} size={20} strokeWidth={1.75} color="currentColor" />
          </button>
          <div className="md:hidden">
            <img src={LOGO} alt="SurePlug" className="h-5 w-auto" />
          </div>
          <p className="hidden md:block text-[15px] font-semibold text-gray-900">My Dashboard</p>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
