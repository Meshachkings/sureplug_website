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
  LegalDocument01Icon,
  ShieldUserIcon,
  Mail01Icon,
  Clock01Icon,
  Notification01Icon,
  Logout01Icon,
  Menu01Icon,
  Cancel01Icon,
  ArrowUpRight01Icon,
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
  { label: 'Disputes',            to: '/admin/disputes',                icon: LegalDocument01Icon,    permission: 'manage_disputes' },
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
      <div className="px-5 pt-6 pb-5 border-b border-white/[0.06]">
        <Link to="/admin" onClick={close} className="inline-block">
          <img src={LOGO_WHITE} alt="SurePlug" className="h-7 w-auto opacity-95" />
        </Link>
        <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500">
          Admin Console
        </p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {visibleNavItems.map(({ label, to, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/admin'}
            onClick={close}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[13px] font-medium transition-colors duration-150 ${
                isActive
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.05]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <HugeiconsIcon
                  icon={icon}
                  size={17}
                  strokeWidth={isActive ? 2 : 1.75}
                  color="currentColor"
                />
                <span className="truncate">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 pb-5 pt-3 border-t border-white/[0.06]">
        {user && (
          <div className="flex items-center gap-3 px-2.5 py-2 mb-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-700 text-xs font-semibold text-slate-200 shrink-0">
              {user.firstName?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-slate-200 truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-[11px] text-slate-500 truncate capitalize">{user.role}</p>
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 px-3 py-2.5 text-[13px] font-medium text-slate-400 transition-colors hover:border-white/20 hover:bg-white/[0.04] hover:text-slate-200"
        >
          <HugeiconsIcon icon={Logout01Icon} size={15} strokeWidth={1.75} color="currentColor" />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#eef0f3]">
      <aside className="hidden md:flex w-60 lg:w-64 flex-shrink-0 flex-col bg-[#111827]">
        <SidebarContent />
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="fixed inset-0 bg-black/55 backdrop-blur-sm" onClick={close} />
          <aside className="relative flex flex-col w-[280px] bg-[#111827] z-50 shadow-2xl">
            <button
              type="button"
              onClick={close}
              className="absolute top-4 right-4 z-10 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={16} strokeWidth={2} color="currentColor" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3.5 bg-white border-b border-slate-200/80 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <HugeiconsIcon icon={Menu01Icon} size={18} strokeWidth={1.75} color="currentColor" />
            </button>
            <div className="min-w-0">
              <h1 className="text-base sm:text-[17px] font-semibold tracking-tight text-slate-900 leading-none truncate">
                {getPageTitle(location.pathname)}
              </h1>
              <p className="hidden sm:block text-xs text-slate-400 mt-1">
                SurePlug Admin Console
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              to="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
            >
              View site
              <HugeiconsIcon icon={ArrowUpRight01Icon} size={14} strokeWidth={2} color="currentColor" />
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
            >
              <HugeiconsIcon icon={Logout01Icon} size={15} strokeWidth={2} color="currentColor" />
              Sign out
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
