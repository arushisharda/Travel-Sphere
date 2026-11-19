import React from 'react';
import { clsx } from 'clsx';

type OrbProps = {
  variant?: 'mint' | 'peach' | 'neutral';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
};

export function Orb({ variant = 'mint', size = 'md', className }: OrbProps) {
  return (
    <span
      aria-hidden
      role="presentation"
      className={clsx(
        'orb pointer-events-none absolute rounded-full blur-3xl opacity-30',
        {
          'bg-[var(--color-mint)]': variant === 'mint',
          'bg-[var(--color-peach)]': variant === 'peach',
          'bg-[var(--color-muted)]': variant === 'neutral',
          'h-32 w-32': size === 'sm',
          'h-56 w-56': size === 'md',
          'h-96 w-96': size === 'lg',
          'h-[32rem] w-[32rem]': size === 'xl',
        },
        className
      )}
    />
  );
}
