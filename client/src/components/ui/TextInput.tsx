import React from 'react';
import { clsx } from 'clsx';

type TextInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  hint?: string;
};

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-[var(--color-ink)]">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          {...props}
          className={clsx(
            'h-11 w-full rounded-lg border bg-[var(--color-paper)] px-3 text-base text-[var(--color-ink)] placeholder:text-[var(--color-muted)] transition-colors',
            'focus:outline-none focus:border-[var(--color-ink)] focus:ring-0',
            error
              ? 'border-red-500'
              : 'border-[var(--color-border)]',
            className
          )}
        />
        {error && <p className="text-xs text-red-500">{error}</p>}
        {hint && !error && <p className="text-xs text-[var(--color-muted)]">{hint}</p>}
      </div>
    );
  }
);
TextInput.displayName = 'TextInput';
