import React from 'react';
import { clsx } from 'clsx';

type BadgeProps = {
  children: React.ReactNode;
  variant?: 'default' | 'mint' | 'peach' | 'outline';
  className?: string;
};

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium uppercase tracking-wider',
        {
          'bg-[var(--color-surface-strong)] text-[var(--color-ink)]': variant === 'default',
          'bg-[var(--color-mint)] text-[var(--color-ink)]': variant === 'mint',
          'bg-[var(--color-peach)] text-[var(--color-ink)]': variant === 'peach',
          'border border-[var(--color-border)] text-[var(--color-muted)]': variant === 'outline',
        },
        className
      )}
    >
      {children}
    </span>
  );
}
