import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getAtendimentosPaginated } from "../services/atendimentoService";
import type { GetAtendimentosParams } from "../types/atendimento";

export function useAtendimentosPage() {
  const [page, setPage] = useState(0);
  // No futuro, você adicionaria os estados de filtro aqui
  // const [filters, setFilters] = useState({});

  const queryParams: GetAtendimentosParams = {
    page,
    size: 10,
    sort: "sessionDate,desc",
  };

  const {
    data: pageData,
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["atendimentos", queryParams],
    queryFn: () => getAtendimentosPaginated(queryParams),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
  });

  return {
    pageData,
    isLoading,
    isError,
    error,
    isFetching,
    page,
    setPage,
  };
}
