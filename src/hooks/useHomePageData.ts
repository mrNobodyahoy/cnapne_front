import { useState } from "react";
import { useQueries, keepPreviousData } from "@tanstack/react-query";
import { getAtendimentosPaginated } from "../services/atendimentoService";
import { getAcompanhamentosPaginated } from "../services/followUpService";

export function useHomePageData() {
  const [atendimentosPage, setAtendimentosPage] = useState(0);
  const [acompanhamentosPage, setAcompanhamentosPage] = useState(0);

  const results = useQueries({
    queries: [
      {
        queryKey: ["atendimentos", "dashboard", atendimentosPage],
        queryFn: () =>
          getAtendimentosPaginated({
            page: atendimentosPage,
            size: 5,
            sort: "createdAt,desc",
          }),
        staleTime: 1000 * 60 * 5, // 5 minutos
        // Mantém os dados antigos visíveis enquanto os novos são buscados
        placeholderData: keepPreviousData,
      },
      {
        queryKey: ["acompanhamentos", "dashboard", acompanhamentosPage],
        queryFn: () =>
          getAcompanhamentosPaginated({
            page: acompanhamentosPage,
            size: 5,
            sort: "createdAt,desc",
          }),
        staleTime: 1000 * 60 * 5,
        // Mantém os dados antigos visíveis enquanto os novos são buscados
        placeholderData: keepPreviousData,
      },
    ],
  });

  // `isLoading` é true apenas na primeira busca de cada query
  const isLoading = results.some((query) => query.isLoading);
  const isError = results.some((query) => query.isError);
  // `isFetching` é true em toda busca, incluindo as em segundo plano
  const isFetching = results.some((query) => query.isFetching);

  const atendimentosQuery = results[0];
  const acompanhamentosQuery = results[1];

  return {
    // Dados e controles para Atendimentos
    atendimentos: atendimentosQuery.data?.content,
    totalAtendimentos: atendimentosQuery.data?.totalElements ?? 0,
    atendimentosPageData: atendimentosQuery.data,
    setAtendimentosPage,

    // Dados e controles para Acompanhamentos
    acompanhamentos: acompanhamentosQuery.data?.content,
    totalAcompanhamentos: acompanhamentosQuery.data?.totalElements ?? 0,
    acompanhamentosPageData: acompanhamentosQuery.data,
    setAcompanhamentosPage,

    isLoading,
    isError,
    isFetching,
  };
}
