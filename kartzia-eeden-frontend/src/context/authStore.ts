import { create } from 'zustand';

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
}

export const useAuthStore = create<AuthState>((set: any) => ({
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
      // API call would go here
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      set({ user: data.user, isAuthenticated: true, isLoading: false });
      localStorage.setItem('authToken', data.token);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  signup: async (email: string, password: string, name: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      if (!response.ok) {
        throw new Error('Signup failed');
      }

      const data = await response.json();
      set({ user: data.user, isAuthenticated: true, isLoading: false });
      localStorage.setItem('authToken', data.token);
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
}));
