// src/pages/ProfissionaisPage.tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllProfessionals, deleteProfessional } from '../services/professionalService';
import { AlertTriangle, LoaderCircle, Plus, Edit, Trash } from 'lucide-react';
import type { ReadProfessionalDTO } from '../types/professional';
import { useState } from 'react';
import Button from '../components/ui/Button';
import ProfessionalForm from '../components/professional/ProfessionalForm';
import ProfessionalEditForm from '../components/professional/ProfessionalEditForm';

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
      <div className="max-w-5xl mx-auto">
        {/* Cabeçalho */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-ifpr-black">Lista de Profissionais</h1>
            <p className="mt-1 text-gray-600">Gerencie os profissionais cadastrados no sistema.</p>
          </div>
          {/* ✅ CABEÇALHO VOLTOU AO ORIGINAL */}
        </div>

        {/* Tabela de profissionais */}
        <div className="rounded-lg border bg-white shadow-sm overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100 border-b-2 border-gray-300">
              <tr>
                <th className="w-1/4 px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide text-gray-700">Nome Completo</th>
                <th className="w-1/4 px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide text-gray-700">E-mail</th>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide text-gray-700">Especialidade</th>
                <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wide text-gray-700">Função</th>
                <th className="w-20 px-6 py-4 text-center text-sm font-semibold uppercase tracking-wide text-gray-700">Status</th>
                <th className="w-20 px-6 py-4 text-center text-sm font-semibold uppercase tracking-wide text-gray-700">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {professionals?.map((professional, idx) => (
                <tr key={professional.id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100`}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{professional.fullName}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{professional.email}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{professional.specialty}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">{professional.role}</td>
                  <td className="whitespace-nowrap px-6 py-4 text-center text-sm">
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${professional.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {professional.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-center text-sm font-medium flex justify-center gap-2">
                    <button
                        onClick={() => openEditModal(professional)}
                        className="p-2 rounded-full text-ifpr-green hover:bg-green-50 hover:text-green-700 transition"
                        title="Editar Profissional"
                    >
                        <Edit className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => handleDeleteProfessional(professional.id, professional.fullName)}
                        className="p-2 rounded-full text-red-500 hover:bg-red-50 hover:hover:text-red-700 transition"
                        title="Deletar Profissional"
                        disabled={deleteMutation.isPending && deleteMutation.variables === professional.id}
                    >
                        {deleteMutation.isPending && deleteMutation.variables === professional.id ? (
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                        ) : (
                        <Trash className="h-4 w-4" />
                        )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {(!professionals || professionals.length === 0) && (
            <div className="p-8 text-center text-gray-500">
              Nenhum profissional encontrado.
            </div>
          )}
        </div>

        {/* ✅ BOTÃO POSICIONADO ABAIXO DA TABELA */}
        <div className="mt-6 flex justify-end">
            <Button
                onClick={openCreateModal}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-ifpr-green text-white shadow hover:bg-green-700 transition"
            >
                <Plus className="h-5 w-5" />
                Adicionar Profissional
            </Button>
        </div>
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