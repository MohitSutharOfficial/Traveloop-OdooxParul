import api from './api';

export interface Post {
  id: string;
  author_id: string;
  title: string;
  body: string;
  destination: string | null;
  image_url: string | null;
  created_at: string;
  profiles?: {
    full_name: string;
    avatar_url: string | null;
  };
}

export interface CreatePostRequest {
  title: string;
  body: string;
  image_url?: string | null;
  destination?: string;
}

export const communityService = {
  getPosts: async (page = 1, limit = 20, destination?: string): Promise<{ data: Post[], total: number }> => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (destination) params.append('destination', destination);
    const response = await api.get(`/community?${params.toString()}`);
    return { 
      data: response.data.data || [], 
      total: response.data.meta?.total || 0 
    };
  },

  getPost: async (id: string): Promise<Post> => {
    const response = await api.get(`/community/${id}`);
    return response.data.data;
  },

  createPost: async (postData: CreatePostRequest): Promise<Post> => {
    const response = await api.post('/community', postData);
    return response.data.data;
  },

  deletePost: async (id: string): Promise<void> => {
    await api.delete(`/community/${id}`);
  },

  likePost: async (id: string): Promise<void> => {
    await api.post(`/community/${id}/like`);
  },

  unlikePost: async (id: string): Promise<void> => {
    await api.delete(`/community/${id}/like`);
  }
};