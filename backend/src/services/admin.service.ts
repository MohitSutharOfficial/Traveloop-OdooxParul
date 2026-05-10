import { supabaseAdmin } from '../config/supabase';

export interface AdminListUsersParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: 'created_at' | 'email' | 'first_name' | 'last_name';
  sortOrder?: 'asc' | 'desc';
}

type AdminUserRecord = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  city: string | null;
  country: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
};

export class AdminService {
  static async createUser(payload: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    city?: string | null;
    country?: string | null;
    is_admin?: boolean;
  }) {
    const { data: createdAuth, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: payload.email,
      password: payload.password,
      email_confirm: true,
      user_metadata: {
        full_name: `${payload.first_name} ${payload.last_name}`.trim(),
      },
    });

    if (authError || !createdAuth.user) {
      throw authError || new Error('Failed to create user');
    }

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .upsert(
        {
          id: createdAuth.user.id,
          email: payload.email,
          first_name: payload.first_name,
          last_name: payload.last_name,
          city: payload.city || null,
          country: payload.country || null,
          is_admin: payload.is_admin || false,
        },
        { onConflict: 'id' }
      )
      .select('id, email, first_name, last_name, city, country, is_admin, created_at, updated_at')
      .single();

    if (error) {
      await supabaseAdmin.auth.admin.deleteUser(createdAuth.user.id);
      throw error;
    }

    return data as AdminUserRecord;
  }

  static async listUsers(params: AdminListUsersParams) {
    const {
      page,
      limit,
      search = '',
      sortBy = 'created_at',
      sortOrder = 'desc',
    } = params;

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabaseAdmin
      .from('profiles')
      .select(
        'id, email, first_name, last_name, city, country, is_admin, created_at, updated_at',
        { count: 'exact' }
      );

    if (search.trim()) {
      const term = `%${search.trim()}%`;
      query = query.or(
        `email.ilike.${term},first_name.ilike.${term},last_name.ilike.${term},city.ilike.${term},country.ilike.${term}`
      );
    }

    const { data, error, count } = await query
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(from, to);

    if (error) throw error;

    return {
      data: (data || []) as AdminUserRecord[],
      total: count || 0,
    };
  }

  static async updateUser(
    id: string,
    payload: Partial<Pick<AdminUserRecord, 'first_name' | 'last_name' | 'city' | 'country' | 'is_admin'>>
  ) {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update(payload)
      .eq('id', id)
      .select('id, email, first_name, last_name, city, country, is_admin, created_at, updated_at')
      .single();

    if (error) throw error;
    return data as AdminUserRecord;
  }

  static async deleteUser(id: string) {
    const { error } = await supabaseAdmin.auth.admin.deleteUser(id);
    if (error) throw error;
  }

  static async getDashboard() {
    const [profilesRes, tripsRes, itineraryRes] = await Promise.all([
      supabaseAdmin.from('profiles').select('id, created_at, is_admin'),
      supabaseAdmin.from('trips').select('destination, status, budget_total, budget_spent'),
      supabaseAdmin
        .from('itinerary_items')
        .select('title')
        .eq('item_type', 'activity'),
    ]);

    if (profilesRes.error) throw profilesRes.error;
    if (tripsRes.error) throw tripsRes.error;
    if (itineraryRes.error) throw itineraryRes.error;

    const profiles = profilesRes.data || [];
    const trips = tripsRes.data || [];
    const activities = itineraryRes.data || [];

    const destinationCounts = trips.reduce<Record<string, number>>((acc, trip) => {
      const destination = (trip.destination || '').trim();
      if (!destination) return acc;
      acc[destination] = (acc[destination] || 0) + 1;
      return acc;
    }, {});

    const activityCounts = activities.reduce<Record<string, number>>((acc, item) => {
      const title = (item.title || '').trim();
      if (!title) return acc;
      acc[title] = (acc[title] || 0) + 1;
      return acc;
    }, {});

    const byMonth = profiles.reduce<Record<string, number>>((acc, profile) => {
      const month = new Date(profile.created_at).toISOString().slice(0, 7);
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    const now = new Date();
    const userTrends = Array.from({ length: 6 }).map((_, index) => {
      const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (5 - index), 1));
      const month = date.toISOString().slice(0, 7);
      return { month, users: byMonth[month] || 0 };
    });

    const statusBreakdown = trips.reduce<Record<string, number>>((acc, trip) => {
      const status = trip.status || 'unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    return {
      overview: {
        totalUsers: profiles.length,
        adminUsers: profiles.filter((user) => user.is_admin).length,
        totalTrips: trips.length,
        totalBudget: trips.reduce((sum, trip) => sum + Number(trip.budget_total || 0), 0),
        totalSpent: trips.reduce((sum, trip) => sum + Number(trip.budget_spent || 0), 0),
        statusBreakdown,
      },
      popularDestinations: Object.entries(destinationCounts)
        .map(([destination, count]) => ({ destination, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8),
      popularActivities: Object.entries(activityCounts)
        .map(([activity, count]) => ({ activity, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8),
      userTrends,
    };
  }
}
