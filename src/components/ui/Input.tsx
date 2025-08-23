import { forwardRef, type InputHTMLAttributes } from "react";
import type { Ref } from "react"; // Explicitly import Ref type

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  id: string;
};

const Input = forwardRef<HTMLInputElement, Props>(({ label, error, id, ...rest }, ref) => {
  return (
    <div className="space-y-1">
      {label && <label htmlFor={id} className="text-sm font-medium">{label}</label>}
      <input
        id={id}
        ref={ref as Ref<HTMLInputElement>} // Ensure correct ref type
        className={`w-full rounded-md border p-2 outline-none focus:ring-2 focus:ring-indigo-500
          ${error ? "border-red-500" : "border-slate-300"}`}
        {...rest}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
});

export default Input;