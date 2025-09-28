import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getAtendimentosPaginated } from "../services/atendimentoService";
import type { GetAtendimentosParams } from "../types/atendimento";

interface Filters {
  studentName?: string;
  status?: string;
}

export function useAtendimentosPage(filters: Filters) {
  const [page, setPage] = useState(0);
  const { studentName, status } = filters;

  const queryParams: GetAtendimentosParams = {
    page,
    size: 10,
    sort: "sessionDate,desc",
    studentName: studentName || undefined,
    status: status || undefined,
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
