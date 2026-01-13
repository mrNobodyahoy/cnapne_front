import type { StudentSummary } from "../types/student";
import type { ReadProfessionalDTO } from "./professional";

export interface CreateTeacherGuidance {
  serviceId?: string | null;
  followUpId?: string | null;
  guidanceDetails: string;
  recommendations: string;
  domiciliar: boolean;
}

export interface ReadTeacherGuidance {
  id: string;
  createdAt: string;
  student: StudentSummary;
  serviceId: string | null;
  followUpId: string | null;
  guidanceDetails: string;
  recommendations: string;
  domiciliar: boolean;
  author: ReadProfessionalDTO;
}

export interface UpdateTeacherGuidance {
  guidanceDetails: string;
  recommendations?: string;
  domiciliar: boolean;
}

export interface GetGuidancesParams {
  page?: number;
  size?: number;
  studentName?: string;
  domiciliar?: boolean;
  sort?: string;
}
