import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../api/adminApi';

export function useDashboardStats() {
  return useQuery({ queryKey: ['admin', 'dashboard'], queryFn: adminApi.dashboard });
}

export function useAdminMembers(params) {
  return useQuery({ queryKey: ['admin', 'members', params], queryFn: () => adminApi.members(params), placeholderData: (previous) => previous });
}

export function useMemberStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => status === 'active' ? adminApi.lockMember(id) : adminApi.unlockMember(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'members'] }); queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] }); },
  });
}

export function useAdminPosts(params) {
  return useQuery({ queryKey: ['admin', 'posts', params], queryFn: () => adminApi.posts(params), placeholderData: (previous) => previous });
}

export function useModeratePost() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: adminApi.deletePost, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'posts'] }); queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] }); queryClient.invalidateQueries({ queryKey: ['posts'] }); } });
}

export function useAdminComments(params) {
  return useQuery({ queryKey: ['admin', 'comments', params], queryFn: () => adminApi.comments(params), placeholderData: (previous) => previous });
}

export function useModerateComment() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: adminApi.deleteComment, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin', 'comments'] }); queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] }); queryClient.invalidateQueries({ queryKey: ['comments'] }); } });
}

export function useAdminCategories() {
  return useQuery({ queryKey: ['admin', 'categories'], queryFn: adminApi.categories });
}

export function useCategoryActions() {
  const queryClient = useQueryClient();
  const refresh = () => { queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] }); queryClient.invalidateQueries({ queryKey: ['categories'] }); queryClient.invalidateQueries({ queryKey: ['admin', 'dashboard'] }); };
  return {
    create: useMutation({ mutationFn: adminApi.createCategory, onSuccess: refresh }),
    update: useMutation({ mutationFn: adminApi.updateCategory, onSuccess: refresh }),
    remove: useMutation({ mutationFn: adminApi.deleteCategory, onSuccess: refresh }),
  };
}
