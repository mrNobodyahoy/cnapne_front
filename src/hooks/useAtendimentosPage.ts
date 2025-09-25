import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getAtendimentosPaginated } from "../services/atendimentoService";
import type { GetAtendimentosParams } from "../types/atendimento";

export function useAtendimentosPage() {
  const [page, setPage] = useState(0);
  // No futuro, você adicionaria os estados de filtro aqui
  // const [filters, setFilters] = useState({});

  // Monta os parâmetros para a chamada da API
  const queryParams: GetAtendimentosParams = {
    page,
    size: 10,
    sort: "sessionDate,desc", // Ordena pela data da sessão, mais recentes primeiro
    // ...filters
  };

  const {
    data: pageData,
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["atendimentos", queryParams], // A queryKey inclui os parâmetros para re-fetching automático
    queryFn: () => getAtendimentosPaginated(queryParams),
    placeholderData: keepPreviousData, // Mantém os dados antigos visíveis enquanto carrega os novos
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
