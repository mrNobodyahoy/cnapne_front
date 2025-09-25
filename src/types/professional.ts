// Adicione estes tipos ao seu arquivo de tipos
export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number; // número da página atual (base 0)
  size: number;
  first: boolean;
  last: boolean;
}

export interface GetProfessionalsParams {
  page?: number;
  size?: number;
  query?: string;
  role?: string;
  active?: boolean;
}

// Seus DTOs existentes continuam iguais
export interface ReadProfessionalDTO {
  id: string;
  email: string;
  fullName: string;
  specialty: string;
  role: string;
  active: boolean;
}

export interface CreateProfessionalDTO {
  email: string;
  password: string;
  fullName: string;
  specialty: string;
  role: string;
  active: boolean;
}

export interface UpdateProfessionalDTO {
  email: string;
  fullName: string;
  specialty: string;
  role: string;
  active: boolean;
}
