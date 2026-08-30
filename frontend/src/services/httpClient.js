import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';
const httpClient = axios.create({ baseURL: apiBaseUrl, withCredentials: true, timeout: 10000 });
let refreshPromise = null;

httpClient.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config;
    const isAuthAction = ['/auth/login', '/auth/register', '/auth/refresh'].some((path) => request?.url?.includes(path));
    if (error.response?.status !== 401 || request?._retried || isAuthAction) throw error;

    request._retried = true;
    refreshPromise ||= axios.post(`${apiBaseUrl}/auth/refresh`, {}, { withCredentials: true })
      .finally(() => { refreshPromise = null; });
    try {
      const { data } = await refreshPromise;
      useAuthStore.getState().setSession(data.data);
      request.headers.Authorization = `Bearer ${data.data.accessToken}`;
      return httpClient(request);
    } catch (refreshError) {
      useAuthStore.getState().clearSession();
      throw refreshError;
    }
  },
);

export default httpClient;

