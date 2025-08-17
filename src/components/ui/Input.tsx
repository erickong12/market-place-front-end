import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export function Input({ className = "", ...props }: InputProps) {
  return (
      <input
          {...props}
          className={`h-10 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none focus:ring ${className}`}
    />
  );
}