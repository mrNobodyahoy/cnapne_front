// src/components/professional/ProfessionalFormFields.tsx

import type { FieldErrors, UseFormRegister, Control, FieldValues } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import Input from '../ui/Input';
import Select from '../ui/Select';
import ToggleSwitch from '../ui/ToggleSwitch';
import { specialtyOptions, roleOptions } from './ProfessionalOptions';

type Props<TFieldValues extends FieldValues> = {
  register: UseFormRegister<TFieldValues>;
  errors: FieldErrors<TFieldValues>;
  control: Control<TFieldValues>;
  variant: 'create' | 'edit';
};

export default function ProfessionalFormFields<TFieldValues extends FieldValues>({
  register,
  errors,
  control,
  variant,
}: Props<TFieldValues>) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
      <Input
        label="Nome Completo"
        type="text"
        id="fullName"
        {...register("fullName" as any)}
        error={errors.fullName?.message as string}
      />
      <Input
        label="E-mail"
        type="email"
        id="email"
        {...register("email" as any)}
        error={errors.email?.message as string}
      />
      {variant === 'create' && (
        <Input
          label="Senha"
          type="password"
          id="password"
          {...register("password" as any)}
          error={errors.password?.message as string}
        />
      )}
      <Controller
        name={"specialty" as any}
        control={control}
        render={({ field }) => (
          <Select
            label="Especialidade"
            id="specialty"
            options={specialtyOptions}
            error={errors.specialty?.message as string}
            value={field.value}
            onChange={field.onChange}
            placeholder="Selecione uma especialidade..."
          />
        )}
      />
      <Controller
        name={"role" as any}
        control={control}
        render={({ field }) => (
          <Select
            label="Função"
            id="role"
            options={roleOptions}
            error={errors.role?.message as string}
            value={field.value}
            onChange={field.onChange}
            placeholder="Selecione uma função..."
          />
        )}
      />
      {variant === 'edit' && (
        <div className="flex flex-col md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Status do Profissional
          </label>
          <Controller
            name={"active" as any}
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
            <p className="text-red-500 text-xs mt-1">{errors.active.message as string}</p>
          )}
        </div>
      )}
    </div>
  );
}