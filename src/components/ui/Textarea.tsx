import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '../../lib/utils'; // 1. Importe a função 'cn'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    id: string;
    label: string;
    error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ id, label, error, className = '', ...rest }, ref) => {

        return (
            <div className={className}>
                <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
                <div className="mt-1">
                    <textarea
                        id={id}
                        ref={ref}
                        rows={4}
                        className={cn(
                            "block w-full rounded-md border-gray-300 shadow-sm focus:border-ifpr-green focus:ring-ifpr-green sm:text-sm", // Estilos base
                            error && "border-red-500 focus:border-red-500 focus:ring-red-500" // Estilos de erro condicionais
                        )}
                        {...rest}
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