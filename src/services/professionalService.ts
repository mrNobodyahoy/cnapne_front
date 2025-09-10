// src/services/professionalService.ts

import api from '../lib/http';
import type { ReadProfessionalDTO, CreateProfessionalDTO, UpdateProfessionalDTO } from '../types/professional';

// Função para buscar TODOS os profissionais (sem filtros)
export async function getProfessionals(): Promise<ReadProfessionalDTO[]> {
  const { data } = await api.get<ReadProfessionalDTO[]>('/professionals');
  return data;
}

// Função para BUSCAR por nome
export async function searchProfessionals(query: string): Promise<ReadProfessionalDTO[]> {
  const { data } = await api.get<ReadProfessionalDTO[]>('/professionals/search', {
    params: { query },
  });
  return data;
}

// Função para FILTRAR por status (ativo/inativo)
export async function filterProfessionalsByStatus(active: boolean): Promise<ReadProfessionalDTO[]> {
  const { data } = await api.get<ReadProfessionalDTO[]>('/professionals/filter', {
    params: { active },
  });
  return data;
}

// Função para FILTRAR por função/perfil
export async function filterProfessionalsByRole(role: string): Promise<ReadProfessionalDTO[]> {
  const { data } = await api.get<ReadProfessionalDTO[]>('/professionals/filter', {
    params: { role },
  });
  return data;
}


// Funções de create, update e delete permanecem as mesmas
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