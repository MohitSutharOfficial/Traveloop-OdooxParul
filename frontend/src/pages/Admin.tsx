import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  Edit2,
  Filter,
  MapPin,
  Plus,
  Search,
  ShieldAlert,
  Trash2,
  UserCog,
  Users,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { adminService, AdminDashboard, AdminUser } from '../services/admin.service';
import { dateUtils } from '../utils/dateUtils';

type AdminTab = 'users' | 'cities' | 'activities' | 'trends' | 'analytics';

const EMPTY_DASHBOARD: AdminDashboard = {
  overview: {
    totalUsers: 0,
    adminUsers: 0,
    totalTrips: 0,
    totalBudget: 0,
    totalSpent: 0,
    statusBreakdown: {},
  },
  popularDestinations: [],
  popularActivities: [],
  userTrends: [],
};

export default function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTab>('users');
  const [dashboard, setDashboard] = useState<AdminDashboard>(EMPTY_DASHBOARD);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'created_at' | 'email' | 'first_name' | 'last_name'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [createPassword, setCreatePassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadData = useCallback(async (
    options?: {
      search?: string;
      sortBy?: 'created_at' | 'email' | 'first_name' | 'last_name';
      sortOrder?: 'asc' | 'desc';
    }
  ) => {
    setLoading(true);
    try {
      const [dashboardData, usersResponse] = await Promise.all([
        adminService.getDashboard(),
        adminService.getUsers({
          page: 1,
          limit: 100,
          search: options?.search ?? '',
          sortBy: options?.sortBy ?? 'created_at',
          sortOrder: options?.sortOrder ?? 'desc',
        }),
      ]);

      setDashboard(dashboardData);
      setUsers(usersResponse.data);
      setIsAdmin(true);
    } catch (error: any) {
      if (error?.status === 403 || error?.status === 401) {
        setIsAdmin(false);
      } else {
        console.error(error);
        alert(error.message || 'Failed to load admin data');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData({
      search: '',
      sortBy: 'created_at',
      sortOrder: 'desc',
    });
  }, [loadData]);

  const openUserModal = (user: AdminUser) => {
    setIsCreatingUser(false);
    setEditingUser({ ...user });
    setCreatePassword('');
    setShowUserModal(true);
  };

  const openCreateUserModal = () => {
    setIsCreatingUser(true);
    setEditingUser({
      id: '',
      email: '',
      first_name: '',
      last_name: '',
      city: '',
      country: '',
      is_admin: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    setCreatePassword('');
    setShowUserModal(true);
  };

  const closeUserModal = () => {
    setEditingUser(null);
    setIsCreatingUser(false);
    setCreatePassword('');
    setShowUserModal(false);
  };

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    await loadData({ search: searchTerm, sortBy, sortOrder });
  };

  const handleSortChange = async (
    nextSortBy: 'created_at' | 'email' | 'first_name' | 'last_name',
    nextSortOrder: 'asc' | 'desc'
  ) => {
    setSortBy(nextSortBy);
    setSortOrder(nextSortOrder);
    await loadData({ search: searchTerm, sortBy: nextSortBy, sortOrder: nextSortOrder });
  };

  const handleSaveUser = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!editingUser) return;

    setSubmitting(true);
    try {
      if (isCreatingUser) {
        if (!editingUser.email.trim() || !createPassword.trim()) {
          alert('Email and password are required');
          return;
        }

        const created = await adminService.createUser({
          email: editingUser.email.trim(),
          password: createPassword,
          first_name: editingUser.first_name.trim(),
          last_name: editingUser.last_name.trim(),
          city: editingUser.city || null,
          country: editingUser.country || null,
          is_admin: editingUser.is_admin,
        });
        setUsers((prev) => [created, ...prev]);
        setDashboard((prev) => ({
          ...prev,
          overview: {
            ...prev.overview,
            totalUsers: prev.overview.totalUsers + 1,
            adminUsers: created.is_admin ? prev.overview.adminUsers + 1 : prev.overview.adminUsers,
          },
        }));
      } else {
        const previous = users.find((user) => user.id === editingUser.id);
        const updated = await adminService.updateUser(editingUser.id, {
          first_name: editingUser.first_name,
          last_name: editingUser.last_name,
          city: editingUser.city || null,
          country: editingUser.country || null,
          is_admin: editingUser.is_admin,
        });

        setUsers((prev) => prev.map((user) => (user.id === updated.id ? updated : user)));

        if (previous && previous.is_admin !== updated.is_admin) {
          setDashboard((prev) => ({
            ...prev,
            overview: {
              ...prev.overview,
              adminUsers: updated.is_admin
                ? prev.overview.adminUsers + 1
                : Math.max(prev.overview.adminUsers - 1, 0),
            },
          }));
        }
      }
      closeUserModal();
    } catch (error: any) {
      alert(error.message || 'Failed to save user');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Delete this user account? This will remove related trips and records.')) return;
    try {
      await adminService.deleteUser(userId);
      setUsers((prev) => prev.filter((user) => user.id !== userId));
      setDashboard((prev) => ({
        ...prev,
        overview: {
          ...prev.overview,
          totalUsers: Math.max(prev.overview.totalUsers - 1, 0),
        },
      }));
    } catch (error: any) {
      alert(error.message || 'Failed to delete user');
    }
  };

  const spentRatio = useMemo(() => {
    if (dashboard.overview.totalBudget <= 0) return 0;
    return Math.min((dashboard.overview.totalSpent / dashboard.overview.totalBudget) * 100, 100);
  }, [dashboard.overview.totalSpent, dashboard.overview.totalBudget]);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#714B67]" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex h-[calc(100vh-4rem)] flex-col items-center justify-center container mx-auto px-4 max-w-md text-center">
        <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-full mb-4">
          <ShieldAlert className="h-12 w-12 text-red-600 dark:text-red-400" />
        </div>
        <h1 className="font-sora text-2xl font-bold mb-2 text-stone-900 dark:text-white">Access Denied</h1>
        <p className="text-stone-600 dark:text-stone-400 mb-6">
          You do not have administrator permission for this page.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="traveloop-button-primary"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col lg:h-[calc(100vh-4.5rem)] container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="font-sora text-2xl font-bold mb-2">Admin Panel</h1>
        <p className="text-stone-500">Manage users, trip analytics, and platform insights.</p>
      </div>

      <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-5">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
          <input
            type="text"
            className="traveloop-input w-full pl-10"
            placeholder="Search users by name, email, city..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
        <label className="flex items-center gap-2">
          <Filter size={16} className="text-stone-500" />
          <select
            className="traveloop-input w-full"
            value={sortBy}
            onChange={(event) => handleSortChange(event.target.value as 'created_at' | 'email' | 'first_name' | 'last_name', sortOrder)}
          >
            <option value="created_at">Sort by Created</option>
            <option value="email">Sort by Email</option>
            <option value="first_name">Sort by First Name</option>
            <option value="last_name">Sort by Last Name</option>
          </select>
        </label>
        <select
          className="traveloop-input w-full"
          value={sortOrder}
          onChange={(event) => handleSortChange(sortBy, event.target.value as 'asc' | 'desc')}
        >
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </form>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="traveloop-card !p-4">
          <p className="text-xs text-stone-500">Total Users</p>
          <p className="font-sora text-2xl font-bold">{dashboard.overview.totalUsers}</p>
        </div>
        <div className="traveloop-card !p-4">
          <p className="text-xs text-stone-500">Admin Users</p>
          <p className="font-sora text-2xl font-bold">{dashboard.overview.adminUsers}</p>
        </div>
        <div className="traveloop-card !p-4">
          <p className="text-xs text-stone-500">Total Trips</p>
          <p className="font-sora text-2xl font-bold">{dashboard.overview.totalTrips}</p>
        </div>
        <div className="traveloop-card !p-4">
          <p className="text-xs text-stone-500">Budget Utilization</p>
          <p className="font-sora text-2xl font-bold">{spentRatio.toFixed(1)}%</p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          className={`traveloop-button-secondary ${activeTab === 'users' ? '!bg-[#714B67] !text-white !border-[#714B67]' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Manage Users
        </button>
        <button
          className={`traveloop-button-secondary ${activeTab === 'cities' ? '!bg-[#714B67] !text-white !border-[#714B67]' : ''}`}
          onClick={() => setActiveTab('cities')}
        >
          Popular Cities
        </button>
        <button
          className={`traveloop-button-secondary ${activeTab === 'activities' ? '!bg-[#714B67] !text-white !border-[#714B67]' : ''}`}
          onClick={() => setActiveTab('activities')}
        >
          Popular Activities
        </button>
        <button
          className={`traveloop-button-secondary ${activeTab === 'trends' ? '!bg-[#714B67] !text-white !border-[#714B67]' : ''}`}
          onClick={() => setActiveTab('trends')}
        >
          User Trends
        </button>
        <button
          className={`traveloop-button-secondary ${activeTab === 'analytics' ? '!bg-[#714B67] !text-white !border-[#714B67]' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar rounded-md border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4">
        {activeTab === 'users' && (
          <div className="space-y-3">
            {users.length > 0 ? (
              users.map((user) => (
                <div
                  key={user.id}
                  className="flex flex-col md:flex-row md:items-center gap-3 justify-between rounded-md border border-stone-200 dark:border-stone-800 p-3"
                >
                  <div>
                    <p className="font-medium text-stone-800 dark:text-stone-100">
                      {user.first_name} {user.last_name}
                    </p>
                    <p className="text-sm text-stone-500">{user.email}</p>
                    <p className="text-xs text-stone-500">
                      {user.city || '—'}, {user.country || '—'} · Joined {dateUtils.formatDate(user.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`odoo-badge ${user.is_admin ? 'odoo-badge-info' : 'odoo-badge-neutral'}`}>
                      {user.is_admin ? 'Admin' : 'User'}
                    </span>
                  <button className="traveloop-button-secondary !px-2.5 !py-1.5" onClick={() => openUserModal(user)}>
                    <Edit2 size={14} />
                  </button>
                    <button className="traveloop-button-secondary !px-2.5 !py-1.5" onClick={() => handleDeleteUser(user.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-stone-500 text-center py-8">No users match the current filters.</p>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="mt-4 flex justify-end">
            <button className="traveloop-button-primary" onClick={openCreateUserModal}>
              <Plus size={16} />
              Add User
            </button>
          </div>
        )}

        {activeTab === 'cities' && (
          <div className="space-y-2">
            {dashboard.popularDestinations.map((city) => (
              <div key={city.destination} className="flex items-center justify-between rounded-md border border-stone-200 dark:border-stone-800 p-3">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-[#714B67]" />
                  <span>{city.destination}</span>
                </div>
                <span className="odoo-badge odoo-badge-neutral">{city.count} trips</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'activities' && (
          <div className="space-y-2">
            {dashboard.popularActivities.map((activity) => (
              <div key={activity.activity} className="flex items-center justify-between rounded-md border border-stone-200 dark:border-stone-800 p-3">
                <div className="flex items-center gap-2">
                  <BarChart3 size={16} className="text-[#714B67]" />
                  <span>{activity.activity}</span>
                </div>
                <span className="odoo-badge odoo-badge-neutral">{activity.count} mentions</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="space-y-3">
            {dashboard.userTrends.map((trend) => (
              <div key={trend.month}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span>{trend.month}</span>
                  <span>{trend.users} users</span>
                </div>
                <div className="h-2 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                  <div
                    className="h-full bg-[#714B67]"
                    style={{
                      width: `${Math.min(
                        (trend.users /
                          Math.max(...dashboard.userTrends.map((item) => item.users), 1)) *
                          100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-md border border-stone-200 dark:border-stone-800 p-4">
              <h3 className="font-sora font-semibold mb-3 flex items-center gap-2">
                <Users size={16} />
                Account Snapshot
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-300">
                {dashboard.overview.totalUsers} users, including {dashboard.overview.adminUsers} admins.
              </p>
            </div>
            <div className="rounded-md border border-stone-200 dark:border-stone-800 p-4">
              <h3 className="font-sora font-semibold mb-3 flex items-center gap-2">
                <UserCog size={16} />
                Trip Snapshot
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-300">
                {dashboard.overview.totalTrips} total trips with spending {dashboard.overview.totalSpent.toFixed(2)} / {dashboard.overview.totalBudget.toFixed(2)}.
              </p>
            </div>
            <div className="rounded-md border border-stone-200 dark:border-stone-800 p-4 md:col-span-2">
              <h3 className="font-sora font-semibold mb-3">Trip Status Distribution</h3>
              <div className="space-y-2">
                {Object.entries(dashboard.overview.statusBreakdown).map(([status, count]) => (
                  <div key={status}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize">{status}</span>
                      <span>{count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                      <div
                        className="h-full bg-[#714B67]"
                        style={{
                          width: `${Math.min(
                            (count /
                              Math.max(
                                ...Object.values(dashboard.overview.statusBreakdown),
                                1
                              )) *
                              100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {showUserModal && editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-stone-900 rounded-md max-w-xl w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-sora text-xl font-bold">{isCreatingUser ? 'Create User' : 'Edit User'}</h2>
              <button onClick={closeUserModal} className="text-stone-400 hover:text-stone-600">
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4">
              <div>
                <label className="traveloop-label">Email</label>
                <input
                  type="email"
                  className="traveloop-input w-full"
                  value={editingUser.email}
                  disabled={!isCreatingUser}
                  onChange={(event) =>
                    setEditingUser((prev) => (prev ? { ...prev, email: event.target.value } : prev))
                  }
                  required
                />
              </div>
              {isCreatingUser && (
                <div>
                  <label className="traveloop-label">Password</label>
                  <input
                    type="password"
                    className="traveloop-input w-full"
                    value={createPassword}
                    minLength={8}
                    onChange={(event) => setCreatePassword(event.target.value)}
                    required
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="traveloop-label">First Name</label>
                  <input
                    className="traveloop-input w-full"
                    value={editingUser.first_name}
                    onChange={(event) =>
                      setEditingUser((prev) => (prev ? { ...prev, first_name: event.target.value } : prev))
                    }
                  />
                </div>
                <div>
                  <label className="traveloop-label">Last Name</label>
                  <input
                    className="traveloop-input w-full"
                    value={editingUser.last_name}
                    onChange={(event) =>
                      setEditingUser((prev) => (prev ? { ...prev, last_name: event.target.value } : prev))
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="traveloop-label">City</label>
                  <input
                    className="traveloop-input w-full"
                    value={editingUser.city || ''}
                    onChange={(event) =>
                      setEditingUser((prev) => (prev ? { ...prev, city: event.target.value } : prev))
                    }
                  />
                </div>
                <div>
                  <label className="traveloop-label">Country</label>
                  <input
                    className="traveloop-input w-full"
                    value={editingUser.country || ''}
                    onChange={(event) =>
                      setEditingUser((prev) => (prev ? { ...prev, country: event.target.value } : prev))
                    }
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={editingUser.is_admin}
                  onChange={(event) =>
                    setEditingUser((prev) => (prev ? { ...prev, is_admin: event.target.checked } : prev))
                  }
                />
                Grant admin access
              </label>
              <div className="flex gap-3">
                <button type="button" className="traveloop-button-secondary flex-1" onClick={closeUserModal}>
                  Cancel
                </button>
                <button type="submit" className="traveloop-button-primary flex-1" disabled={submitting}>
                  {submitting ? 'Saving...' : isCreatingUser ? 'Create User' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
