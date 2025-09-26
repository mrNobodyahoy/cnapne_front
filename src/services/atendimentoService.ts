import api from "../lib/http";
import type {
  ReadService,
  CreateService,
  UpdateService,
  Page,
  GetAtendimentosParams,
} from "../types/atendimento";

export async function getAtendimentosPaginated(
  params: GetAtendimentosParams
): Promise<Page<ReadService>> {
  const { data } = await api.get<Page<ReadService>>("/atendimentos", {
    params,
  });
  return data;
}

export async function getAtendimentoById(id: string): Promise<ReadService> {
  const { data } = await api.get<ReadService>(`/atendimentos/${id}`);
  return data;
}

export async function createAtendimento(
  payload: CreateService
): Promise<ReadService> {
  const { data } = await api.post<ReadService>("/atendimentos", payload);
  return data;
}

export async function updateAtendimento(
  id: string,
  payload: UpdateService
): Promise<ReadService> {
  const { data } = await api.put<ReadService>(`/atendimentos/${id}`, payload);
  return data;
}

export async function deleteAtendimento(id: string): Promise<void> {
  await api.delete(`/atendimentos/${id}`);
}
