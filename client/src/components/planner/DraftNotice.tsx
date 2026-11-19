import React from 'react';

export function DraftNotice() {
  return (
    <aside
      role="note"
      className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
    >
      <strong className="font-semibold">Please note: </strong>
      Drafted automatically from your answers. Please confirm opening hours, prices and local rules before you rely on it.
    </aside>
  );
}

export function PlannerDataNotice() {
  return (
    <p className="text-xs text-[var(--color-muted)] mt-2">
      Your answers are sent to a language model provider to write the draft. Do not include personal or sensitive details.
    </p>
  );
}
