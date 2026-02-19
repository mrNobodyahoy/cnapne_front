import { LoaderCircle, AlertTriangle } from "lucide-react";
import { useStudentsPage } from "../../../hooks/student/useStudentPage"; // Verifique se o caminho do hook está correto
import StudentPageHeader from "../../../components/student/StudentPageHeader";
import StudentList from "../../../components/student/StudentList";
import StudentForm from "../../../components/student/StudentForm"; // Este deve ser o formulário de CRIAÇÃO
import Modal from "../../../components/ui/Modal";
import Pagination from "../../../components/ui/Pagination";

type Status = "ALL" | "ATIVO" | "INATIVO";

export default function AlunosPage() {
  const {
    students,
    pageData,
    isLoading,
    isError,
    error,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    page,
    setPage,
    isCreateModalOpen,
    openCreateModal,
    closeCreateModal,
  } = useStudentsPage();

  const handleStatusChange = (value: string) => {
    setPage(0);
    setStatusFilter(value as Status);
  };

  const handleSearchChange = (value: string) => {
    setPage(0);
    setSearchTerm(value);
  };

  if (isLoading && !pageData) {
    return (
      <div className="flex items-center justify-center p-8 h-64">
        <LoaderCircle className="h-8 w-8 animate-spin text-ifpr-green" />
        <p className="ml-2 text-gray-600">Carregando estudantes...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto mt-6">
        <div className="rounded-md border border-red-300 bg-red-50 p-4 text-red-700 shadow-sm">
          <div className="flex items-center">
            <AlertTriangle className="h-6 w-6 mr-2" />
            <p>
              <strong>Erro:</strong> Não foi possível buscar os estudantes.{" "}
              {error ? error.message : "Ocorreu um erro desconhecido."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto p-4 space-y-4">
        <StudentPageHeader
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          statusFilter={statusFilter}
          onStatusChange={handleStatusChange}
          onAddStudent={openCreateModal}
        />

        <StudentList students={students} />

        {pageData && pageData.totalPages > 1 && (
          <div className="mt-4">
            <Pagination
              currentPage={page}
              totalPages={pageData.totalPages}
              onPageChange={setPage}
              isFetching={isLoading}
            />
          </div>
        )}
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        title="Criar Novo Estudante"
      >
        <StudentForm onClose={closeCreateModal} />
      </Modal>
    </div>
  );
}