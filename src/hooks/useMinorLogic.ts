import { useState, useEffect } from 'react';
// 1. IMPORTAÇÃO ATUALIZADA: Trocamos 'useFieldArray' por 'UseFieldArrayReturn'
import type { FieldValues, UseFormWatch, UseFieldArrayReturn } from 'react-hook-form';
import { calculateAge } from '../lib/utils';

// 2. TIPO DE PARÂMETROS ATUALIZADO
type UseMinorLogicParams<TFieldValues extends FieldValues> = {
    watch: UseFormWatch<TFieldValues>;
    // Agora o fieldArray também usa o tipo genérico TFieldValues
    fieldArray: Pick<UseFieldArrayReturn<TFieldValues>, 'fields' | 'append' | 'replace'>;
};

export function useMinorLogic<TFieldValues extends FieldValues>({
    watch,
    fieldArray,
}: UseMinorLogicParams<TFieldValues>) {
    const [isMinor, setIsMinor] = useState(false);
    const { fields, append, replace } = fieldArray;

    const birthDate = watch('birthDate' as any);

    useEffect(() => {
        if (!birthDate) {
            setIsMinor(false);
            return;
        }
        const age = calculateAge(birthDate);
        const isNowMinor = age < 18;
        setIsMinor(isNowMinor);

        if (isNowMinor && fields.length === 0) {
            append({ completeName: '', email: '', phone: '', kinship: '' } as any);
        } else if (!isNowMinor) {
            replace([]);
        }
    }, [birthDate, fields.length, append, replace]);

    return { isMinor };
}