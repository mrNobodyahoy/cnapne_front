import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getProfessionalsPaginated } from "../../services/professionalService";
import { useDebounce } from "../util/useDebounce";

export function useProfessionalSearch() {
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data: pageData, isLoading } = useQuery({
    queryKey: ["professionals", "search", debouncedSearchTerm],

    queryFn: () =>
      getProfessionalsPaginated({
        query: debouncedSearchTerm,
        page: 0,
        size: 10,
      }),

    enabled: debouncedSearchTerm.length > 0,

    staleTime: 1000 * 60 * 5,
  });

  return {
    searchTerm,
    setSearchTerm,
    searchedProfessionals: pageData?.content,
    isLoading,
  };
}
