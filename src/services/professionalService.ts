// src/services/professionalService.ts

import api from "../lib/http";
import type {
  ReadProfessionalDTO,
  CreateProfessionalDTO,
  UpdateProfessionalDTO,
  Page,
  GetProfessionalsParams,
  PasswordChangeData,
} from "../types/professional";

export async function getProfessionalsPaginated(
  params: GetProfessionalsParams
): Promise<Page<ReadProfessionalDTO>> {
  const { data } = await api.get<Page<ReadProfessionalDTO>>("/professionals", {
    params,
  });
  return data;
}

export async function createProfessional(
  payload: CreateProfessionalDTO
): Promise<ReadProfessionalDTO> {
  const { data } = await api.post<ReadProfessionalDTO>(
    "/professionals",
    payload
  );
  return data;
}

export async function updateProfessional(
  id: string,
  payload: UpdateProfessionalDTO
): Promise<ReadProfessionalDTO> {
  const { data } = await api.put<ReadProfessionalDTO>(
    `/professionals/${id}`,
    payload
  );
  return data;
}

export async function getMyProfile(): Promise<ReadProfessionalDTO> {
  const { data } = await api.get<ReadProfessionalDTO>("/professionals/me");
  return data;
}

export async function changeMyPassword(data: PasswordChangeData) {
  await api.put("/professionals/me/change-password", data);
}

export async function deleteProfessional(id: string): Promise<void> {
  await api.delete(`/professionals/${id}`);
}
