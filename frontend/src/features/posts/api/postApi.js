import httpClient from '../../../services/httpClient';

export const postApi = {
  list: async (params) => (await httpClient.get('/posts', { params })).data,
  getById: async (id) => (await httpClient.get(`/posts/${id}`)).data.data,
  create: async (input) => (await httpClient.post('/posts', input)).data.data,
  update: async ({ id, ...input }) => (await httpClient.put(`/posts/${id}`, input)).data.data,
  remove: async (id) => (await httpClient.delete(`/posts/${id}`)).data.data,
  like: async (id) => (await httpClient.post(`/posts/${id}/like`)).data.data,
  unlike: async (id) => (await httpClient.delete(`/posts/${id}/like`)).data.data,
  categories: async (params) => (await httpClient.get('/posts/categories', { params })).data.data,
  createCategory: async (input) => (await httpClient.post('/posts/categories', input)).data.data,
};
