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
  status: string;
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
  status: string;
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
  status: string;
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
  status?: "ALL" | "ATIVO" | "INATIVO";
}

export type TimelineItemType = "ATENDIMENTO" | "ACOMPANHAMENTO";

export interface TimelineItem {
  id: string;
  type: TimelineItemType;
  title: string;
  date: string; // "YYYY-MM-DD"
  status: string;
  professionalNames: string[];
}
