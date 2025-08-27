import type { FieldErrors, UseFormRegister, Control } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import type { CreateFormData } from './StudentForm';
import { formatPhone } from '../../lib/formatters'; // <<< MUDANÇA

import Input from '../ui/Input';
import Select from '../ui/Select'; // <<< MUDANÇA

type Props = {
  register: UseFormRegister<CreateFormData>;
  errors: FieldErrors<CreateFormData>;
  control: Control<CreateFormData>;
};

// Opções para os campos de seleção
const genderOptions = [
  { value: 'FEMININO', label: 'Feminino' },
  { value: 'MASCULINO', label: 'Masculino' },
  { value: 'OUTRO', label: 'Outro' },
  { value: 'NAO_INFORMAR', label: 'Prefiro não informar' },
];

const ethnicityOptions = [
  { value: 'BRANCA', label: 'Branca' },
  { value: 'PARDA', label: 'Parda' },
  { value: 'PRETA', label: 'Preta' },
  { value: 'AMARELA', label: 'Amarela' },
  { value: 'INDIGENA', label: 'Indígena' },
];


export default function StudentFormFields({ register, errors, control }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
      <Input
        label="Nome Completo"
        id="completeName"
        placeholder="Digite o nome completo"
        {...register("completeName")}
        error={errors.completeName?.message}
      />

      <Input
        label="E-mail"
        id="email"
        type="email"
        placeholder="exemplo@email.com"
        {...register("email")}
        error={errors.email?.message}
      />

      <Input
        label="Senha"
        id="password"
        type="password"
        placeholder="Digite uma senha"
        {...register("password")}
        error={errors.password?.message}
      />

      <Input
        label="Matrícula"
        id="registration"
        placeholder="Digite a matrícula"
        {...register("registration")}
        error={errors.registration?.message}
      />

      <Input
        label="Turma"
        id="team"
        placeholder="Digite a turma"
        {...register("team")}
        error={errors.team?.message}
      />

      <Input
        label="Data de Nascimento"
        id="birthDate"
        type="date"
        {...register("birthDate")}
        error={errors.birthDate?.message}
      />

      <Controller
        name="phone"
        control={control}
        render={({ field }) => (
          <Input
            label="Telefone"
            id="phone"
            type="tel"
            placeholder="(99) 99999-9999"
            value={field.value || ""}
            onChange={(e) => field.onChange(formatPhone(e.target.value))}
            error={errors.phone?.message}
          />
        )}
      />

      {/* <<< MUDANÇA: Input de texto trocado por Select */}
      <Select
        label="Gênero"
        id="gender"
        placeholder="Selecione o gênero"
        options={genderOptions}
        {...register("gender")}
        error={errors.gender?.message}
      />
      
      {/* <<< MUDANÇA: Input de texto trocado por Select */}
      <Select
        label="Etnia/Raça"
        id="ethnicity"
        placeholder="Selecione a etnia/raça"
        options={ethnicityOptions}
        {...register("ethnicity")}
        error={errors.ethnicity?.message}
      />
    </div>
  );
}