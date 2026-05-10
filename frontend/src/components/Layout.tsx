import {
  Backpack,
  BarChart3,
  Compass,
  FileText,
  LayoutDashboard,
  Map,
  MapPin,
  Plane,
  Receipt,
  Search,
  UserRound,
  Users,
} from 'lucide-react';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { Link, matchPath, useLocation } from 'react-router-dom';
import AppearanceDropdown from './AppearanceDropdown';
import NotificationDropdown from './NotificationDropdown';
import UserMenuDropdown from './UserMenuDropdown';

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { path: '/dashboard', match: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/trips', match: '/trips', icon: Plane, label: 'My Trips' },
  { path: '/trip/create', match: '/trip/create', icon: MapPin, label: 'Plan a Trip' },
  { path: '/itinerary/1', match: '/itinerary/:id', icon: Compass, label: 'Itinerary' },
  { path: '/map/1', match: '/map/:id', icon: Map, label: 'Map View' },
  { path: '/search/cities', match: '/search/cities', icon: Search, label: 'City Search' },
  { path: '/search/activities', match: '/search/activities', icon: Compass, label: 'Activity Search' },
  { path: '/community', match: '/community', icon: Users, label: 'Community' },
  { path: '/checklist', match: '/checklist', icon: Backpack, label: 'Packing' },
  { path: '/notes', match: '/notes', icon: FileText, label: 'Notes' },
  { path: '/invoice/1', match: '/invoice/:id', icon: Receipt, label: 'Invoice' },
  { path: '/profile', match: '/profile', icon: UserRound, label: 'Profile' },
  { path: '/admin', match: '/admin', icon: BarChart3, label: 'Admin' },
];

function NavLink({ item, compact = false }: { item: (typeof navItems)[number]; compact?: boolean }) {
  const location = useLocation();
  const Icon = item.icon;
  const isActive = Boolean(matchPath({ path: item.match, end: true }, location.pathname));

  return (
    <Link
      to={item.path}
      className={`flex items-center gap-3 rounded-[10px] transition-colors ${
        compact ? 'px-3 py-2.5 text-sm' : 'px-4 py-3 text-sm'
      } ${
        isActive
          ? 'bg-amber-50 text-[#BA7517] dark:bg-amber-400/10 dark:text-amber-300'
          : 'text-stone-600 hover:bg-[#F5F4F0] hover:text-[#EF9F27] dark:text-stone-300 dark:hover:bg-stone-800'
      }`}
    >
      <Icon size={compact ? 17 : 19} />
      <span className="whitespace-nowrap font-medium">{item.label}</span>
    </Link>
  );
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [layoutStyle, setLayoutStyle] = useState<'top' | 'sidebar'>(() => {
    return (localStorage.getItem('layoutStyle') as 'top' | 'sidebar') || 'top';
  });

  useEffect(() => {
    const handleLayoutChange = () => {
      const newLayout = (localStorage.getItem('layoutStyle') as 'top' | 'sidebar') || 'top';
      setLayoutStyle(newLayout);
    };

    window.addEventListener('layoutChange', handleLayoutChange);
    return () => window.removeEventListener('layoutChange', handleLayoutChange);
  }, []);

  const pageTitle = useMemo(() => {
    return (
      navItems.find((item) => matchPath({ path: item.match, end: true }, location.pathname))?.label ||
      'Dashboard'
    );
  }, [location.pathname]);

  const topNavigation = (
    <nav className="sticky top-16 z-40 border-b border-[#E8E6E0] bg-white/95 shadow-sm backdrop-blur dark:border-stone-800 dark:bg-stone-900/95">
      <div className="px-2 sm:px-4">
        <div className="hide-scrollbar flex overflow-x-auto py-1">
          {navItems.map((item) => (
            <NavLink key={item.match} item={item} compact />
          ))}
        </div>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#F5F4F0] text-[#1C1917] dark:bg-stone-950 dark:text-stone-100">
      <header className="sticky top-0 z-50 border-b border-[#E8E6E0] bg-white/95 shadow-sm backdrop-blur dark:border-stone-800 dark:bg-stone-900/95">
        <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
          <Link to="/dashboard" className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-[10px] bg-amber-50 text-[#EF9F27] dark:bg-amber-400/10">
              <Plane size={20} />
            </div>
            <div className="min-w-0">
              <p className="font-sora text-lg font-bold leading-tight text-[#EF9F27]">Traveloop</p>
              <p className="hidden truncate text-xs text-stone-500 dark:text-stone-400 sm:block">
                {pageTitle}
              </p>
            </div>
          </Link>

          <div className="hidden flex-1 justify-center md:flex">
            <div className="relative w-full max-w-xl">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
              <input
                type="search"
                placeholder="Search trips & destinations..."
                className="traveloop-input h-10 w-full pl-10"
              />
            </div>
          </div>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <AppearanceDropdown />
            <NotificationDropdown />
            <UserMenuDropdown />
          </div>
        </div>
      </header>

      {layoutStyle === 'sidebar' ? (
        <div className="min-h-[calc(100vh-4rem)]">
          <aside className="fixed bottom-0 left-0 top-16 z-30 hidden w-64 overflow-y-auto border-r border-[#E8E6E0] bg-white px-2 py-4 dark:border-stone-800 dark:bg-stone-900 lg:block">
            <div className="mb-3 px-4">
              <p className="font-sora text-xs font-semibold uppercase tracking-wide text-stone-400">
                Explore
              </p>
            </div>
            <div className="space-y-1">
              {navItems.map((item) => (
                <NavLink key={item.match} item={item} />
              ))}
            </div>
          </aside>

          <div className="lg:pl-64">
            <div className="lg:hidden">{topNavigation}</div>
            <div className="sticky top-16 z-30 hidden border-b border-[#E8E6E0] bg-white/90 px-6 py-3 backdrop-blur dark:border-stone-800 dark:bg-stone-900/90 lg:block">
              <p className="font-sora text-sm font-semibold text-[#1C1917] dark:text-stone-100">
                {pageTitle}
              </p>
            </div>
            <main className="min-h-[calc(100vh-8rem)] px-3 py-4 sm:px-5 lg:px-6">{children}</main>
          </div>
        </div>
      ) : (
        <>
          {topNavigation}
          <main className="min-h-[calc(100vh-7.5rem)] px-3 py-4 sm:px-5 lg:px-6">{children}</main>
        </>
      )}
    </div>
  );
}
