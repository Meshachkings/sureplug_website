import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Home01Icon,
  Calendar01Icon,
  Message01Icon,
  HeartIcon,
  Settings01Icon,
  Logout01Icon,
  Menu01Icon,
  Cancel01Icon,
  StarIcon,
  Location01Icon,
  CheckmarkCircle01Icon,
  Clock01Icon,
  ArrowRight01Icon,
} from '@hugeicons/core-free-icons';
import { taskers } from '../data/taskers';
import { formatNaira } from '../lib/format';

const WHITE_LOGO = 'https://res.cloudinary.com/dujux4xcs/image/upload/v1743598694/Group_21_1_j2gixb.svg';
const DARK_LOGO = 'https://res.cloudinary.com/dujux4xcs/image/upload/v1743514302/Group_21_zddu9f.svg';

type NavItem = {
  label: string;
  icon: typeof Home01Icon;
  id: string;
};

const navItems: NavItem[] = [
  { label: 'Overview', icon: Home01Icon, id: 'overview' },
  { label: 'My Bookings', icon: Calendar01Icon, id: 'bookings' },
  { label: 'Messages', icon: Message01Icon, id: 'messages' },
  { label: 'Saved Taskers', icon: HeartIcon, id: 'saved' },
  { label: 'Settings', icon: Settings01Icon, id: 'settings' },
];

const upcomingBookings = [
  {
    id: 'booking-bryan',
    tasker: taskers.find((t) => t.id === 'bryan')!,
    date: 'Tomorrow, 10:00 AM',
    status: 'Confirmed' as const,
    price: 15000,
  },
  {
    id: 'booking-timi',
    tasker: taskers.find((t) => t.id === 'timi')!,
    date: 'Fri 20 Jun, 9:00 AM',
    status: 'Pending' as const,
    price: 4500,
  },
];

const recentActivity = [
  {
    id: 'act-1',
    type: 'Booking confirmed',
    detail: 'Bryan (Electrician)',
    time: '2 hrs ago',
    icon: CheckmarkCircle01Icon,
    iconColor: '#019B5F',
  },
  {
    id: 'act-2',
    type: 'Payment processed',
    detail: '₦12,000 to Paul Liam',
    time: 'Yesterday',
    icon: ArrowRight01Icon,
    iconColor: '#6366f1',
  },
  {
    id: 'act-3',
    type: 'Review submitted',
    detail: '5 stars for Timi',
    time: '3 days ago',
    icon: StarIcon,
    iconColor: '#FBBF24',
  },
  {
    id: 'act-4',
    type: 'New message',
    detail: 'from Marcus',
    time: '5 days ago',
    icon: Message01Icon,
    iconColor: '#64748b',
  },
];

const statusStyles = {
  'In Progress': 'bg-amber-50 text-amber-700 border border-amber-200',
  Confirmed: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  Pending: 'bg-gray-100 text-gray-600 border border-gray-200',
};

