import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { postApi } from '../api/postApi';

export function usePosts(params) {
  return useQuery({ queryKey: ['posts', params], queryFn: () => postApi.list(params), placeholderData: (previous) => previous });
}

export function usePost(id) {
  return useQuery({ queryKey: ['post', id], queryFn: () => postApi.getById(id), enabled: Boolean(id) });
}

export function useCategories(params, enabled = true) {
  return useQuery({ queryKey: ['categories', params], queryFn: () => postApi.categories(params), staleTime: 5 * 60 * 1000, enabled });
}

export function useCreateCategory() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postApi.createCategory,
    onSuccess: (category) => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      navigate(`/posts?categoryId=${encodeURIComponent(category.id)}`);
    },
  });
}

export function useCreatePost() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postApi.create,
    onSuccess: (post) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      navigate(`/posts/${post.id}`);
    },
  });
}

export function useUpdatePost() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postApi.update,
    onSuccess: (post) => {
      queryClient.setQueryData(['post', post.id], post);
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      navigate(`/posts/${post.id}`);
    },
  });
}

export function useDeletePost() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      navigate('/posts');
    },
  });
}

export function useToggleLike(post) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => (post.likedByCurrentUser ? postApi.unlike(post.id) : postApi.like(post.id)),
    onSuccess: ({ liked, likeCount }) => {
      queryClient.setQueryData(['post', post.id], (current) => current ? { ...current, likedByCurrentUser: liked, likeCount } : current);
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}
