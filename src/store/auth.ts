// src/store/auth.ts
import { create } from "zustand";
import { me } from "../services/authService"; // Importe o serviço 'me'

// Tipagem da Role
export type Role =
  | "COORDENACAO_CNAPNE"
  | "EQUIPE_MULTIDISCIPLINAR"
  | "EQUIPE_AEE"
  | "ESTUDANTE"
  | string; // Mantemos 'string' para flexibilidade

// Tipagem da resposta da sessão (usuário logado)
export interface Session {
  email: string;
  role: Role;
}

// Tipagem do estado completo do store
interface AuthState {
  session: Session | null;
  isLoading: boolean; // 👈 NOVO: para saber se a sessão está sendo verificada
  setSession: (session: Session) => void;
  clearSession: () => void;
  initializeSession: () => Promise<void>; // 👈 NOVO: função para carregar a sessão
}

export const useAuth = create<AuthState>((set) => ({
  session: null,
  isLoading: true, // 👈 Inicia como true, pois vamos verificar a sessão ao carregar
  
  setSession: (session) => set({ session, isLoading: false }),

  clearSession: () => set({ session: null, isLoading: false }),
  
  // Função que roda na inicialização do app
  initializeSession: async () => {
    try {
      // Tenta buscar os dados do usuário do backend
      const sessionData = await me();
      set({ session: sessionData, isLoading: false });
    } catch (error) {
      // Se der erro (ex: 401 Unauthorized), significa que não há sessão válida
      set({ session: null, isLoading: false });
    }
  },
}));