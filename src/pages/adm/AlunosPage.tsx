import { LoaderCircle, AlertTriangle } from "lucide-react";
import { useStudentsPage } from "../../hooks/useStudentPage";
import StudentPageHeader from "../../components/student/StudentPageHeader";
import StudentList from "../../components/student/StudentList";
import StudentForm from "../../components/student/StudentForm";
import Modal from "../../components/ui/Modal";
import Pagination from "../../components/ui/Pagination";

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
            <strong>Erro:</strong> Não foi possível buscar os estudantes.{" "}
            {error ? error.message : "Ocorreu um erro desconhecido."}
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
          onSearchChange={handleSearchChange}
          statusFilter={statusFilter}
          onStatusChange={handleStatusChange}
          onAddStudent={openCreateModal}
        />

        <StudentList students={students} />

        {pageData && pageData.totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={pageData.totalPages}
            onPageChange={setPage}
            isFetching={isLoading}
          />
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
