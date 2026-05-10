import React, { useEffect, useState } from 'react';
import { Users, Heart, MessageCircle, Share2, Plus, X, Trash2 } from 'lucide-react';
import { communityService, Post, CreatePostRequest } from '../services/community.service';
import { dateUtils } from '../utils/dateUtils';
import { supabase } from '../lib/supabase';

export default function Community() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [newPost, setNewPost] = useState<CreatePostRequest>({
    title: '',
    body: '',
    image_url: null,
    destination: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadPosts();
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUserId(user?.id || null);
  };

  const loadPosts = async () => {
    try {
      const { data } = await communityService.getPosts();
      setPosts(data);
    } catch (err) {
      console.error('Failed to load posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.body.trim()) return;
    
    setSubmitting(true);
    try {
      const created = await communityService.createPost(newPost);
      setPosts([created, ...posts]);
      setNewPost({ title: '', body: '', image_url: null, destination: '' });
      setShowCreateModal(false);
    } catch (err: any) {
      alert(err.message || 'Failed to create post');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      await communityService.deletePost(postId);
      setPosts(posts.filter(p => p.id !== postId));
    } catch (err: any) {
      alert(err.message || 'Failed to delete post');
    }
  };

  const handleLikeToggle = async (postId: string, isLiked: boolean) => {
    try {
      if (isLiked) {
        await communityService.unlikePost(postId);
      } else {
        await communityService.likePost(postId);
      }
      // Optimistically update UI
      setPosts(posts.map(p => 
        p.id === postId 
          ? { ...p }
          : p
      ));
    } catch (err: any) {
      console.error('Failed to toggle like:', err);
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col lg:h-[calc(100vh-4.5rem)] container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-sora text-2xl font-bold mb-2">Community Feed</h1>
          <p className="text-stone-500">Connect with travelers and share trusted recommendations.</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 rounded-full bg-[#714B67] px-4 py-2 font-sora text-sm font-bold text-white hover:bg-[#8B5780] transition-colors"
        >
          <Plus size={16} />
          <span>New Post</span>
        </button>
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-stone-900 rounded-md max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-sora text-xl font-bold">Create New Post</h2>
              <button onClick={() => setShowCreateModal(false)} className="text-stone-400 hover:text-stone-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleCreatePost}>
              <input
                type="text"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                placeholder="Post title..."
                className="w-full border border-stone-200 dark:border-stone-700 rounded-md p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-[#714B67]"
                required
              />
              <textarea
                value={newPost.body}
                onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
                placeholder="Share your travel experiences..."
                className="w-full border border-stone-200 dark:border-stone-700 rounded-md p-3 mb-3 min-h-32 focus:outline-none focus:ring-2 focus:ring-[#714B67]"
                required
              />
              <input
                type="text"
                value={newPost.destination || ''}
                onChange={(e) => setNewPost({ ...newPost, destination: e.target.value })}
                placeholder="Destination (optional)"
                className="w-full border border-stone-200 dark:border-stone-700 rounded-md p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-[#714B67]"
              />
              <input
                type="url"
                value={newPost.image_url || ''}
                onChange={(e) => setNewPost({ ...newPost, image_url: e.target.value })}
                placeholder="Image URL (optional)"
                className="w-full border border-stone-200 dark:border-stone-700 rounded-md p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-[#714B67]"
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-stone-200 dark:border-stone-700 rounded-md hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !newPost.body.trim()}
                  className="flex-1 px-4 py-2 bg-[#714B67] text-white rounded-md hover:bg-[#8B5780] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Posting...' : 'Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
         <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#714B67]"></div></div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-6 pb-8 custom-scrollbar">
          {posts.map(post => (
            <div key={post.id} className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-md p-5 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-stone-200 overflow-hidden flex items-center justify-center">
                  {post.profiles?.avatar_url ? (
                    <img src={post.profiles.avatar_url} alt={post.profiles.full_name} className="h-full w-full object-cover" />
                  ) : (
                    <Users size={20} className="text-stone-400" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold font-sora text-sm">{post.profiles?.full_name || 'Anonymous Traveler'}</h4>
                  <p className="text-xs text-stone-500">{dateUtils.formatDate(post.created_at)}</p>
                </div>
                {currentUserId === post.author_id && (
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="text-stone-400 hover:text-red-500 transition-colors"
                    title="Delete post"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
              
              <h3 className="font-bold font-sora text-base mb-2">{post.title}</h3>
              <p className="text-stone-700 dark:text-stone-300 mb-4 whitespace-pre-wrap">{post.body}</p>
              
              {post.image_url && (
                <div className="rounded-md overflow-hidden mb-4 border border-stone-100 dark:border-stone-800">
                  <img src={post.image_url} alt="Post media" className="w-full h-auto object-cover max-h-96" />
                </div>
              )}
              
              <div className="flex items-center gap-6 pt-3 border-t border-stone-100 dark:border-stone-800 text-stone-500">
                <button 
                  onClick={() => handleLikeToggle(post.id, false)}
                  className="flex items-center gap-1.5 hover:text-[#714B67] transition-colors group"
                >
                  <Heart size={18} className="group-hover:fill-[#714B67]" />
                  <span className="text-sm font-medium">Like</span>
                </button>
                <button className="flex items-center gap-1.5 hover:text-blue-500 transition-colors">
                  <MessageCircle size={18} />
                  <span className="text-sm font-medium">Comment</span>
                </button>
                <button className="flex items-center gap-1.5 hover:text-green-500 transition-colors ml-auto">
                  <Share2 size={18} />
                </button>
              </div>
            </div>
          ))}
          {posts.length === 0 && (
            <div className="text-center py-12 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-md">
               <Users size={48} className="mx-auto text-stone-300 mb-4" />
               <h3 className="font-sora font-semibold text-stone-700 dark:text-stone-200 mb-1">No posts yet</h3>
               <p className="text-sm text-stone-500">Be the first to share your travel experiences!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
