import type { FieldErrors, UseFormRegister, Control, FieldValues } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { genderOptions, ethnicityOptions } from '../../lib/constants';
import { formatPhone } from '../../lib/formatters';
import Input from '../ui/Input';
import Select from '../ui/Select';
import ToggleSwitch from "../ui/ToggleSwitch";

type Props<TFieldValues extends FieldValues> = {
    register: UseFormRegister<TFieldValues>;
    errors: FieldErrors<TFieldValues>;
    control: Control<TFieldValues>;
    variant: 'create' | 'edit';
};

// Componente de campos unificado e genérico
export default function StudentFields<TFieldValues extends FieldValues>({
    register,
    errors,
    control,
    variant
}: Props<TFieldValues>) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
            <Input
                label="Nome Completo"
                id="completeName"
                {...register("completeName" as any)}
                error={errors.completeName?.message as string}
            />

            <Input
                label="E-mail"
                id="email"
                type="email"
                {...register("email" as any)}
                error={errors.email?.message as string}
            />

            {/* --- Campo Condicional: Senha (apenas na criação) --- */}
            {variant === 'create' && (
                <Input
                    label="Senha"
                    id="password"
                    type="password"
                    {...register("password" as any)}
                    error={errors.password?.message as string}
                />
            )}

            <Input
                label="Matrícula"
                id="registration"
                {...register("registration" as any)}
                maxLength={11}
                error={errors.registration?.message as string}
            />

            <Input
                label="Turma"
                id="team"
                {...register("team" as any)}
                error={errors.team?.message as string}
            />

            <Input
                label="Data de Nascimento"
                id="birthDate"
                type="date"
                {...register("birthDate" as any)}
                error={errors.birthDate?.message as string}
            />

            <Controller
                name={"phone" as any}
                control={control}
                render={({ field }) => (
                    <Input
                        label="Telefone"
                        id="phone"
                        type="tel"
                        value={field.value || ""}
                        onChange={(e) => field.onChange(formatPhone(e.target.value))}
                        error={errors.phone?.message as string}
                    />
                )}
            />

            <Select
                label="Gênero"
                id="gender"
                options={genderOptions}
                {...register("gender" as any)}
                error={errors.gender?.message as string}
            />

            <Select
                label="Etnia/Raça"
                id="ethnicity"
                options={ethnicityOptions}
                {...register("ethnicity" as any)}
                error={errors.ethnicity?.message as string}
            />

            {/* --- Campo Condicional: Status (apenas na edição) --- */}
            {variant === 'edit' && (
                <div className="space-y-1">
                    <label htmlFor="status" className="text-sm font-medium">Status do Aluno</label>
                    <Controller
                        name={"status" as any}
                        control={control}
                        render={({ field }) => (
                            <ToggleSwitch
                                id="status"
                                checked={field.value === "ATIVO"}
                                onChange={(checked) => field.onChange(checked ? "ATIVO" : "INATIVO")}
                                enabledText="ATIVO"
                                disabledText="INATIVO"
                            />
                        )}
                    />
                </div>
            )}
        </div>
    );
}