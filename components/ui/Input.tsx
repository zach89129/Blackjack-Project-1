import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
}

export function Input({ label, hint, className = "", id, ...props }: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={inputId} className="text-sm font-medium text-white/80">
        {label}
      </label>
      {hint && <span className="text-xs text-gold/80">{hint}</span>}
      <input
        id={inputId}
        className={`rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-white placeholder:text-white/30 focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/30 disabled:opacity-50 ${className}`}
        {...props}
      />
    </div>
  );
}
