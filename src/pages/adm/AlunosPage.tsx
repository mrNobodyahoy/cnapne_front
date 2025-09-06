// src/pages/AlunosPage.tsx
import { LoaderCircle, AlertTriangle } from 'lucide-react';
import { useStudentsPage } from '../../hooks/useStudentPage';

// Componentes da página
import StudentPageHeader from '../../components/student/StudentPageHeader';
import StudentList from '../../components/student/StudentList';
import StudentForm from '../../components/student/StudentForm';
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
        {/* Cabeçalho com busca, filtro e botão */}
        <StudentPageHeader
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusChange={handleStatusChange}
          onAddStudent={openCreateModal} // 🔹 passa função
        />

        {/* Listagem */}
        <StudentList students={students} />
      </div>

      {/* Modal de criação */}
      <Modal isOpen={isCreateModalOpen} onClose={closeCreateModal}>
        <StudentForm onClose={closeCreateModal} />
      </Modal>
    </div>
  );
}
