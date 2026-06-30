import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "gold";
  size?: "sm" | "md" | "lg";
}

const variantClasses = {
  primary:
    "bg-casino-red hover:bg-red-700 text-white shadow-card disabled:bg-red-900/50",
  secondary:
    "bg-white/10 hover:bg-white/20 text-white border border-white/20 disabled:opacity-40",
  danger:
    "bg-red-900 hover:bg-red-800 text-white shadow-card disabled:opacity-40",
  gold: "bg-gold hover:bg-gold-light text-felt-dark font-semibold shadow-card disabled:opacity-40",
};

const sizeClasses = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`rounded-lg font-display tracking-wide transition-all duration-200 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
