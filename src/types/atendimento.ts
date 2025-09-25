import type { ReadProfessionalDTO } from "./professional";
import type { StudentSummary } from "./student";

export interface ReadService {
  sessionId: string;
  createdAt: string;
  sessionDate: string;
  sessionTime: string;
  sessionLocation: string;
  periodicity: string;
  status: string;
  typeService: string;
  descriptionService: string;
  tasks: string;
  student: StudentSummary;
  professionals: ReadProfessionalDTO[];
}

export interface CreateService {
  sessionDate: string;
  sessionTime: string;
  sessionLocation: string;
  periodicity: string;
  status: string;
  studentId: string;
  typeService: string;
  descriptionService: string;
  tasks: string;
  professionalIds: string[];
}

export interface UpdateService {
  sessionDate: string;
  sessionTime: string;
  sessionLocation: string;
  periodicity: string;
  status: string;
  studentId: string;
  typeService: string;
  descriptionService: string;
  tasks: string;
  professionalIds: string[];
}

export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export interface GetAtendimentosParams {
  page?: number;
  size?: number;
  studentId?: string;
  professionalId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  sort?: string;
}
