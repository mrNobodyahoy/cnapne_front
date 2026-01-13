import type { ReadProfessionalDTO } from "./professional";
import type { StudentSummary } from "./student";
import type { ReadTeacherGuidance } from "./teacherGuidance";

export interface ReadService {
  sessionId: string;
  createdAt: string;
  sessionDate: string;
  sessionTime: string;
  sessionLocation: string;
  status: string;
  typeService: string;
  descriptionService: string;
  tasks: string;
  objectives: string;
  results: string;
  student: StudentSummary;
  professionals: ReadProfessionalDTO[];
  teacherGuidance: ReadTeacherGuidance | null;
}

export interface CreateService {
  sessionDate: string;
  sessionTime: string;
  sessionLocation: string;
  status: string;
  studentId: string;
  typeService: string;
  descriptionService: string;
  tasks: string;
  professionalIds: string[];
  objectives?: string;
}

export interface UpdateService {
  sessionDate: string;
  sessionTime: string;
  sessionLocation: string;
  status: string;
  studentId: string;
  typeService: string;
  descriptionService: string;
  tasks: string;
  professionalIds: string[];
  objectives?: string;
  results?: string;
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
  studentName?: string;
  professionalId?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  sort?: string;
}
