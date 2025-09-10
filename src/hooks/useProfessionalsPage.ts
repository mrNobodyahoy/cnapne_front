// src/hooks/useProfessionalsPage.ts
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  deleteProfessional,
  getProfessionals,
  searchProfessionals,
  filterProfessionalsByRole,
  filterProfessionalsByStatus
} from '../services/professionalService';
import type { ReadProfessionalDTO } from '../types/professional';
import { toast } from 'react-hot-toast';
import { useDebounce } from '../hooks/useDebounce';

export function useProfessionalsPage() {
  const queryClient = useQueryClient();

  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const debouncedSearchTerm = useDebounce(searchInput, 300);

  // Função que usa os endpoints existentes e aplica os filtros restantes em memória
  const fetchAndCombine = async (): Promise<ReadProfessionalDTO[]> => {
    const q = (debouncedSearchTerm || '').trim();
    const hasQuery = q.length > 0;
    const hasRole = roleFilter !== '' && roleFilter !== 'ALL';
    const hasStatus = statusFilter !== '' && statusFilter !== 'ALL';

    // nenhum filtro: retorna tudo
    if (!hasQuery && !hasRole && !hasStatus) {
      return getProfessionals();
    }

    let baseList: ReadProfessionalDTO[] = [];

    // escolhe o endpoint mais seletivo disponível para reduzir payload
    if (hasQuery) {
      baseList = await searchProfessionals(q);
    } else if (hasRole) {
      baseList = await filterProfessionalsByRole(roleFilter);
    } else if (hasStatus) {
      const isActive = statusFilter === 'ACTIVE';
      baseList = await filterProfessionalsByStatus(isActive);
    }

    // Aplica os filtros adicionais em memória (interseção)
    const filtered = baseList.filter((p) => {
      // role: tente igualar por igualdade (case-insensitive) ou contains (cobre label vs enum)
      if (hasRole) {
        const roleFromApi = (p.role || '').toString();
        const rf = roleFilter.toString();
        const matchRole =
          roleFromApi.toUpperCase() === rf.toUpperCase() ||
          roleFromApi.toUpperCase().includes(rf.toUpperCase());
        if (!matchRole) return false;
      }

      // status
      if (hasStatus) {
        const expectedActive = statusFilter === 'ACTIVE';
        if (p.active !== expectedActive) return false;
      }

      // query: nome ou email (caso tenhamos usado outro endpoint como base)
      if (hasQuery) {
        const qq = q.toLowerCase();
        const name = (p.fullName || '').toLowerCase();
  if (!name.startsWith(qq)) return false;      }

      return true;
    });

    return filtered;
  };

  const {
    data: professionals,
    isLoading,
    isFetching,
    isError,
    error
  } = useQuery<ReadProfessionalDTO[], Error>({
    queryKey: ['professionals', roleFilter, statusFilter, debouncedSearchTerm],
    queryFn: fetchAndCombine,
    placeholderData: [],
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProfessional,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professionals'] });
      toast.success('Profissional deletado com sucesso!');
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Erro ao deletar profissional.');
    },
  });

  const handleDeleteProfessional = (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja deletar o profissional ${name}?`)) {
      deleteMutation.mutate(id);
    }
  };

  const [modalState, setModalState] = useState<{ mode: 'closed' | 'create' | 'edit'; data?: ReadProfessionalDTO }>({ mode: 'closed' });
  const handleOpenCreateModal = () => setModalState({ mode: 'create' });
  const handleOpenEditModal = (professional: ReadProfessionalDTO) => setModalState({ mode: 'edit', data: professional });
  const handleCloseModal = () => setModalState({ mode: 'closed' });

  return {
    professionals,
    isLoading,
    isFetching,
    isError,
    error,
    deleteMutation,
    modalState,
    filters: { roleFilter, statusFilter, searchInput },
    handlers: {
      handleOpenCreateModal,
      handleOpenEditModal,
      handleCloseModal,
      handleDeleteProfessional,
      handleRoleChange: setRoleFilter,
      handleStatusChange: setStatusFilter,
      handleSearchChange: setSearchInput,
    },
  };
}
