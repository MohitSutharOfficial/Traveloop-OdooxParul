import { format, differenceInDays } from 'date-fns';
import {
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  ArrowRight,
  Plus,
  Plane,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTripStore } from '../store/tripStore';
import { destinationService, Destination } from '../services/destination.service';
import { communityService, Post } from '../services/community.service';
import { tripService } from '../services/trip.service';

export default function Dashboard() {
  const { user } = useAuth();
  const { trips, fetchTrips } = useTripStore();

  const [isLoading, setIsLoading] = useState(true);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [communityPosts, setCommunityPosts] = useState<Post[]>([]);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchTrips(),
          destinationService.getDestinations().then(data => setDestinations(data.slice(0, 4))),
          communityService.getPosts().then(res => setCommunityPosts(res.data.slice(0, 3))),
          tripService.getStats().then(data => setStats(data))
        ]);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [fetchTrips]);

  const firstName =
    user?.user_metadata?.first_name ||
    user?.user_metadata?.full_name?.split(' ')[0] ||
    user?.email?.split('@')[0] ||
    'Traveller';

  const upcomingTrips = trips.filter((t) => t.status === 'upcoming');
  const ongoingTrips = trips.filter((t) => t.status === 'ongoing');
  const totalSpent = stats?.totalSpent || 0;
  const totalBudget = stats?.totalBudget || 0;
  const totalTrips = stats?.total || trips.length;

  const nextTrip = upcomingTrips.sort((a, b) => 
    new Date(a.startDate || '').getTime() - new Date(b.startDate || '').getTime()
  )[0];

  const daysUntilNextTrip = nextTrip?.startDate 
    ? differenceInDays(new Date(nextTrip.startDate), new Date())
    : null;

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      {/* Header */}
      <div className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-stone-900 dark:text-white">
                Welcome back, {firstName}
              </h1>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
            <Link
              to="/trip/create"
              className="flex items-center gap-2 px-4 py-2 bg-[#714B67] hover:bg-[#8B5780] text-white text-sm font-medium rounded-md transition-colors shadow-sm"
            >
              <Plus className="h-4 w-4" />
              New Trip
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-md p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Total Trips</span>
              <div className="p-2 bg-[#714B67]/10 rounded border border-[#714B67]/20">
                <MapPin className="h-4 w-4 text-[#714B67]" />
              </div>
            </div>
            <div className="text-2xl font-bold text-stone-900 dark:text-white mb-1">
              {isLoading ? '—' : totalTrips}
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-3 w-3" />
              <span>+12% vs last month</span>
            </div>
          </div>

          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-md p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Active Trips</span>
              <div className="p-2 bg-[#714B67]/10 rounded border border-[#714B67]/20">
                <Plane className="h-4 w-4 text-[#714B67]" />
              </div>
            </div>
            <div className="text-2xl font-bold text-stone-900 dark:text-white">
              {isLoading ? '—' : ongoingTrips.length}
            </div>
          </div>

          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-md p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Total Spent</span>
              <div className="p-2 bg-[#714B67]/10 rounded border border-[#714B67]/20">
                <DollarSign className="h-4 w-4 text-[#714B67]" />
              </div>
            </div>
            <div className="text-2xl font-bold text-stone-900 dark:text-white mb-1">
              {isLoading ? '—' : `₹${totalSpent.toLocaleString('en-IN')}`}
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-3 w-3" />
              <span>+8% vs last month</span>
            </div>
          </div>

          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-md p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Upcoming</span>
              <div className="p-2 bg-[#714B67]/10 rounded border border-[#714B67]/20">
                <Calendar className="h-4 w-4 text-[#714B67]" />
              </div>
            </div>
            <div className="text-2xl font-bold text-stone-900 dark:text-white">
              {isLoading ? '—' : upcomingTrips.length}
            </div>
          </div>
        </div>

        {/* Next Trip Alert */}
        {nextTrip && daysUntilNextTrip !== null && daysUntilNextTrip <= 30 && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border border-blue-200 dark:border-blue-900 rounded-md p-4 mb-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-md">
                  <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-stone-900 dark:text-white">
                    Your next trip is coming up!
                  </p>
                  <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                    <span className="font-medium">{nextTrip.name}</span> starts in{' '}
                    <span className="font-bold text-blue-600 dark:text-blue-400">{daysUntilNextTrip} days</span>
                  </p>
                </div>
              </div>
              <Link
                to={`/itinerary/${nextTrip.id}`}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 bg-white dark:bg-stone-900 rounded-md border border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
              >
                View itinerary
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-6">
          {/* Recent Trips */}
          <div className="col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-stone-900 dark:text-white">Recent Trips</h2>
              <Link to="/trips" className="text-xs text-[#714B67] hover:text-[#8B5780] font-medium">
                View all →
              </Link>
            </div>

            {isLoading ? (
              <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-md divide-y divide-stone-200 dark:divide-stone-800 shadow-sm">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="p-4 flex gap-3 animate-pulse">
                    <div className="h-14 w-20 bg-stone-200 dark:bg-stone-800 rounded" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-stone-200 dark:bg-stone-800 rounded w-1/3" />
                      <div className="h-2 bg-stone-200 dark:bg-stone-800 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : trips.length === 0 ? (
              <div className="bg-white dark:bg-stone-900 border border-dashed border-stone-300 dark:border-stone-700 rounded-md p-12 text-center shadow-sm">
                <MapPin className="h-10 w-10 text-stone-300 mx-auto mb-3" />
                <h3 className="text-sm font-medium text-stone-900 dark:text-white mb-1">No trips yet</h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 mb-4">Start planning your first adventure</p>
                <Link
                  to="/trip/create"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#714B67] hover:bg-[#8B5780] text-white text-sm font-medium rounded-md transition-colors shadow-sm"
                >
                  <Plus className="h-4 w-4" />
                  Create Trip
                </Link>
              </div>
            ) : (
              <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-md divide-y divide-stone-200 dark:divide-stone-800 shadow-sm">
                {trips.slice(0, 6).map((trip) => (
                  <Link
                    key={trip.id}
                    to={`/itinerary/${trip.id}`}
                    className="p-3 flex items-center gap-3 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors group"
                  >
                    <div className="h-14 w-20 rounded overflow-hidden flex-shrink-0 shadow-sm">
                      <img
                        src={trip.coverPhoto || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400'}
                        alt={trip.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-sm text-stone-900 dark:text-white truncate">
                          {trip.name}
                        </h3>
                        <span className={`px-1.5 py-0.5 text-[10px] font-medium rounded ${
                          trip.status === 'upcoming' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400' :
                          trip.status === 'ongoing' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400' :
                          'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-400'
                        }`}>
                          {trip.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-stone-600 dark:text-stone-400 mb-2">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {trip.destination}
                        </span>
                        {trip.startDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(trip.startDate), 'MMM d, yyyy')}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all ${
                              trip.budget.spent > trip.budget.total
                                ? 'bg-red-500'
                                : trip.budget.spent > trip.budget.total * 0.8
                                ? 'bg-orange-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min((trip.budget.spent / trip.budget.total) * 100, 100)}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-stone-600 dark:text-stone-400 whitespace-nowrap font-medium">
                          ₹{trip.budget.spent.toLocaleString('en-IN')} / ₹{trip.budget.total.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Budget Overview */}
            <div className="mt-6">
              <h2 className="text-base font-semibold text-stone-900 dark:text-white mb-4">Budget Overview</h2>
              <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-md p-5 shadow-sm">
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <p className="text-xs text-stone-600 dark:text-stone-400 mb-1 font-medium">Total Budget</p>
                    <p className="text-xl font-bold text-stone-900 dark:text-white">
                      ₹{totalBudget.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-stone-600 dark:text-stone-400 mb-1 font-medium">Total Spent</p>
                    <p className="text-xl font-bold text-stone-900 dark:text-white">
                      ₹{totalSpent.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
                <div className="h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all"
                    style={{ width: `${totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0}%` }}
                  />
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-2">
                  {totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}% of total budget used
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div>
              <h2 className="text-lg font-semibold text-stone-900 dark:text-white mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <Link
                  to="/trip/create"
                  className="flex items-center gap-3 p-3 border border-stone-200 dark:border-stone-800 rounded hover:bg-stone-50 dark:hover:bg-stone-900/50 transition-colors"
                >
                  <div className="p-2 bg-[#714B67]/10 rounded border border-[#714B67]/20">
                    <Plus className="h-4 w-4 text-[#714B67]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-stone-900 dark:text-white">Create Trip</p>
                    <p className="text-xs text-stone-600 dark:text-stone-400">Plan a new adventure</p>
                  </div>
                </Link>
                <Link
                  to="/search/cities"
                  className="flex items-center gap-3 p-3 border border-stone-200 dark:border-stone-800 rounded hover:bg-stone-50 dark:hover:bg-stone-900/50 transition-colors"
                >
                  <div className="p-2 bg-[#714B67]/10 rounded border border-[#714B67]/20">
                    <MapPin className="h-4 w-4 text-[#714B67]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-stone-900 dark:text-white">Explore Destinations</p>
                    <p className="text-xs text-stone-600 dark:text-stone-400">Find your next destination</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Popular Destinations */}
            <div>
              <h2 className="text-lg font-semibold text-stone-900 dark:text-white mb-4">Popular Destinations</h2>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-24 bg-stone-200 dark:bg-stone-800 rounded animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {destinations.map((dest) => (
                    <div
                      key={dest.id}
                      className="relative h-24 rounded overflow-hidden group cursor-pointer"
                    >
                      <img
                        src={dest.image_url || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400'}
                        alt={dest.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-2 left-3">
                        <p className="font-medium text-white text-sm">{dest.name}</p>
                        <p className="text-xs text-white/80">{dest.country}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div>
              <h2 className="text-lg font-semibold text-stone-900 dark:text-white mb-4">Recent Activity</h2>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-3 animate-pulse">
                      <div className="h-8 w-8 bg-stone-200 dark:bg-stone-800 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-stone-200 dark:bg-stone-800 rounded w-3/4" />
                        <div className="h-2 bg-stone-200 dark:bg-stone-800 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {communityPosts.map((post) => (
                    <div key={post.id} className="flex gap-3">
                      <div className="h-8 w-8 rounded-full bg-stone-200 dark:bg-stone-800 overflow-hidden flex-shrink-0">
                        {post.profiles?.avatar_url ? (
                          <img src={post.profiles.avatar_url} alt={post.profiles.full_name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-xs font-medium text-stone-400">
                            {post.profiles?.full_name?.charAt(0) || '?'}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-stone-900 dark:text-white truncate">
                          {post.profiles?.full_name || 'Anonymous'}
                        </p>
                        <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2">
                          {post.body}
                        </p>
                        <p className="text-xs text-stone-500 mt-1">
                          {new Date(post.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
