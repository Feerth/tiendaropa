"use client";

import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = "", id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-text-secondary mb-1.5"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-4 py-2.5 rounded-lg
            bg-bg-secondary border
            text-text-primary placeholder-text-muted
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-accent-primary/30 focus:border-accent-primary
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? "border-accent-secondary" : "border-border-default hover:border-border-strong"}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-accent-secondary">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-xs text-text-muted">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
