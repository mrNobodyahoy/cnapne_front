// src/components/professional/ProfessionalSelect.tsx
import Select from 'react-select';
import { Controller } from 'react-hook-form';
import type { Control } from 'react-hook-form';
import { useState, useMemo } from 'react';

type Option = { value: string; label: string; };

interface ProfessionalSelectProps {
    control: Control<any>;
    error?: string;
    isLoading: boolean;
    searchedOptions: Option[] | undefined;
    onSearchChange: (value: string) => void;
}

export default function ProfessionalSelect({
    control,
    error,
    isLoading,
    searchedOptions,
    onSearchChange
}: ProfessionalSelectProps) {

    const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);

    const allOptions = useMemo(() => {
        const optionsMap = new Map<string, Option>();
        selectedOptions.forEach(option => optionsMap.set(option.value, option));
        searchedOptions?.forEach(option => optionsMap.set(option.value, option));
        return Array.from(optionsMap.values());
    }, [selectedOptions, searchedOptions]);

    return (
        <div className="md:col-span-2 space-y-1">
            <label className="block text-sm font-medium text-gray-700">
                Profissionais Envolvidos
            </label>
            <Controller
                name="professionalIds"
                control={control}
                render={({ field }) => (
                    <Select
                        value={selectedOptions}
                        isMulti
                        placeholder="Digite para buscar um profissional..."
                        isLoading={isLoading}
                        options={allOptions}
                        onInputChange={onSearchChange}
                        noOptionsMessage={({ inputValue }) =>
                            !inputValue ? 'Digite para buscar...' : 'Nenhum profissional encontrado'
                        }
                        onChange={(currentSelection) => {
                            const newSelectedOptions = currentSelection as Option[];
                            setSelectedOptions(newSelectedOptions);
                            field.onChange(newSelectedOptions.map(option => option.value));
                        }}
                    />
                )}
            />
            {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
        </div>
    );
}