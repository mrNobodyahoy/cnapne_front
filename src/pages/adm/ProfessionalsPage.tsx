// src/pages/ProfissionaisPage.tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllProfessionals, deleteProfessional } from '../../services/professionalService';
import { AlertTriangle, LoaderCircle, Plus } from 'lucide-react';
import type { ReadProfessionalDTO } from '../../types/professional';
import { useState } from 'react';
import Button from '../../components/ui/Button';
import ProfessionalForm from '../../components/professional/ProfessionalForm';
import ProfessionalEditForm from '../../components/professional/ProfessionalEditForm';
import ProfessionalList from '../../components/professional/ProfessionalList'; 

export default function ProfissionaisPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [professionalToEdit, setProfessionalToEdit] = useState<ReadProfessionalDTO | null>(null);

  const queryClient = useQueryClient();

  const { data: professionals, isLoading, isError, error } = useQuery<ReadProfessionalDTO[], Error>({
    queryKey: ['professionals'],
    queryFn: getAllProfessionals,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProfessional(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['professionals'] }),
    onError: (err: any) => alert('Erro ao deletar profissional: ' + err.message),
  });

  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);

  const openEditModal = (professional: ReadProfessionalDTO) => {
    setProfessionalToEdit(professional);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setProfessionalToEdit(null);
    setIsEditModalOpen(false);
  };

  const handleDeleteProfessional = (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja deletar o profissional ${name}?`)) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoaderCircle className="h-8 w-8 animate-spin text-ifpr-green" />
        <p className="ml-2 text-gray-600">Carregando profissionais...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-md border border-red-300 bg-red-50 p-4 text-red-700">
        <div className="flex items-center">
          <AlertTriangle className="h-6 w-6 mr-2" />
          <p><strong>Erro:</strong> Não foi possível buscar os profissionais. {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto">
        {/* Cabeçalho + Botão */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-ifpr-black">Lista de Profissionais</h1>
            <p className="mt-1 text-gray-600">Gerencie os profissionais cadastrados no sistema.</p>
          </div>
          <Button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-ifpr-green text-white shadow-md hover:bg-green-700 transition font-medium"
          >
            <Plus className="h-5 w-5" />
            Adicionar Profissional
          </Button>
        </div>

        {/* Lista */}
        <ProfessionalList
          professionals={professionals}
          onEdit={openEditModal}
          onDelete={handleDeleteProfessional}
          deleteMutation={deleteMutation}
        />
      </div>

      {/* Modal de criação */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg bg-white p-8 shadow-2xl w-full max-w-2xl">
            <ProfessionalForm onClose={closeCreateModal} />
          </div>
        </div>
      )}

      {/* Modal de edição */}
      {isEditModalOpen && professionalToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg bg-white p-8 shadow-2xl w-full max-w-2xl">
            <ProfessionalEditForm onClose={closeEditModal} professional={professionalToEdit} />
          </div>
        </div>
      )}
    </div>
  );
}
