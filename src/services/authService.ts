// src/services/authService.ts
import api from "../lib/http";
import type { Role } from "../types/auth";

export type MeResponse = { email: string; role: Role };

export async function loginRequest(payload: { email: string; password: string }) {
  const { data } = await api.post<{ role: Role }>("/auth/login", payload);
  return data; 
}

export async function logoutRequest() {
  await api.post("/auth/logout");
}

export async function me(): Promise<MeResponse> {
  const { data } = await api.get<MeResponse>("/auth/me");
  return data;
}
