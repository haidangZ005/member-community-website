import httpClient from '../../../services/httpClient';

export const commentApi = {
  list: async (postId) => (await httpClient.get(`/posts/${postId}/comments`)).data.data,
  create: async ({ postId, content }) => (await httpClient.post(`/posts/${postId}/comments`, { content })).data.data,
};
