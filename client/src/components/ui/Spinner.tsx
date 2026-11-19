import React from 'react';
import { clsx } from 'clsx';

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={clsx(
        'inline-block h-5 w-5 rounded-full border-2 border-[var(--color-ink)] border-t-transparent animate-spin',
        className
      )}
    />
  );
}
