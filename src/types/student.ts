export interface Student {
  id: string;
  completeName: string;
  email: string;
  registration: string;
  team: string;
  birthDate: string;
  phone: string;
  gender: string;
  ethnicity: string;
  status: "ATIVO" | "INATIVO" | "ARQUIVADO";
  responsibles?: ResponsibleDTO[];
}

export interface CreateStudentDTO {
  email: string;
  password: string;
  completeName: string;
  registration: string;
  team: string;
  birthDate: string;
  phone: string;
  gender: string;
  ethnicity: string;
  responsibles?: ResponsibleDTO[];
}

export interface UpdateStudentDTO {
  email: string;
  completeName: string;
  registration: string;
  team: string;
  birthDate: string;
  phone: string;
  gender: string;
  ethnicity: string;
  status: "ATIVO" | "INATIVO" | "ARQUIVADO";
}

export interface ResponsibleDTO {
  completeName: string;
  email: string;
  phone: string;
  kinship: string;
}

export interface StudentSummary {
  id: string;
  completeName: string;
  registration: string;
  team: string;
  status: "ATIVO" | "INATIVO" | "ARQUIVADO";
}

export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface GetStudentsParams {
  page?: number;
  size?: number;
  query?: string;
  status?: "ALL" | "ATIVO" | "INATIVO" | "ARQUIVADO";
}

export interface ServiceMonitoringItem {
  id: string;
  title: string;
  date: string;
  status: string;
  professionalNames: string[];
}

export interface GuidanceItem {
  id: string;
  guidanceDetails: string;
  date: string;
  status: string;
  authorName: string;
  serviceId: string | null;
  followUpId: string | null;
}

export type TimelineItem =
  | ({ type: "ATENDIMENTO" | "ACOMPANHAMENTO" } & ServiceMonitoringItem)
  | ({ type: "ORIENTACAO" } & GuidanceItem);
