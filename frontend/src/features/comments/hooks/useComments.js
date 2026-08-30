import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { commentApi } from '../api/commentApi';

export function useComments(postId) {
  return useQuery({ queryKey: ['comments', postId], queryFn: () => commentApi.list(postId), enabled: Boolean(postId) });
}

export function useCreateComment(postId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content) => commentApi.create({ postId, content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}
