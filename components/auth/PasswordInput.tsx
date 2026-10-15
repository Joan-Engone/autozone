"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { ComponentProps } from "react";

interface PasswordInputProps extends Omit<ComponentProps<"input">, "type"> {
  hasError?: boolean;
}

export default function PasswordInput({ hasError, className = "", ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <div className="relative">
      <input
        {...props}
        type={visible ? "text" : "password"}
        aria-invalid={hasError}
        className={`w-full border bg-white px-4 py-4 pr-12 text-sm text-black placeholder:text-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D80005] ${
          hasError ? "border-[#D80005]" : "border-gray-300"
        } ${className}`}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
        className="absolute inset-y-0 right-0 px-4 text-gray-500 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D80005]"
      >
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}