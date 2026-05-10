import { format } from 'date-fns';
import { DollarSign, Globe, Plane, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const mockTrips = [
  {
    id: '1',
    name: 'Paris & Rome Adventure',
    destination: 'Europe',
    coverPhoto: 'https://images.unsplash.com/photo-1502602898657?w=400',
    startDate: '2025-06-01',
    endDate: '2025-06-14',
    status: 'upcoming',
    planningScore: 75,
    budget: { total: 3000, spent: 1200, currency: 'USD' },
  },
  {
    id: '2',
    name: 'Bali Retreat',
    destination: 'Southeast Asia',
    coverPhoto: 'https://images.unsplash.com/photo-1537996194471?w=400',
    startDate: '2025-07-10',
    endDate: '2025-07-20',
    status: 'upcoming',
    planningScore: 45,
    budget: { total: 2000, spent: 400, currency: 'USD' },
  },
  {
    id: '3',
    name: 'Japan Explorer',
    destination: 'Asia',
    coverPhoto: 'https://images.unsplash.com/photo-1540959733332?w=400',
    startDate: '2025-03-01',
    endDate: '2025-03-10',
    status: 'completed',
    planningScore: 100,
    budget: { total: 2500, spent: 2300, currency: 'USD' },
  },
] as const;

const topDestinations = [
  {
    name: 'Paris',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400',
    region: 'France',
  },
  {
    name: 'Bali',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400',
    region: 'Indonesia',
  },
  {
    name: 'Tokyo',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400',
    region: 'Japan',
  },
  {
    name: 'New York',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400',
    region: 'United States',
  },
  {
    name: 'London',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400',
    region: 'United Kingdom',
  },
] as const;

function ProgressRing({ score }: { score: number }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex h-16 w-16 items-center justify-center">
      <svg width="64" height="64" className="absolute -rotate-90">
        <circle cx="32" cy="32" r={radius} fill="none" stroke="currentColor" strokeWidth="5" className="text-stone-200 dark:text-stone-700" />
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke="#EF9F27"
          strokeWidth="5"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      <span className="font-sora text-sm font-bold text-[#1C1917] dark:text-stone-100">{score}%</span>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const firstName =
    user?.user_metadata?.first_name ||
    user?.user_metadata?.full_name?.split(' ')[0] ||
    user?.email?.split('@')[0] ||
    'Traveler';
  const totalSpent = mockTrips.reduce((total, trip) => total + trip.budget.spent, 0);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-7 px-1 pb-8 sm:px-3">
      <section className="space-y-4">
        <div>
          <h1 className="font-sora text-3xl font-bold text-[#1C1917] dark:text-stone-100">
            Good morning, {firstName}! Ready to explore?
          </h1>
          <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">
            Your trips, destinations, and budgets are ready when you are.
          </p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400" />
          <input
            type="search"
            placeholder="Search trips, destinations..."
            className="traveloop-input h-12 w-full pl-11"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="traveloop-card">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-stone-600 dark:text-stone-300">Upcoming Trips</p>
                <p className="mt-2 font-sora text-3xl font-bold text-[#1C1917] dark:text-stone-100">
                  {mockTrips.filter((trip) => trip.status === 'upcoming').length}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-[#EF9F27] dark:bg-amber-400/10">
                <Plane size={24} />
              </div>
            </div>
          </div>

          <div className="traveloop-card">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-stone-600 dark:text-stone-300">Countries Visited</p>
                <p className="mt-2 font-sora text-3xl font-bold text-[#1C1917] dark:text-stone-100">
                  12
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-600 dark:bg-teal-400/10 dark:text-teal-300">
                <Globe size={24} />
              </div>
            </div>
          </div>

          <div className="traveloop-card">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-stone-600 dark:text-stone-300">Total Budget Spent</p>
                <p className="mt-2 font-sora text-3xl font-bold text-[#1C1917] dark:text-stone-100">
                  ${totalSpent.toLocaleString()}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 dark:bg-blue-400/10 dark:text-blue-300">
                <DollarSign size={24} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="font-sora text-xl font-semibold text-[#1C1917] dark:text-stone-100">
            Top Regional Selections
          </h2>
          <Link to="/search/cities" className="text-sm font-medium text-[#BA7517] hover:text-[#EF9F27]">
            Explore cities
          </Link>
        </div>

        <div className="hide-scrollbar flex gap-4 overflow-x-auto pb-2">
          {topDestinations.map((destination) => (
            <article
              key={destination.name}
              className="min-w-[210px] overflow-hidden rounded-[14px] border border-[#E8E6E0] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-stone-700 dark:bg-stone-900"
            >
              <img
                src={destination.image}
                alt={`${destination.name} destination`}
                className="h-36 w-full object-cover"
                loading="lazy"
              />
              <div className="p-4">
                <h3 className="font-sora font-semibold text-[#1C1917] dark:text-stone-100">{destination.name}</h3>
                <p className="mt-1 text-xs text-stone-600 dark:text-stone-300">{destination.region}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="font-sora text-xl font-semibold text-[#1C1917] dark:text-stone-100">
            Recent Trips
          </h2>
          <Link to="/trips" className="text-sm font-medium text-[#BA7517] hover:text-[#EF9F27]">
            View all
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {mockTrips.map((trip) => (
            <article key={trip.id} className="traveloop-card overflow-hidden !p-0 transition hover:-translate-y-0.5 hover:shadow-md">
              <img src={trip.coverPhoto} alt={trip.name} className="h-44 w-full object-cover" loading="lazy" />
              <div className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-sora text-base font-semibold text-[#1C1917] dark:text-stone-100">
                      {trip.name}
                    </h3>
                    <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">{trip.destination}</p>
                  </div>
                  <span className={trip.status === 'upcoming' ? 'traveloop-badge-upcoming' : 'traveloop-badge-completed'}>
                    {trip.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                  </span>
                </div>

                <p className="text-xs font-medium text-stone-500 dark:text-stone-400">
                  {format(new Date(trip.startDate), 'MMM d, yyyy')} - {format(new Date(trip.endDate), 'MMM d, yyyy')}
                </p>

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <ProgressRing score={trip.planningScore} />
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-stone-500 dark:text-stone-400">
                        Planning
                      </p>
                      <p className="text-sm font-semibold text-[#1C1917] dark:text-stone-100">
                        {trip.budget.currency} {trip.budget.spent.toLocaleString()} spent
                      </p>
                    </div>
                  </div>
                  <Link to={`/itinerary/${trip.id}`} className="traveloop-button-primary px-4 py-2 text-sm">
                    View
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
