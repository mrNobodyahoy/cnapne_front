import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean };

export default function Button({ loading, children, ...rest }: Props) {
  return (
    <button
      disabled={loading || rest.disabled}
      className={`
        w-full py-3 px-4 rounded-lg font-semibold text-white shadow-sm transition-all duration-150
        focus:outline-none focus:ring-2 focus:ring-ifpr-red focus:ring-offset-2
        ${loading ? "opacity-60 cursor-not-allowed" : "bg-ifpr-green hover:bg-ifpr-green/80"}
      `}
      {...rest}
    >
      {loading ? "Aguarde..." : children}
    </button>
  );
}
