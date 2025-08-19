// src/store/auth.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Role } from "../types/auth";

type AuthState = {
  email: string | null;
  role: Role | null;
  setSession: (s: { email: string; role: Role }) => void;
  clear: () => void;
};

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      email: null,
      role: null,
      setSession: (s) => set({ email: s.email, role: s.role }),
      clear: () => set({ email: null, role: null }),
    }),
    {
      name: "cnapne-session",
      storage: createJSONStorage(() => sessionStorage),
      version: 1,
    }
  )
);
