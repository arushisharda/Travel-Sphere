import React from 'react';

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="h-12 w-12 rounded-full bg-[var(--color-surface-strong)] flex items-center justify-center">
        <span className="text-[var(--color-muted)] text-xl" aria-hidden>—</span>
      </div>
      <div>
        <p className="font-medium text-[var(--color-ink)]">{title}</p>
        {description && <p className="mt-1 text-sm text-[var(--color-muted)]">{description}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

type ErrorStateProps = {
  title?: string;
  message?: string;
  retry?: () => void;
};

export function ErrorState({ title = 'Something went wrong', message, retry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center">
        <span className="text-red-500 font-bold text-xl">!</span>
      </div>
      <div>
        <p className="font-medium text-[var(--color-ink)]">{title}</p>
        {message && <p className="mt-1 text-sm text-[var(--color-muted)]">{message}</p>}
      </div>
      {retry && (
        <button
          onClick={retry}
          className="text-sm underline underline-offset-4 text-[var(--color-ink)]"
        >
          Try again
        </button>
      )}
    </div>
  );
}
