export const SessionStatus = {
  AGENDADO: "AGENDADO",
  REALIZADO: "REALIZADO",
  CANCELADO: "CANCELADO",
  NAO_COMPARECEU: "NAO_COMPARECEU",
} as const;

export type SessionStatusType =
  (typeof SessionStatus)[keyof typeof SessionStatus];

export const formatPhone = (value: string): string => {
  if (!value) return "";
  const cleaned = value.replace(/\D/g, "");
  const truncated = cleaned.slice(0, 11);

  let formatted = truncated.replace(/^(\d{2})/, "($1)");
  formatted = formatted.replace(/^\((\d{2})\)(\d{5})/, "($1) $2-");
  formatted = formatted.replace(/^\((\d{2})\)(\d{4})/, "($1) $2-");

  return formatted;
};

export function formatGender(genderKey: string | undefined): string {
  if (!genderKey) return "Não informado";

  const genderMap: Record<string, string> = {
    homem_cis: "Homem Cisgênero",
    mulher_cis: "Mulher Cisgênero",
    homem_trans: "Homem Transgênero",
    mulher_trans: "Mulher Transgênero",
    nao_binario: "Não-Binário",
    outro: "Outro",
    prefiro_nao_dizer: "Prefiro não dizer",
    nao_informar: "Prefiro não informar",
  };

  return genderMap[genderKey.toLowerCase()] || genderKey;
}

export const getStatusColor = (status: string): string => {
  switch (status) {
    case SessionStatus.AGENDADO:
      return "bg-blue-100 text-blue-800";
    case SessionStatus.REALIZADO:
      return "bg-green-100 text-green-800";
    case SessionStatus.CANCELADO:
      return "bg-red-100 text-red-800";
    case SessionStatus.NAO_COMPARECEU:
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const genderOptions = [
  { value: "mulher_cis", label: "Mulher Cisgênera" },
  { value: "homem_cis", label: "Homem Cisgênero" },
  { value: "mulher_trans", label: "Mulher Transgênero" },
  { value: "homem_trans", label: "Homem Transgênero" },
  { value: "nao_binario", label: "Pessoa Não Binária" },
  { value: "nao_informar", label: "Prefiro Não Informar" },
];

export const ethnicityOptions = [
  { value: "branca", label: "Branca" },
  { value: "parda", label: "Parda" },
  { value: "preta", label: "Preta" },
  { value: "amarela", label: "Amarela" },
  { value: "indigena", label: "Indígena" },
  { value: "nao_informar", label: "Prefiro Não Informar" },
];

export const statusOptions = [
  { value: "", label: "Todos os Status" },
  { value: SessionStatus.AGENDADO, label: "Agendado" },
  { value: SessionStatus.REALIZADO, label: "Realizado" },
  { value: SessionStatus.NAO_COMPARECEU, label: "Não Compareceu" },
  { value: SessionStatus.CANCELADO, label: "Cancelado" },
];
