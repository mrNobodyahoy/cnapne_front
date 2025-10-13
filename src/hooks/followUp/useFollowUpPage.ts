import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getAcompanhamentosPaginated } from "../../services/followUpService";
import type { GetAcompanhamentosParams } from "../../types/followUp";
import { useAuth } from "../../store/auth";

interface Filters {
  studentName?: string;
  status?: string;
}

export function useFollowUpPage(filters: Filters) {
  const [page, setPage] = useState(0);
  const { studentName, status } = filters;
  const { session } = useAuth();

  const queryParams: GetAcompanhamentosParams = {
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
    queryKey: ["acompanhamentos", queryParams, session?.role],
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
