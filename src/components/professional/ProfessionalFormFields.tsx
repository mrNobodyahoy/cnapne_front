import type { FieldErrors, UseFormRegister, Control } from 'react-hook-form';
import Input from '../ui/Input';
import Select from '../ui/Select';
import type { CreateFormData } from './ProfessionalForm';

type Props = {
  register: UseFormRegister<CreateFormData>;
  errors: FieldErrors<CreateFormData>;
  control: Control<CreateFormData>;
};

const specialtyOptions = [
  { value: 'pedagogia', label: 'Pedagogia' },
  { value: 'psicologia', label: 'Psicologia' },
  { value: 'assistencia-social', label: 'Assistência Social' },
  { value: 'outros', label: 'Outros' },
];

const roleOptions = [
  { value: 'COORDENACAO_CNAPNE', label: 'Coordenação CNAPNE' },
  { value: 'EQUIPE_ACOMPANHAMENTO', label: 'Equipe Acompanhamento' },
  { value: 'EQUIPE_AEE', label: 'Equipe Atendimento' },
];

export default function ProfessionalFormFields({ register, errors }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
      <Input
        label="Nome Completo"
        type="text"
        placeholder="Digite o nome completo"
        id="fullName"
        {...register("fullName")}
        error={errors.fullName?.message}
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

      <Select
        label="Especialidade"
        id="specialty"
        {...register("specialty")}
        error={errors.specialty?.message}
        options={specialtyOptions}
        placeholder="Selecione a especialidade"
      />

      <Select
        label="Função"
        id="role"
        {...register("role")}
        error={errors.role?.message}
        options={roleOptions}
        placeholder="Selecione a função"
      />
    </div>
  );
}
