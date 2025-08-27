import { forwardRef, type ComponentProps } from 'react';

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
};

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, id, error, options, placeholder, ...props }, ref) => {
    return (
      <div className="flex flex-col">
        <label htmlFor={id} className="mb-1 text-sm font-medium text-gray-700">
          {label}
        </label>
        <select
          id={id}
          ref={ref}
          className={`w-full px-3 py-2 text-gray-800 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ifpr-green focus:border-transparent transition ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;