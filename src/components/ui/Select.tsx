// src/components/ui/Select.tsx
import { forwardRef, type ComponentProps } from 'react';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';

type Option = {
  value: string;
  label: string;
};

type SelectProps = ComponentProps<'select'> & {
  label: string;
  id: string;
  error?: string;
  options: Option[];
  placeholder?: string;
  hidePlaceholderOnValue?: boolean;
};

// A única mudança real é na lógica de 'showPlaceholder' e na classe 'text-gray-500'
const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, id, error, options, placeholder, hidePlaceholderOnValue = false, className, ...props }, ref) => {
    const errorId = `error-${id}`;
    
    // Usamos 'props.value' para verificar o valor atual passado pelo react-hook-form
    const showPlaceholder = placeholder && (!hidePlaceholderOnValue || !props.value);

    return (
      <div className="flex flex-col">
        <label htmlFor={id} className="mb-1 text-sm font-medium text-gray-700">
          {label}
        </label>
        
        <div className="relative">
          <select
            id={id}
            ref={ref}
            className={clsx(
              // A classe de texto cinza também usa 'props.value'
              !props.value ? 'text-gray-500' : 'text-gray-800', 
              'w-full appearance-none rounded-md border bg-white px-3 py-2 shadow-sm transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-ifpr-green',
              'pr-10', 
              error ? 'border-red-500' : 'border-gray-300',
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            {...props} // Aqui, todas as props do 'register' (incluindo value, onChange, etc.) são passadas
          >
            {showPlaceholder && <option value="">{placeholder}</option>}
            
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
            <ChevronDown className="h-5 w-5 text-gray-400" />
          </div>
        </div>

        {error && (
          <p id={errorId} className="mt-1 text-xs text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;