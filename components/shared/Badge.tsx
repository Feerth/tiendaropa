import type { ReactNode } from "react";

export type BadgeVariant = "nuevo" | "oferta" | "agotado" | "stockBajo" | "default";

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  nuevo:
    "bg-accent-tertiary/20 text-accent-tertiary border border-accent-tertiary/30",
  oferta:
    "bg-accent-secondary/20 text-accent-secondary border border-accent-secondary/30",
  agotado:
    "bg-accent-secondary/10 text-accent-secondary border border-accent-secondary/20",
  stockBajo:
    "bg-accent-secondary/20 text-accent-secondary border border-accent-secondary/30 animate-pulse-stock",
  default:
    "bg-bg-elevated text-text-secondary border border-border-subtle",
};

export function Badge({ variant = "default", children, className = "" }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
