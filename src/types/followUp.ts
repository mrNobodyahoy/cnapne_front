import type { ReadProfessionalDTO } from "./professional";
import type { StudentSummary } from "./student";

export interface ReadFollowUp {
  sessionId: string;
  createdAt: string;
  sessionDate: string;
  sessionTime: string;
  sessionLocation: string;
  status: string;
  description: string;
  tasks: string;
  areasCovered: string;
  nextSteps: string;
  student: StudentSummary;
  professionals: ReadProfessionalDTO[];
}

export interface CreateFollowUp {
  sessionDate: string;
  sessionTime: string;
  sessionLocation: string;
  status: string;
  studentId: string;
  description: string;
  tasks: string;
  professionalIds: string[];
  areasCovered?: string;
}

export interface UpdateFollowUp {
  sessionDate: string;
  sessionTime: string;
  sessionLocation: string;
  status: string;
  studentId: string;
  description: string;
  tasks: string;
  professionalIds: string[];
  areasCovered?: string;
  nextSteps?: string;
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

export interface GetAcompanhamentosParams {
  page?: number;
  size?: number;
  studentId?: string;
  professionalId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  sort?: string;
}
