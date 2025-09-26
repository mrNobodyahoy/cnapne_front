import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getAcompanhamentosPaginated } from "../services/followUpService";
import type { GetAcompanhamentosParams } from "../types/followUp";

export function useFollowUpPage() {
  const [page, setPage] = useState(0);
  // const [filters, setFilters] = useState({});

  const queryParams: GetAcompanhamentosParams = {
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
    queryKey: ["acompanhamentos", queryParams],
    queryFn: () => getAcompanhamentosPaginated(queryParams),
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
