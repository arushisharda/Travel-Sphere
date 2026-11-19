import React, { useState } from 'react';
import { usePassport } from '../../hooks/useDestinations';
import { useAuth } from '../../context/AuthContext';
import { toast } from '../ui/Toast';

export function VisitedButton({ destinationId, destinationName }: { destinationId: string; destinationName: string }) {
  const { isAuthenticated } = useAuth();
  const { data: stamps, addStamp } = usePassport();
  const [showForm, setShowForm] = useState(false);
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');

  const isVisited = stamps?.some((s) => s.destinationId === destinationId) ?? false;

  if (!isAuthenticated) {
    return (
      <button
        onClick={() => toast('Sign in to log visits', 'info')}
        className="inline-flex h-11 items-center gap-2 rounded-full border border-[var(--color-border)] px-5 text-sm font-medium text-[var(--color-muted)] hover:border-[var(--color-ink)] hover:text-[var(--color-ink)] transition-colors"
      >
        <span aria-hidden>✓</span> Been here
      </button>
    );
  }

  if (showForm) {
    return (
      <div className="flex flex-col gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-paper)] p-4 max-w-xs">
        <p className="text-xs font-semibold text-[var(--color-ink)] uppercase tracking-wider">Log your visit</p>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          max={new Date().toISOString().split('T')[0]}
          className="h-9 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm focus:outline-none focus:border-[var(--color-ink)]"
        />
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="A short memory (optional)"
          className="h-9 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 text-sm focus:outline-none focus:border-[var(--color-ink)]"
        />
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (!date) { toast('Pick a date', 'error'); return; }
              addStamp.mutate(
                { destinationId, visitedAt: date, notes: note || undefined },
                {
                  onSuccess: () => { toast(`${destinationName} added to your passport!`, 'success'); setShowForm(false); },
                  onError: () => toast('Could not add stamp', 'error'),
                }
              );
            }}
            disabled={addStamp.isPending}
            className="flex-1 h-9 rounded-lg bg-[var(--color-ink)] text-[var(--color-paper)] text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {addStamp.isPending ? 'Saving…' : 'Save stamp'}
          </button>
          <button
            onClick={() => setShowForm(false)}
            className="h-9 px-3 rounded-lg border border-[var(--color-border)] text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => isVisited ? toast('Already in your passport') : setShowForm(true)}
      aria-pressed={isVisited}
      className={`inline-flex h-11 items-center gap-2 rounded-full border px-5 text-sm font-medium transition-colors ${
        isVisited
          ? 'border-[var(--color-mint)] bg-[var(--color-mint)]/20 text-emerald-700'
          : 'border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]'
      }`}
    >
      <span aria-hidden>{isVisited ? '✓' : '+'}</span>
      {isVisited ? 'Visited' : 'Been here'}
    </button>
  );
}
