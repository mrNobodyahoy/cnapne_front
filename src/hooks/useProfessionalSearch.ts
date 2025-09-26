import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProfessionalsPaginated } from "../services/professionalService";
import { useDebounce } from "./useDebounce";

/**
 * Hook para buscar profissionais de forma dinâmica (para selects pesquisáveis).
 * Ele usa a função paginada para buscar apenas os primeiros 10 resultados
 * que correspondem ao termo de busca.
 */
export function useProfessionalSearch() {
  const [searchTerm, setSearchTerm] = useState("");

  // Aplica debounce para não fazer uma busca a cada tecla
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data: pageData, isLoading } = useQuery({
    // A chave da query inclui o termo de busca
    queryKey: ["professionals", "search", debouncedSearchTerm],

    // A função de busca
    queryFn: () =>
      getProfessionalsPaginated({
        query: debouncedSearchTerm,
        page: 0,
        size: 10, // Pega apenas os 10 primeiros resultados
      }),

    // IMPORTANTE: Só executa a busca se o usuário tiver digitado algo
    enabled: debouncedSearchTerm.length > 0,

    staleTime: 1000 * 60 * 5, // 5 minutos de cache
  });

  return {
    searchTerm,
    setSearchTerm,
    searchedProfessionals: pageData?.content,
    isLoading,
  };
}
