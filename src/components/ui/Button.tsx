import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean };

export default function Button({ loading, children, ...rest }: Props) {
  return (
    <button
      disabled={loading || rest.disabled}
      className="inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-4 py-2
                 font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
      {...rest}
    >
      {loading ? "Aguarde..." : children}
    </button>
  );
}
