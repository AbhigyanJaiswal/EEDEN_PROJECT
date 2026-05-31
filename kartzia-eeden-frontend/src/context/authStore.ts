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

  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  restoreSession: () => Promise<void>;
}

// FIX: Single source of truth for token storage.
// Use sessionStorage by default (tab-scoped, clears on browser close) — more secure than
// localStorage for auth tokens because XSS on another tab can't read it.
const TOKEN_KEY = 'authToken';

export const getStoredToken = (): string | null =>
  sessionStorage.getItem(TOKEN_KEY) ?? localStorage.getItem(TOKEN_KEY);

export const storeToken = (token: string): void => {
  // Store in sessionStorage only. If you add a "remember me" checkbox
  // in the future, pass `persist = true` and use localStorage instead.
  sessionStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = (): void => {
  sessionStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(TOKEN_KEY); // clean up any legacy localStorage token
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  restoreSession: async () => {
    const token = getStoredToken();
    if (!token) return;

    set({ isLoading: true });
    try {
      const result = await authApi.getCurrentUser();
      if (result.success && result.data) {
        set({ user: result.data, isAuthenticated: true });
      } else {
        removeToken();
        set({ user: null, isAuthenticated: false });
      }
    } catch {
      removeToken();
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const result = await authApi.login(email, password);
      if (!result.success || !result.data) {
        throw new Error(result.error ?? 'Login failed');
      }
      storeToken(result.data.token);
      set({ user: result.data.user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const result = await authApi.signup(email, password, name);
      if (!result.success || !result.data) {
        throw new Error(result.error ?? 'Signup failed');
      }
      storeToken(result.data.token);
      set({ user: result.data.user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Signup failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  logout: () => {
    removeToken();
    authApi.logout().catch(() => undefined); // fire-and-forget server logout
    set({ user: null, isAuthenticated: false, error: null });
  },
}));
