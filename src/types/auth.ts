export type Role = "COORDENACAO_CNAPNE" | "EQUIPE_MULTIDISCIPLINAR" | "EQUIPE_AEE" | "ESTUDANTE" | string;

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string; // JWT
  role: Role;
}
