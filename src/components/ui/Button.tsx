import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  variant?: 'primary' | 'secondary';
};

export default function Button({
  loading,
  children,
  className = "",
  variant = 'primary', // Define 'primary' como padrão
  ...rest
}: Props) {
  // Define os estilos base para todos os botões
  const baseStyles = `
    inline-flex items-center justify-center rounded-lg px-4 py-2
    font-semibold shadow-sm transition-all duration-150
    hover:opacity-90 hover:shadow-md focus:outline-none focus:ring-2
    focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed
  `;

  // Define os estilos com base na variação (variant)
  const variantStyles = {
    primary: 'bg-ifpr-green text-white focus:ring-ifpr-red',
    secondary: 'bg-gray-300 hover:bg-gray-400 text-gray-800 focus:ring-gray-500',
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