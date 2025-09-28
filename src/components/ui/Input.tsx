import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  id: string;
};

const Input = forwardRef<HTMLInputElement, Props>(({ label, error, id, className, ...rest }, ref) => {
  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        id={id}
        ref={ref}
        className={cn(
          'w-full rounded-lg border bg-gray-50 p-2.5 text-gray-800 shadow-sm transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-ifpr-green focus:border-ifpr-green',
          error ? 'border-red-500 ring-red-500' : 'border-gray-300',
          className
        )}
        {...rest}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
});

export default Input;