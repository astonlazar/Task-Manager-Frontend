
import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  checkAuth: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  // State - check localStorage for authToken on initialization
  isAuthenticated: !!localStorage.getItem('authToken'),

  // Actions
  login: (token: string) => {
    localStorage.setItem('authToken', token);
    set({ isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('authToken');
    set({ isAuthenticated: false });
  },

  // Check auth status (useful for refreshing state)
  checkAuth: () => {
    const hasToken = !!localStorage.getItem('authToken');
    set({ isAuthenticated: hasToken });
  },
}));

export default useAuthStore;