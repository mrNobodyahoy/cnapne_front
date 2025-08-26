import api from '../lib/http';
import type { ReadProfessionalDTO, CreateProfessionalDTO, UpdateProfessionalDTO} from '../types/professional';

export async function getAllProfessionals(): Promise<ReadProfessionalDTO[]> {
  const { data } = await api.get<ReadProfessionalDTO[]>('/professionals');
  console.log('Dados retornados pelo serviço:', data);
  return data;
}

export async function createProfessional(payload: CreateProfessionalDTO): Promise<ReadProfessionalDTO> {
  const { data } = await api.post<ReadProfessionalDTO>('/professionals', payload);
  return data;
}

export async function updateProfessional(id: string, payload: UpdateProfessionalDTO): Promise<ReadProfessionalDTO> {
  const { data } = await api.put<ReadProfessionalDTO>(`/professionals/${id}`, payload);
  return data;
}

export async function deleteProfessional(id: string): Promise<void> {
  await api.delete(`/professionals/${id}`);
}