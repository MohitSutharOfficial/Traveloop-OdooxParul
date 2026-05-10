import api from './api';

export interface AdminUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  city: string | null;
  country: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminDashboard {
  overview: {
    totalUsers: number;
    adminUsers: number;
    totalTrips: number;
    totalBudget: number;
    totalSpent: number;
    statusBreakdown: Record<string, number>;
  };
  popularDestinations: Array<{ destination: string; count: number }>;
  popularActivities: Array<{ activity: string; count: number }>;
  userTrends: Array<{ month: string; users: number }>;
}

export const adminService = {
  async getDashboard(): Promise<AdminDashboard> {
    const response = await api.get('/admin/dashboard');
    return response.data.data;
  },

  async createUser(payload: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    city?: string | null;
    country?: string | null;
    is_admin?: boolean;
  }): Promise<AdminUser> {
    const response = await api.post('/admin/users', payload);
    return response.data.data;
  },

  async getUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: 'created_at' | 'email' | 'first_name' | 'last_name';
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ data: AdminUser[]; total: number }> {
    const response = await api.get('/admin/users', { params });
    return {
      data: response.data.data || [],
      total: response.data.meta?.total || 0,
    };
  },

  async updateUser(id: string, payload: Partial<Pick<AdminUser, 'first_name' | 'last_name' | 'city' | 'country' | 'is_admin'>>): Promise<AdminUser> {
    const response = await api.patch(`/admin/users/${id}`, payload);
    return response.data.data;
  },

  async deleteUser(id: string): Promise<void> {
    await api.delete(`/admin/users/${id}`);
  },
};
