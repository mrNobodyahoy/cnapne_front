// src/components/student/StudentFormFields.tsx
import type { FieldErrors, UseFormRegister, Control } from 'react-hook-form';
import Input from '../ui/Input';
import type { FormData } from './StudentForm';
import { Controller } from 'react-hook-form';

type Props = {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  control: Control<FormData>;
};

// Função para aplicar máscara de telefone usando regex
const formatPhone = (value: string) => {
  // Remove tudo que não for número
  let cleaned = value.replace(/\D/g, "");

  // Aplica os padrões
  if (cleaned.length > 11) {
    cleaned = cleaned.slice(0, 11);
  }

  if (cleaned.length <= 2) {
    return `(${cleaned}`;
  }
  if (cleaned.length <= 7) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
  }
  return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
};

export default function StudentFormFields({ register, errors, control }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
      <Input
        label="Nome Completo"
        type="text"
        placeholder="Digite o nome completo"
        id="completeName"
        {...register("completeName")}
        error={errors.completeName?.message}
      />

      <Input
        label="E-mail"
        type="email"
        placeholder="exemplo@email.com"
        id="email"
        {...register("email")}
        error={errors.email?.message}
      />

      <Input
        label="Senha"
        type="password"
        placeholder="Digite uma senha"
        id="password"
        {...register("password")}
        error={errors.password?.message}
      />

      <Input
        label="Matrícula"
        type="text"
        placeholder="Digite a matrícula"
        id="registration"
        {...register("registration")}
        error={errors.registration?.message}
      />

      <Input
        label="Turma"
        type="text"
        placeholder="Digite a turma"
        id="team"
        {...register("team")}
        error={errors.team?.message}
      />

      <Input
        label="Data de Nascimento"
        type="date"
        id="birthDate"
        {...register("birthDate")}
        error={errors.birthDate?.message}
      />

      {/* Campo Telefone com regex */}
      <Controller
        name="phone"
        control={control}
        render={({ field }) => (
          <Input
            label="Telefone"
            type="tel"
            placeholder="(99) 99999-9999"
            id="phone"
            value={field.value || ""}
            onChange={(e) => field.onChange(formatPhone(e.target.value))}
            error={errors.phone?.message}
          />
        )}
      />

      <Input
        label="Gênero"
        type="text"
        placeholder="Informe o gênero"
        id="gender"
        {...register("gender")}
        error={errors.gender?.message}
      />

      <Input
        label="Etnia"
        type="text"
        placeholder="Informe a etnia"
        id="ethnicity"
        {...register("ethnicity")}
        error={errors.ethnicity?.message}
      />
    </div>
  );
}
