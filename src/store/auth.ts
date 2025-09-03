import { create } from "zustand";
import { me } from "../services/authService";

// Tipagem da Role
export type Role =
  | "COORDENACAO_CNAPNE"
  | "EQUIPE_MULTIDISCIPLINAR"
  | "EQUIPE_AEE"
  | "ESTUDANTE"
  | string; 

export interface Session {
  email: string;
  role: Role;
}

// Tipagem do estado completo do store
interface AuthState {
  session: Session | null;
  isLoading: boolean; 
  setSession: (session: Session) => void;
  clearSession: () => void;
  initializeSession: () => Promise<void>; 
}

export const useAuth = create<AuthState>((set) => ({
  session: null,
  isLoading: true, 
  
  setSession: (session) => set({ session, isLoading: false }),

  clearSession: () => set({ session: null, isLoading: false }),
  
  initializeSession: async () => {
    try {
      const sessionData = await me();
      set({ session: sessionData, isLoading: false });
    } catch (error) {
      set({ session: null, isLoading: false });
    }
  },
}));