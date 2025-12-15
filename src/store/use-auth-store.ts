import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/lib/types';

interface AuthState {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
    updateUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            login: (token, user) => {
                // Sync to localStorage for API client usage if needed outside store
                if (typeof window !== 'undefined') {
                    localStorage.setItem('access_token', token);
                }
                set({ accessToken: token, user, isAuthenticated: true });
            },
            logout: () => {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('access_token');
                }
                set({ accessToken: null, user: null, isAuthenticated: false });
            },
            updateUser: (user) => set({ user }),
        }),
        {
            name: 'auth-storage',
        }
    )
);
