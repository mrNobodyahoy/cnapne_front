// src/components/professional/ProfessionalOptions.ts

export const roleOptions = [
    { value: 'COORDENACAO_CNAPNE', label: 'Coordenação CNAPNE' },
    { value: 'EQUIPE_ACOMPANHAMENTO', label: 'Equipe Acompanhamento' },
    // A label pode ser amigável, mas o value deve ser o nome exato do Enum do backend
    { value: 'EQUIPE_AEE', label: 'Equipe Atendimento' },
];

// O mesmo se aplica aqui. Os 'values' devem corresponder ao que está salvo no banco.
// Usar letras minúsculas e sem acentos é uma boa prática para os 'values'.
export const specialtyOptions = [
    { value: 'Psicologia', label: 'Psicologia' },
    { value: 'Pedagogia', label: 'Pedagogia' },
    { value: 'Assistência Social', label: 'Assistência Social' },
    { value: 'Intérprete de Libras', label: 'Intérprete de Libras' },
    { value: 'Coordenação Geral', label: 'Coordenação Geral' },
    { value: 'Professor', label: 'Professor' },
    { value: 'Outros', label: 'Outros' },
];