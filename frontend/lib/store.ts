import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser, Profile } from "@/types";

interface AuthState {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isGuest: boolean;
    accessToken: string | null;

    // Actions
    setUser: (user: AuthUser, token?: string) => void;
    setGuestUser: (name: string) => void;
    logout: () => void;
}

interface ProfileState {
    profile: Profile | null;
    isLoading: boolean;

    // Actions
    setProfile: (profile: Profile) => void;
    updateProfile: (updates: Partial<Profile>) => void;
    clearProfile: () => void;
}

// Auth store with persistence
export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            isGuest: false,
            accessToken: null,

            setUser: (user, token) =>
                set({
                    user,
                    isAuthenticated: true,
                    isGuest: false,
                    accessToken: token || null,
                }),

            setGuestUser: (name) =>
                set({
                    user: {
                        id: `guest-${Date.now()}`,
                        name,
                        isGuest: true,
                    },
                    isAuthenticated: true,
                    isGuest: true,
                    accessToken: null,
                }),

            logout: () =>
                set({
                    user: null,
                    isAuthenticated: false,
                    isGuest: false,
                    accessToken: null,
                }),
        }),
        {
            name: "profilestack-auth",
        },
    ),
);

// Profile store with persistence (for guest mode)
export const useProfileStore = create<ProfileState>()(
    persist(
        (set) => ({
            profile: null,
            isLoading: false,

            setProfile: (profile) => set({ profile }),

            updateProfile: (updates) =>
                set((state) => ({
                    profile: state.profile
                        ? { ...state.profile, ...updates }
                        : null,
                })),

            clearProfile: () => set({ profile: null }),
        }),
        {
            name: "profilestack-profile",
        },
    ),
);
