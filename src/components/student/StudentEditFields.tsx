import type { FieldErrors, UseFormRegister, Control } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { formatPhone } from '../../lib/formatters'
import type { UpdateFormData } from './StudentEditForm';
import { genderOptions, ethnicityOptions } from '../../lib/constants';

type Props = {
  register: UseFormRegister<UpdateFormData>;
  errors: FieldErrors<UpdateFormData>;
  control: Control<UpdateFormData>;
};


export default function StudentEditFormFields({ register, errors, control }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
      <Input
        label="Nome Completo"
        id="completeName"
        {...register("completeName")}
        error={errors.completeName?.message}
      />

      <Input
        label="E-mail"
        id="email"
        {...register("email")}
        error={errors.email?.message}
      />

      <Input
        label="Matrícula"
        id="registration"
        {...register("registration")}
        maxLength={11}
        error={errors.registration?.message}
      />

      <Input
        label="Turma"
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

      <Controller
        name="phone"
        control={control}
        render={({ field }) => (
          <Input
            label="Telefone"
            type="tel"
            id="phone"
            value={field.value || ""}
            onChange={(e) => field.onChange(formatPhone(e.target.value))}
            error={errors.phone?.message}
          />
        )}
      />

      <Select
        label="Gênero"
        id="gender"
        {...register("gender")}
        options={genderOptions} // Agora esta variável é reconhecida
        placeholder="Selecione um gênero"
        error={errors.gender?.message}
        hidePlaceholderOnValue
      />

      <Select
        label="Etnia"
        id="ethnicity"
        {...register("ethnicity")}
        options={ethnicityOptions} // E esta também
        placeholder="Selecione uma etnia"
        error={errors.ethnicity?.message}
        hidePlaceholderOnValue
      />
    </div>
  );
}