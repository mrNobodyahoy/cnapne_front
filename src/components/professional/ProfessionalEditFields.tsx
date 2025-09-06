import type { FieldErrors, UseFormRegister, Control } from 'react-hook-form';
import Input from '../ui/Input';
import Select from '../ui/Select';
import type { UpdateFormData } from './ProfessionalEditForm';
import { Controller } from 'react-hook-form'; 
import ToggleSwitch from '../ui/ToggleSwitch'; 

type Props = {
  register: UseFormRegister<UpdateFormData>;
  errors: FieldErrors<UpdateFormData>;
  control: Control<UpdateFormData>;
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

export default function ProfessionalEditFormFields({ register, errors, control }: Props) {
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
      <div className="flex flex-col col-span-2">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Status do Profissional
        </label>
        <Controller
          name="active"
          control={control}
          render={({ field }) => (
            <ToggleSwitch
              id="active"
              checked={field.value}
              onChange={field.onChange}
            />
          )}
        />
        {errors.active && (
          <p className="text-red-500 text-xs mt-1">{errors.active.message}</p>
        )}
      </div>
    </div>
  );
}
