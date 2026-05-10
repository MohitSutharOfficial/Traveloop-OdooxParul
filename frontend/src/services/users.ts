import api from './api';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'manager' | 'technician';
}

export const userService = {
  async getAll(): Promise<User[]> {
    const { data } = await api.get('/users');
    return data.data || data;
  },

  async getById(id: string): Promise<User> {
    const { data } = await api.get(`/users/${id}`);
    return data.data || data;
  },
};
