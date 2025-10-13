import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { deleteStudent, getStudents } from "../../services/studentService";
import type { Page, StudentSummary } from "../../types/student";
import { useDebounce } from "../util/useDebounce";

export function useStudentsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ATIVO" | "INATIVO">(
    "ALL"
  );
  const [page, setPage] = useState(0);

  const queryClient = useQueryClient();
  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  const {
    data: pageData,
    isLoading,
    isError,
    error,
  } = useQuery<Page<StudentSummary>, Error>({
    queryKey: ["students", debouncedSearchTerm, statusFilter, page],
    queryFn: () =>
      getStudents({
        page,
        query: debouncedSearchTerm,
        status: statusFilter,
      }),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
    onError: (err: any) => {
      alert("Erro ao deletar estudante: " + err.message);
    },
  });

  const handleDeleteStudent = (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja deletar o estudante ${name}?`)) {
      deleteMutation.mutate(id);
    }
  };

  const openCreateModal = () => setIsCreateModalOpen(true);
  const closeCreateModal = () => setIsCreateModalOpen(false);

  return {
    students: pageData?.content,
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
    handleDeleteStudent,
    deleteMutation,
  };
}
