// src/components/professional/ProfessionalEditFormFields.tsx
import type { FieldErrors, UseFormRegister, Control } from 'react-hook-form';
import Input from '../ui/Input';
import type { UpdateFormData } from './ProfessionalEditForm';

type Props = {
  register: UseFormRegister<UpdateFormData>;
  errors: FieldErrors<UpdateFormData>;
  control: Control<UpdateFormData>;
};
    
export default function ProfessionalEditFormFields({  register,  errors}: Props) {
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
        label="Especialidade"
        type="text"
        placeholder="Digite a especialidade"
        id="specialty"
        {...register("specialty")}
        error={errors.specialty?.message}
      />

      <Input
        label="Função"
        type="text"
        placeholder="Digite a função"
        id="role"
        {...register("role")}
        error={errors.role?.message}
      />

      <div className="flex items-center gap-2 col-span-2">
        <input
          type="checkbox"
          id="active"
          {...register("active")}
          className="h-4 w-4 text-ifpr-green border-gray-300 rounded"
        />
        <label htmlFor="active" className="text-sm text-gray-700">
          Ativo
        </label>
        {errors.active && (
          <p className="text-red-500 text-xs">{errors.active.message}</p>
        )}
      </div>
    </div>
  );
}
