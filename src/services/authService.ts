// src/services/authService.ts
import api from "../lib/http";
import type { Session } from "../store/auth"; // Importe a tipagem da sessão

// A resposta do login agora é a sessão completa
export async function loginRequest(payload: { email: string; password: string }): Promise<Session> {
  const { data } = await api.post<Session>("/auth/login", payload);
  return data;
}

export async function logoutRequest() {
  await api.post("/auth/logout");
}

// A função 'me' continua igual, retornando a sessão
export async function me(): Promise<Session> {
  const { data } = await api.get<Session>("/auth/me");
  return data;
}