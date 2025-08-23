import type { ButtonHTMLAttributes } from "react";

// Defina o tipo 'ButtonVariants' primeiro, separadamente
type ButtonVariants = 'primary' | 'secondary' | 'danger' | 'outline' | 'info';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  // Use o tipo definido para a propriedade 'variant'
  variant?: ButtonVariants;
};

export default function Button({
  loading,
  children,
  className = "",
  variant = 'primary', 
  ...rest
}: Props) {
  const baseStyles = `
    inline-flex items-center justify-center rounded-lg px-4 py-2
    font-semibold shadow-sm transition-all duration-150
    hover:opacity-90 hover:shadow-md focus:outline-none focus:ring-2
    focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed
  `;

  const variantStyles = {
    primary: 'bg-ifpr-green text-white focus:ring-ifpr-red',
    secondary: 'bg-gray-300 hover:bg-gray-400 text-gray-800 focus:ring-gray-500',
    danger: 'bg-red-500 text-white focus:ring-red-500',
    outline: 'border-2 border-ifpr-green text-ifpr-green hover:bg-ifpr-green hover:text-white focus:ring-ifpr-green',
    info: 'bg-blue-500 text-white focus:ring-blue-500'
  };

  return (
    <button
      disabled={loading || rest.disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...rest}
    >
      {loading ? "Aguarde..." : children}
    </button>
  );
}