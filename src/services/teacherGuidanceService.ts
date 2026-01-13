import api from "../lib/http";
import type {
  CreateTeacherGuidance,
  ReadTeacherGuidance,
  UpdateTeacherGuidance,
  GetGuidancesParams,
} from "../types/teacherGuidance";
import type { Page } from "../types/professional";

export const createTeacherGuidance = async (
  data: CreateTeacherGuidance
): Promise<ReadTeacherGuidance> => {
  const response = await api.post<ReadTeacherGuidance>(
    "orientacoes-professor",
    data
  );
  return response.data;
};

export const updateTeacherGuidance = async (
  id: string,
  data: UpdateTeacherGuidance
): Promise<ReadTeacherGuidance> => {
  const response = await api.put<ReadTeacherGuidance>(
    `orientacoes-professor/${id}`,
    data
  );
  return response.data;
};

export const getAllTeacherGuidances = async (
  params: GetGuidancesParams
): Promise<Page<ReadTeacherGuidance>> => {
  const { data } = await api.get<Page<ReadTeacherGuidance>>(
    "orientacoes-professor",
    { params }
  );
  return data;
};

export const getTeacherGuidanceById = async (
  id: string
): Promise<ReadTeacherGuidance> => {
  // O endpoint deve corresponder ao seu GetMapping no Controller
  const response = await api.get<ReadTeacherGuidance>(
    `/orientacoes-professor/${id}`
  );
  return response.data;
};
