// src/services/authService.ts
import api from "../services/http";
import type { Role } from "../types/auth";

export type MeResponse = { email: string; role: Role };

export async function loginRequest(payload: { email: string; password: string }) {
  // backend seta cookie e devolve role no body (token não vem mais)
  const { data } = await api.post<{ token: string | null; role: Role }>("/auth/login", payload);
  return data; // { token: null, role }
}

export async function logoutRequest() {
  await api.post("/auth/logout");
}

export async function me(): Promise<MeResponse> {
  const { data } = await api.get<MeResponse>("/auth/me");
  return data;
}
