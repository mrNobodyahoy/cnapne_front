import type { FieldErrors, UseFormRegister, Control, FieldValues, Path } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { genderOptions, ethnicityOptions, formatPhone } from '../../lib/constants';
import Input from '../ui/Input';
import Select from '../ui/Select';
import ToggleSwitch from "../ui/ToggleSwitch";

// Definimos o tipo genérico para aceitar qualquer formulário
type Props<TFieldValues extends FieldValues> = {
    register: UseFormRegister<TFieldValues>;
    errors: FieldErrors<TFieldValues>;
    control: Control<TFieldValues>;
    variant: 'create' | 'edit';
};

export default function StudentFields<TFieldValues extends FieldValues>({
    register,
    errors,
    control,
    variant
}: Props<TFieldValues>) {

    // Proteção contra uso incorreto do componente
    if (!register || !control) {
        console.error("StudentFields: 'register' ou 'control' não foram fornecidos! Verifique o componente pai.");
        return (
            <div className="p-4 rounded bg-red-50 border border-red-200 text-red-600">
                <p className="font-bold">Erro interno de desenvolvimento</p>
                <p className="text-sm">O formulário não foi inicializado corretamente. (Props faltando em StudentFields)</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
            <Input
                label="Nome Completo"
                id="completeName"
                {...register("completeName" as Path<TFieldValues>)}
                error={errors.completeName?.message as string}
            />

            <Input
                label="E-mail"
                id="email"
                type="email"
                {...register("email" as Path<TFieldValues>)}
                error={errors.email?.message as string}
            />

            {variant === 'create' && (
                <Input
                    label="Senha"
                    id="password"
                    type="password"
                    {...register("password" as Path<TFieldValues>)}
                    error={errors.password?.message as string}
                />
            )}

            <Input
                label="Matrícula"
                id="registration"
                {...register("registration" as Path<TFieldValues>)}
                maxLength={11}
                error={errors.registration?.message as string}
            />

            <Input
                label="Turma"
                id="team"
                {...register("team" as Path<TFieldValues>)}
                error={errors.team?.message as string}
            />

            <Input
                label="Data de Nascimento"
                id="birthDate"
                type="date"
                {...register("birthDate" as Path<TFieldValues>)}
                error={errors.birthDate?.message as string}
            />

            <Controller
                name={"phone" as Path<TFieldValues>}
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
                {...register("gender" as Path<TFieldValues>)}
                error={errors.gender?.message as string}
            />

            <Select
                label="Etnia/Raça"
                id="ethnicity"
                options={ethnicityOptions}
                {...register("ethnicity" as Path<TFieldValues>)}
                error={errors.ethnicity?.message as string}
            />

            {variant === 'edit' && (
                <div className="space-y-1">
                    <label htmlFor="status" className="text-sm font-medium block">Status do Aluno</label>
                    <Controller
                        name={"status" as Path<TFieldValues>}
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