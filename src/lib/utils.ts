import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const calculateAge = (birthDate: string | Date): number => {
  if (!birthDate) return 0;
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

/**
 * Função utilitária para mesclar classes do Tailwind CSS de forma condicional e inteligente.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
