import httpClient from '../../../services/httpClient';

export const authApi = {
  register: (payload) => httpClient.post('/auth/register', payload).then((response) => response.data.data),
  login: (payload) => httpClient.post('/auth/login', payload).then((response) => response.data.data),
  refresh: () => httpClient.post('/auth/refresh').then((response) => response.data.data),
  logout: () => httpClient.post('/auth/logout').then((response) => response.data.data),
  forgotPassword: (payload) => httpClient.post('/auth/forgot-password', payload).then((response) => response.data.data),
  resetPassword: (payload) => httpClient.post('/auth/reset-password', payload).then((response) => response.data.data),
  getProfile: () => httpClient.get('/users/me').then((response) => response.data.data),
  updateProfile: (payload) => httpClient.put('/users/me', payload).then((response) => response.data.data),
};

