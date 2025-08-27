// store/auth.ts
import { create } from "zustand";

export type Role =
  | "COORDENACAO_CNAPNE"
  | "EQUIPE_MULTIDISCIPLINAR"
  | "EQUIPE_AEE"
  | "ESTUDANTE"
  | string;

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  role: Role;
}

interface AuthState {
  session: AuthResponse | null;
  setSession: (session: AuthResponse) => void;
  clearSession: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  session: null,  
  setSession: (session) => set({ session }),
  clearSession: () => set({ session: null }),
}));
