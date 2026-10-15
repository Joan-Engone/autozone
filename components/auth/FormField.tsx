import type { ReactNode } from "react";

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  labelAction?: ReactNode;
  children: ReactNode;
}

export default function FormField({ id, label, error, labelAction, children }: FormFieldProps) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label htmlFor={id} className="text-[13px] font-bold text-black">
          {label}
        </label>
        {labelAction}
      </div>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-2 text-xs text-[#D80005]">
          {error}
        </p>
      )}
    </div>
  );
}