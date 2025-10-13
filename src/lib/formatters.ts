export const formatPhone = (value: string): string => {
  const cleaned = value.replace(/\D/g, "");

  const truncated = cleaned.slice(0, 11);

  let formatted = truncated.replace(/^(\d{2})/, "($1)");
  formatted = formatted.replace(/^\((\d{2})\)(\d{5})/, "($1) $2-");
  formatted = formatted.replace(/^\((\d{2})\)(\d{4})/, "($1) $2-");

  return formatted;
};

export function formatGender(genderKey: string | undefined): string {
  if (!genderKey) {
    return "Não informado";
  }

  const genderMap: Record<string, string> = {
    homem_cis: "Homem Cisgênero",
    mulher_cis: "Mulher Cisgênero",
    homem_trans: "Homem Transgênero",
    mulher_trans: "Mulher Transgênero",
    nao_binario: "Não-Binário",
    outro: "Outro",
    prefiro_nao_dizer: "Prefiro não dizer",
  };

  return genderMap[genderKey.toLowerCase()] || genderKey;
}
