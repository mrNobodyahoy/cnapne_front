import { useQuery } from "@tanstack/react-query";
import { getMyProfile } from "../../services/professionalService";
import { useAuth } from "../../store/auth";

export function useUserProfile() {
  const { session } = useAuth();

  return useQuery({
    queryKey: ["userProfile"],
    queryFn: getMyProfile,
    enabled: !!session,
    staleTime: 1000 * 60 * 60,
  });
}
