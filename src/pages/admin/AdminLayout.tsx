import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import type { IconSvgElement } from '@hugeicons/react';
import {
  DashboardSquare01Icon,
  UserGroupIcon,
  Package01Icon,
  Bookmark01Icon,
  FavouriteIcon,
  Certificate01Icon,
  Building04Icon,
  ShieldUserIcon,
  Mail01Icon,
  Clock01Icon,
  Notification01Icon,
  Logout01Icon,
  Menu01Icon,
  Cancel01Icon,
} from '@hugeicons/core-free-icons';
import { useAuth } from '../../context/AuthContext';
import { api, type ApiResponse, type ApiPagination } from '../../lib/adminApi';

const LOGO_WHITE = 'https://res.cloudinary.com/dujux4xcs/image/upload/v1743598694/Group_21_1_j2gixb.svg';

interface NavItem {
  label: string;
  to: string;
  icon: IconSvgElement;
  permission?: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard',           to: '/admin',                         icon: DashboardSquare01Icon, permission: 'view_dashboard' },
  { label: 'Users',               to: '/admin/users',                   icon: UserGroupIcon,          permission: 'manage_users' },
  { label: 'Services',            to: '/admin/services',                icon: Package01Icon,          permission: 'manage_services' },
  { label: 'Bookings',            to: '/admin/bookings',                icon: Bookmark01Icon,         permission: 'manage_bookings' },
  { label: 'Reviews',             to: '/admin/reviews',                 icon: FavouriteIcon,          permission: 'manage_reviews' },
  { label: 'Verifications',       to: '/admin/verifications',           icon: Certificate01Icon,      permission: 'manage_verifications' },
  { label: 'Business Verify',     to: '/admin/business-verifications',  icon: Building04Icon,         permission: 'manage_business_verifications' },
  { label: 'Staff',               to: '/admin/staff',                   icon: ShieldUserIcon,         permission: 'manage_staff' },
  { label: 'Contacts',            to: '/admin/contacts',                icon: Mail01Icon,             permission: 'manage_contacts' },
  { label: 'Waitlist',            to: '/admin/waitlist',                icon: Clock01Icon,            permission: 'manage_waitlist' },
  { label: 'Notifications',       to: '/admin/notifications',           icon: Notification01Icon,     permission: 'send_notifications' },
];

const PAGE_TITLES: Record<string, string> = {
  '/admin/business-verifications': 'Business Verifications',
  '/admin/staff': 'Staff Management',
};

function getPageTitle(pathname: string): string {
  return PAGE_TITLES[pathname] ?? navItems.find((n) => n.to === pathname)?.label ?? 'Admin';
}

export default function AdminLayout() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const close = () => setSidebarOpen(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // For subadmins: fetch permissions from the staff list if not already in the user object
  useEffect(() => {
    if (user?.role !== 'subadmin' || user?.permissions?.length) return;
    api.get<ApiResponse<{ staff: Array<{ _id: string; permissions: string[] }>; pagination: ApiPagination }>>(
      '/admin/staff?limit=100',
      true
    ).then((res) => {
      const me = (res.data.staff ?? []).find((s) => s._id === user._id);
      if (me) updateUser({ permissions: me.permissions });
    }).catch(() => {/* silently ignore */});
  }, [user?._id, user?.role]); // eslint-disable-line react-hooks/exhaustive-deps

  const isAdmin = user?.role === 'admin';
  const permissions = user?.permissions;
  const visibleNavItems = navItems.filter(({ permission }) =>
    isAdmin || !permission || (permissions ?? []).includes(permission)
  );

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 pt-6 pb-5">
        <Link to="/admin" onClick={close} className="inline-block">
          <img src={LOGO_WHITE} alt="SurePlug" className="h-7 w-auto" />
        </Link>
        <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/25 pl-0.5">
          Admin Console
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {visibleNavItems.map(({ label, to, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/admin'}
            onClick={close}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-[#019B5F] text-white shadow-sm shadow-[#019B5F]/30'
                  : 'text-white/50 hover:text-white hover:bg-white/8'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <HugeiconsIcon
                  icon={icon}
                  size={16}
                  strokeWidth={isActive ? 2 : 1.75}
                  color="currentColor"
                />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="px-3 pb-5 pt-3 border-t border-white/8">
        {user && (
          <div className="flex items-center gap-2.5 px-3 py-2.5 mb-1">
            <div className="w-7 h-7 rounded-full bg-[#019B5F]/30 flex items-center justify-center shrink-0 text-[11px] font-bold text-[#019B5F]">
              {user.firstName?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-[12px] font-semibold text-white/80 truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-[10px] text-white/35 truncate">{user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[13px] font-medium text-white/40 hover:text-white hover:bg-white/8 transition-colors"
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
      <aside className="hidden md:flex w-56 lg:w-60 flex-shrink-0 flex-col bg-[#0d1a13]">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={close} />
          <aside className="relative flex flex-col w-64 bg-[#0d1a13] z-50">
            <button
              onClick={close}
              className="absolute top-4 right-4 p-1.5 rounded-full text-white/40 hover:text-white/80 hover:bg-white/10 transition-colors"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={2} color="currentColor" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <header className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-white border-b border-gray-200/70 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <HugeiconsIcon icon={Menu01Icon} size={20} strokeWidth={1.75} color="currentColor" />
            </button>
            <div>
              <h1 className="text-[15px] font-semibold text-gray-900 leading-none">
                {getPageTitle(location.pathname)}
              </h1>
              <p className="hidden sm:block text-[11px] text-gray-400 mt-0.5">
                SurePlug Admin Console
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              target="_blank"
              className="hidden sm:inline-flex text-xs font-medium text-gray-400 hover:text-gray-700 transition-colors"
            >
              View site →
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 border border-gray-200 rounded-full px-3 py-1.5 hover:border-gray-300 transition-colors"
            >
              <HugeiconsIcon icon={Logout01Icon} size={13} strokeWidth={2} color="currentColor" />
              Sign out
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
