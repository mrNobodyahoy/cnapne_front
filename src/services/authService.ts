import api from "../lib/http";
import type { Session } from "../store/auth";

export async function loginRequest(payload: {
  email: string;
  password: string;
}): Promise<Session> {
  const { data } = await api.post<Session>("/auth/login", payload);
  return data;
}

export async function logoutRequest() {
  await api.post("/auth/logout");
}

export async function me(): Promise<Session> {
  const { data } = await api.get<Session>("/auth/me");
  return data;
}
