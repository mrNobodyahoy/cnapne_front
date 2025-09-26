import { forwardRef, type TextareaHTMLAttributes } from 'react';

// Define as props que o componente vai aceitar
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    id: string;
    label: string;
    error?: string; // Mensagem de erro opcional
}

// Usamos forwardRef para que o react-hook-form consiga se conectar ao <textarea>
const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ id, label, error, className = '', ...rest }, ref) => {

        // Estilos base para o textarea
        const baseStyles = "block w-full rounded-md border-gray-300 shadow-sm focus:border-ifpr-green focus:ring-ifpr-green sm:text-sm";

        // Estilos condicionais para quando houver erro
        const errorStyles = "border-red-500 focus:border-red-500 focus:ring-red-500";

        return (
            <div className={className}>
                <label htmlFor={id} className="block text-sm font-medium text-gray-700">
                    {label}
                </label>
                <div className="mt-1">
                    <textarea
                        id={id}
                        ref={ref} // Conecta a ref do react-hook-form
                        className={`${baseStyles} ${error ? errorStyles : ''}`}
                        rows={4} // Altura padrão, pode ser sobrescrita via props
                        {...rest} // Passa todas as outras props (como name, onChange, etc.)
                    />
                </div>
                {error && (
                    <p className="mt-2 text-sm text-red-600" id={`${id}-error`}>
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

export default Textarea;