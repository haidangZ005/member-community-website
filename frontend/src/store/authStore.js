import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isInitialized: false,
  setSession: ({ user, accessToken }) => set({ user, accessToken, isAuthenticated: true }),
  updateUser: (user) => set({ user }),
  clearSession: () => set({ user: null, accessToken: null, isAuthenticated: false }),
  setInitialized: (isInitialized) => set({ isInitialized }),
}));

