// src/pages/AlunosPage.tsx
import { LoaderCircle, AlertTriangle, Plus } from 'lucide-react';
import { useStudentsPage } from '../../hooks/useStudentPage';

// Componentes da página
import StudentPageHeader from '../../components/student/StudentPageHeader';
import StudentCards from '../../components/student/StudentListCard'; // 1. Corrigido: Importando o componente correto.
import StudentForm from '../../components/student/StudentForm';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';

type Status = 'ALL' | 'ATIVO' | 'INATIVO';

export default function AlunosPage() {
  const {
    students,
    isLoading,
    isError,
    error,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    isCreateModalOpen,
    openCreateModal,
    closeCreateModal,
  } = useStudentsPage();

  const handleStatusChange = (value: string) => {
    setStatusFilter(value as Status);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoaderCircle className="h-8 w-8 animate-spin text-ifpr-green" />
        <p className="ml-2 text-gray-600">Carregando estudantes...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-md border border-red-300 bg-red-50 p-4 text-red-700">
        <div className="flex items-center">
          <AlertTriangle className="h-6 w-6 mr-2" />
          <p>
            <strong>Erro:</strong> Não foi possível buscar os estudantes.{' '}
            {error ? error.message : 'Ocorreu um erro desconhecido.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto">
        <StudentPageHeader
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusChange={handleStatusChange}
        />
        {/* 3. Corrigido: Usando o StudentCards e passando apenas a prop 'students'. */}
        <StudentCards students={students} />

        <div className="flex justify-end mb-6 mt-4">
          <Button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-ifpr-green text-white shadow hover:bg-green-700 transition"
          >
            <Plus className="h-5 w-5" /> Adicionar Estudante
          </Button>
        </div>
      </div>

      {/* Modal de criação */}
      <Modal isOpen={isCreateModalOpen} onClose={closeCreateModal}>
        <StudentForm onClose={closeCreateModal} />
      </Modal>

      {/* 4. Removido: Os modais de Edição e Documentos foram removidos desta página.
        Suas ações (editar, deletar, gerenciar documentos) agora devem ser 
        iniciadas a partir da página de perfil do aluno (StudentProfilePage).
      */}
    </div>
  );
}