import { create } from 'zustand';
import { authApi } from '../utils/api/endpoints';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  // BUG FIX: expose token restore so App.tsx can call it on mount
  restoreSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,

  setUser: (user: User | null) => set({ user, isAuthenticated: !!user }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setError: (error: string | null) => set({ error }),
  clearError: () => set({ error: null }),

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const result = await authApi.login(email, password);
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Login failed');
      }
      localStorage.setItem('authToken', result.data.token);
      set({ user: result.data.user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  signup: async (email: string, password: string, name: string) => {
    set({ isLoading: true, error: null });
    try {
      const result = await authApi.signup(email, password, name);
      if (!result.success || !result.data) {
        throw new Error(result.error || 'Signup failed');
      }
      localStorage.setItem('authToken', result.data.token);
      set({ user: result.data.user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Signup failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  logout: () => {
    set({ user: null, isAuthenticated: false, error: null });
    localStorage.removeItem('authToken');
  },

  // BUG FIX: actually verify token and restore user on page load
  restoreSession: async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    set({ isLoading: true });
    try {
      const result = await authApi.getCurrentUser();
      if (result.success && result.data) {
        set({ user: result.data, isAuthenticated: true, isLoading: false });
      } else {
        // Token is invalid/expired — clean up
        localStorage.removeItem('authToken');
        set({ isLoading: false });
      }
    } catch {
      localStorage.removeItem('authToken');
      set({ isLoading: false });
    }
  },
}));
