import { create } from "zustand";
import { User } from "@/lib/types";

type AuthState = {
  user: User | null;
  authToken: string | null;
  loading: boolean;
  skipAuth: boolean;
  setUser: (user: User | null) => void;
  setAuthToken: (authToken: string | null) => void;
  setLoading: (loading: boolean) => void;
  setSkipAuth: (skipAuth: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  authToken: null,
  loading: true,
  skipAuth: false,
  setUser: (user) => set({ user }),
  setAuthToken: (authToken) => set({ authToken }),
  setLoading: (loading) => set({ loading }),
  setSkipAuth: (skipAuth) => set({ skipAuth }),
}));