const recommendedTaskers = taskers.slice(0, 4);

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col fixed inset-y-0 left-0 w-64 z-30" style={{ backgroundColor: '#0f1c18' }}>
        <div className="flex items-center px-6 py-5 border-b border-white/10">
          <img src={WHITE_LOGO} alt="SurePlug" className="h-8 w-auto" />
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {navItems.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors mb-0.5 text-left ${
                  active
                    ? 'border-l-2 border-mint bg-white/5 text-white pl-[10px]'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <HugeiconsIcon
                  icon={item.icon}
                  size={18}
                  color={active ? '#019B5F' : 'currentColor'}
                  strokeWidth={active ? 2 : 1.5}
                />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-mint/20 flex items-center justify-center shrink-0">
              <span className="text-mint text-sm font-bold">AO</span>
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold truncate">Ada Okonkwo</p>
              <p className="text-white/40 text-xs truncate">Customer</p>
            </div>
          </div>
          <button className="flex items-center gap-2 text-white/50 hover:text-white/80 text-xs transition-colors">
            <HugeiconsIcon icon={Logout01Icon} size={15} color="currentColor" strokeWidth={1.5} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-30 bg-white border-b border-gray-200 flex items-center justify-between px-4 h-14">
        <img src={DARK_LOGO} alt="SurePlug" className="h-7 w-auto" />
        <button
          onClick={() => setMobileOpen(true)}
          className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label="Open menu"
        >
          <HugeiconsIcon icon={Menu01Icon} size={22} color="currentColor" strokeWidth={1.5} />
        </button>
      </div>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-72 flex flex-col transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ backgroundColor: '#0f1c18' }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <img src={WHITE_LOGO} alt="SurePlug" className="h-7 w-auto" />
          <button
            onClick={() => setMobileOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close menu"
          >
            <HugeiconsIcon icon={Cancel01Icon} size={18} color="currentColor" strokeWidth={1.5} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {navItems.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors mb-0.5 text-left ${
                  active
                    ? 'border-l-2 border-mint bg-white/5 text-white pl-[10px]'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <HugeiconsIcon
                  icon={item.icon}
                  size={18}
                  color={active ? '#019B5F' : 'currentColor'}
                  strokeWidth={active ? 2 : 1.5}
                />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-mint/20 flex items-center justify-center shrink-0">
              <span className="text-mint text-sm font-bold">AO</span>
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold truncate">Ada Okonkwo</p>
              <p className="text-white/40 text-xs truncate">Customer</p>
            </div>
          </div>
          <button className="flex items-center gap-2 text-white/50 hover:text-white/80 text-xs transition-colors">
            <HugeiconsIcon icon={Logout01Icon} size={15} color="currentColor" strokeWidth={1.5} />
            Sign out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-64 min-h-screen">
        <div className="pt-14 lg:pt-0">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">

            {/* Welcome banner */}
            <div className="profile-card p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                  Good morning, Ada 👋
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Here&apos;s what&apos;s happening with your bookings
                </p>
              </div>
              <Link to="/taskers" className="btn-pill shrink-0 self-start sm:self-auto">
                Book a tasker
              </Link>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="profile-card p-4 sm:p-5">
                <div className="w-9 h-9 rounded-xl bg-mint/10 flex items-center justify-center mb-3">
                  <HugeiconsIcon icon={Calendar01Icon} size={18} color="#019B5F" strokeWidth={2} />
                </div>
                <p className="text-2xl font-bold text-gray-900 leading-none">12</p>
                <p className="mt-1 text-xs text-gray-500">Total Bookings</p>
              </div>

              <div className="profile-card p-4 sm:p-5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center mb-3">
                  <HugeiconsIcon icon={CheckmarkCircle01Icon} size={18} color="#059669" strokeWidth={2} />
                </div>
                <p className="text-2xl font-bold text-gray-900 leading-none">9</p>
                <p className="mt-1 text-xs text-gray-500">Completed</p>
              </div>

              <div className="profile-card p-4 sm:p-5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center mb-3">
                  <span className="text-indigo-600 text-sm font-bold leading-none">₦</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 leading-none">₦186.5k</p>
                <p className="mt-1 text-xs text-gray-500">Total Spent</p>
              </div>

              <div className="profile-card p-4 sm:p-5">
                <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center mb-3">
                  <HugeiconsIcon icon={HeartIcon} size={18} color="#f43f5e" strokeWidth={2} />
                </div>
                <p className="text-2xl font-bold text-gray-900 leading-none">4</p>
                <p className="mt-1 text-xs text-gray-500">Saved Taskers</p>
              </div>
            </div>

            {/* Active booking */}
            <div className="profile-card overflow-hidden">
              <div className="px-5 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-base font-semibold text-gray-900">Active Booking</h2>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyles['In Progress']}`}>
                  In Progress
                </span>
              </div>
              <div className="p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                    <img
                      src={taskers[0].image}
                      alt={taskers[0].name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h3 className="text-base font-bold text-gray-900">{taskers[0].name}</h3>
                        <p className="text-sm text-gray-500 mt-0.5">{taskers[0].role}</p>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatNaira(taskers[0].price)}/hr
                      </p>
                    </div>
                    <div className="mt-3 flex flex-col sm:flex-row gap-2 sm:gap-5 text-xs text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <HugeiconsIcon icon={Clock01Icon} size={14} color="#9ca3af" strokeWidth={1.5} />
                        Today, 2:00 PM
                      </span>
                      <span className="flex items-center gap-1.5">
                        <HugeiconsIcon icon={Location01Icon} size={14} color="#9ca3af" strokeWidth={1.5} />
                        12 Adeola Odeku St, Lagos
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  <button className="btn-pill-outline text-xs px-5 py-2.5">View details</button>
                  <button className="btn-pill text-xs px-5 py-2.5">Contact</button>
                </div>
              </div>
            </div>

            {/* Upcoming bookings */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-gray-900">Upcoming Bookings</h2>
                <button className="text-xs text-mint font-medium hover:underline">View all</button>
              </div>
              <div className="space-y-3">
                {upcomingBookings.map((booking) => (
                  <div key={booking.id} className="profile-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    <div className="w-11 h-11 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                      <img
                        src={booking.tasker.image}
                        alt={booking.tasker.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                        <p className="text-sm font-semibold text-gray-900">{booking.tasker.name}</p>
                        <span className="text-gray-300 hidden sm:inline">·</span>
                        <p className="text-xs text-gray-500">{booking.tasker.role}</p>
                        <span
                          className={`ml-auto sm:ml-0 text-[11px] font-medium px-2 py-0.5 rounded-full ${statusStyles[booking.status]}`}
                        >
                          {booking.status}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <HugeiconsIcon icon={Clock01Icon} size={12} color="#9ca3af" strokeWidth={1.5} />
                          {booking.date}
                        </span>
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">
                          {booking.tasker.category}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 shrink-0 sm:text-right">
                      {formatNaira(booking.price)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended taskers */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-gray-900">Recommended Taskers</h2>
                <Link to="/taskers" className="text-xs text-mint font-medium hover:underline flex items-center gap-1">
                  See all
                  <HugeiconsIcon icon={ArrowRight01Icon} size={13} color="#019B5F" strokeWidth={2} />
                </Link>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4">
                {recommendedTaskers.map((tasker) => (
                  <div
                    key={tasker.id}
                    className="profile-card shrink-0 w-44 sm:w-auto overflow-hidden flex flex-col"
                  >
                    <div className="h-28 bg-gray-100 overflow-hidden">
                      <img
                        src={tasker.image}
                        alt={tasker.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3 flex flex-col flex-1">
                      <p className="text-sm font-bold text-gray-900 truncate">{tasker.name}</p>
                      <p className="text-xs text-gray-500 truncate">{tasker.role}</p>
                      <div className="mt-1.5 flex items-center gap-1 text-xs text-gray-600">
                        <HugeiconsIcon icon={StarIcon} size={12} color="#FBBF24" strokeWidth={2} />
                        <span>{tasker.rating}</span>
                        <span className="text-gray-300 mx-0.5">·</span>
                        <span className="text-gray-500 truncate">{formatNaira(tasker.price)}/hr</span>
                      </div>
                      <Link
                        to={`/taskers/${tasker.id}`}
                        className="mt-2.5 btn-pill text-[11px] px-0 py-2 w-full text-center"
                      >
                        Book
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent activity */}
            <div className="profile-card p-5 sm:p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Recent Activity</h2>
              <div className="space-y-0">
                {recentActivity.map((item, index) => (
                  <div key={item.id} className="flex gap-3 sm:gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${item.iconColor}15` }}
                      >
                        <HugeiconsIcon
                          icon={item.icon}
                          size={15}
                          color={item.iconColor}
                          strokeWidth={2}
                        />
                      </div>
                      {index < recentActivity.length - 1 && (
                        <div className="w-px flex-1 bg-gray-100 my-1" />
                      )}
                    </div>
                    <div className={`pb-4 flex-1 min-w-0 ${index < recentActivity.length - 1 ? '' : ''}`}>
                      <div className="flex items-start justify-between gap-2 pt-1">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.type}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{item.detail}</p>
                        </div>
                        <span className="text-[11px] text-gray-400 shrink-0 pt-0.5">{item.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
