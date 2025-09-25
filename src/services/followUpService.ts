import api from "../lib/http";
import type {
  ReadFollowUp,
  CreateFollowUp,
  UpdateFollowUp,
  Page,
  GetAcompanhamentosParams,
} from "../types/followUp";

// Nova função paginada
export async function getAcompanhamentosPaginated(
  params: GetAcompanhamentosParams
): Promise<Page<ReadFollowUp>> {
  const { data } = await api.get<Page<ReadFollowUp>>("/acompanhamentos", {
    params,
  });
  return data;
}

export async function getAcompanhamentoById(id: string): Promise<ReadFollowUp> {
  const { data } = await api.get<ReadFollowUp>(`/acompanhamentos/${id}`);
  return data;
}

export async function createAcompanhamento(
  payload: CreateFollowUp
): Promise<ReadFollowUp> {
  const { data } = await api.post<ReadFollowUp>("/acompanhamentos", payload);
  return data;
}

export async function updateAcompanhamento(
  id: string,
  payload: UpdateFollowUp
): Promise<ReadFollowUp> {
  const { data } = await api.put<ReadFollowUp>(
    `/acompanhamentos/${id}`,
    payload
  );
  return data;
}

export async function deleteAcompanhamento(id: string): Promise<void> {
  await api.delete(`/acompanhamentos/${id}`);
}
