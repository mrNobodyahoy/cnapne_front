import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllProfessionals, deleteProfessional } from '../services/professionalService';
import type { ReadProfessionalDTO } from '../types/professional';
import { toast } from 'react-toastify';

export function useProfessionalsPage() {
  // Estado unificado para controlar o modal
  const [modalState, setModalState] = useState<{ mode: 'closed' | 'create' | 'edit'; data?: ReadProfessionalDTO }>({ mode: 'closed' });

  const queryClient = useQueryClient();

  // Query para buscar profissionais
  const { data: professionals, isLoading, isError, error } = useQuery<ReadProfessionalDTO[], Error>({
    queryKey: ['professionals'],
    queryFn: getAllProfessionals,
  });

  // Mutation para deletar profissional
  const deleteMutation = useMutation({
    mutationFn: deleteProfessional, // Passa a função diretamente
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professionals'] });
      toast.success('Profissional deletado com sucesso!');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Erro ao deletar profissional.');
    },
  });

  // Handlers para os modais
  const handleOpenCreateModal = () => setModalState({ mode: 'create' });
  const handleOpenEditModal = (professional: ReadProfessionalDTO) => setModalState({ mode: 'edit', data: professional });
  const handleCloseModal = () => setModalState({ mode: 'closed' });

  // Handler para a ação de deletar
  const handleDeleteProfessional = (id: string, name: string) => {
    // Usar window.confirm para ações destrutivas ainda é uma prática aceitável e simples
    if (window.confirm(`Tem certeza que deseja deletar o profissional ${name}?`)) {
      deleteMutation.mutate(id);
    }
  };

  // Retorna tudo que o componente da página precisa
  return {
    professionals,
    isLoading,
    isError,
    error,
    deleteMutation,
    modalState,
    handleOpenCreateModal,
    handleOpenEditModal,
    handleCloseModal,
    handleDeleteProfessional,
  };
}