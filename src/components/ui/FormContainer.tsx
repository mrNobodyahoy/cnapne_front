import type { ReactNode } from 'react';
import Button from './Button';

interface Props {
    title: string;
    onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
    onClose: () => void;
    isLoading: boolean;
    children: ReactNode;
    apiError?: string | null;
}

export default function FormContainer({ title, onSubmit, onClose, isLoading, apiError, children }: Props) {
    return (
        <form
            onSubmit={onSubmit}
            className="space-y-6 bg-white p-6 rounded-2xl shadow-md max-h-[90vh] overflow-y-auto"
        >
            <h2 className="text-2xl font-bold text-ifpr-black">{title}</h2>

            {children}

            {apiError && (
                <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
                    <strong>Erro:</strong> {apiError}
                </div>
            )}

            <div className="flex justify-end gap-4 pt-4 border-t">
                <Button type="button" onClick={onClose} variant="secondary" disabled={isLoading}>
                    Cancelar
                </Button>
                <Button type="submit" loading={isLoading}>
                    Salvar
                </Button>
            </div>
        </form>
    );
}