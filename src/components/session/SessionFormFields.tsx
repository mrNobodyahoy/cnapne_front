// src/components/session/SessionFormFields.tsx
import {
    type Control,
    type FieldErrors,
    type FieldValues,
    type UseFormRegister,
} from 'react-hook-form';
import Input from '../ui/Input';
import ProfessionalSelect from '../professional/ProfessionalSelect';

type Option = { value: string; label: string };

interface SessionFormFieldsProps<TFieldValues extends FieldValues> {
    register: UseFormRegister<TFieldValues>;
    errors: FieldErrors<TFieldValues>;
    control: Control<TFieldValues>;
    professionalSearchIsLoading: boolean;
    searchedOptions: Option[] | undefined;
    onProfessionalSearchChange: (value: string) => void;
}

export default function SessionFormFields<TFieldValues extends FieldValues>({
    register,
    errors,
    control,
    professionalSearchIsLoading,
    searchedOptions,
    onProfessionalSearchChange,
}: SessionFormFieldsProps<TFieldValues>) {
    return (
        <>
            <fieldset className="space-y-4 rounded-lg border border-gray-200 p-4 pt-6 relative">
                <legend className="absolute -top-3 left-3 bg-white px-2 text-base font-semibold text-ifpr-green">
                    Agendamento
                </legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        id="sessionDate"
                        label="Data"
                        type="date"
                        {...register('sessionDate' as any)}
                        error={errors.sessionDate?.message as string}
                    />
                    <Input
                        id="sessionTime"
                        label="Horário"
                        type="time"
                        {...register('sessionTime' as any)}
                        error={errors.sessionTime?.message as string}
                    />
                    <Input
                        id="sessionLocation"
                        label="Local"
                        {...register('sessionLocation' as any)}
                        error={errors.sessionLocation?.message as string}
                        className="md:col-span-2"
                    />
                </div>
            </fieldset>

            <fieldset className="space-y-4 rounded-lg border border-gray-200 p-4 pt-6 relative">
                <legend className="absolute -top-3 left-3 bg-white px-2 text-base font-semibold text-ifpr-green">
                    Equipe
                </legend>

                <ProfessionalSelect
                    control={control}
                    error={errors.professionalIds?.message as string}
                    isLoading={professionalSearchIsLoading}
                    searchedOptions={searchedOptions}
                    onSearchChange={onProfessionalSearchChange}
                />
            </fieldset>
        </>
    );
}