import { useState } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import {
  deleteProfessional,
  getProfessionalsPaginated,
} from "../services/professionalService";
import type {
  ReadProfessionalDTO,
  Page,
  GetProfessionalsParams,
} from "../types/professional";
import { toast } from "react-hot-toast";
import { useDebounce } from "../hooks/useDebounce";

export function useProfessionalsPage() {
  const queryClient = useQueryClient();

  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(0);

  const debouncedSearchTerm = useDebounce(searchInput, 400);

  const {
    data: pageData,
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery<Page<ReadProfessionalDTO>, Error>({
    queryKey: [
      "professionals",
      debouncedSearchTerm,
      roleFilter,
      statusFilter,
      page,
    ],
    queryFn: () => {
      const params: GetProfessionalsParams = {
        page,
        query: debouncedSearchTerm || undefined,
        role:
          roleFilter === "" || roleFilter === "ALL" ? undefined : roleFilter,
        active:
          statusFilter === "" || statusFilter === "ALL"
            ? undefined
            : statusFilter === "ACTIVE",
      };
      return getProfessionalsPaginated(params);
    },
    placeholderData: keepPreviousData,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProfessional,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["professionals"] });
      toast.success("Profissional deletado com sucesso!");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Erro ao deletar profissional.");
    },
  });

  const handleDeleteProfessional = (id: string, name: string) => {
    if (
      window.confirm(`Tem certeza que deseja deletar o profissional ${name}?`)
    ) {
      deleteMutation.mutate(id);
    }
  };

  const [modalState, setModalState] = useState<{
    mode: "closed" | "create" | "edit";
    data?: ReadProfessionalDTO;
  }>({ mode: "closed" });
  const handleOpenCreateModal = () => setModalState({ mode: "create" });
  const handleOpenEditModal = (professional: ReadProfessionalDTO) =>
    setModalState({ mode: "edit", data: professional });
  const handleCloseModal = () => setModalState({ mode: "closed" });

  return {
    professionals: pageData?.content,
    pageData,
    isLoading,
    isFetching,
    isError,
    error,
    deleteMutation,
    modalState,
    filters: { roleFilter, statusFilter, searchInput },
    page,
    setPage,
    handlers: {
      handleOpenCreateModal,
      handleOpenEditModal,
      handleCloseModal,
      handleDeleteProfessional,
      setRoleFilter,
      setStatusFilter,
      setSearchInput,
    },
  };
}
