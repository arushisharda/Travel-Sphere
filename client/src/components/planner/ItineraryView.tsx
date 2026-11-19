import React from 'react';
import { formatCurrency } from '../../lib/format';

type Activity = {
  timeBlock: 'MORNING' | 'AFTERNOON' | 'EVENING';
  title: string;
  description: string;
  category: string;
  estimatedCost: number | null;
  currencyCode: string | null;
  caveat: string | null;
};

type Day = {
  dayNumber: number;
  theme: string;
  activities: Activity[];
};

type ItineraryDraft = {
  summary?: string;
  days: Day[];
  foodSuggestions?: string[];
  culturalTips?: string[];
  assumptions?: string[];
};

const TIME_LABEL: Record<string, string> = {
  MORNING: 'Morning',
  AFTERNOON: 'Afternoon',
  EVENING: 'Evening',
};

const CATEGORY_COLOR: Record<string, string> = {
  food: 'bg-orange-50 text-orange-700',
  sight: 'bg-blue-50 text-blue-700',
  culture: 'bg-purple-50 text-purple-700',
  transport: 'bg-gray-50 text-gray-600',
  rest: 'bg-green-50 text-green-700',
  activity: 'bg-teal-50 text-teal-700',
};

export function ItineraryView({ draft }: { draft: ItineraryDraft }) {
  return (
    <div className="space-y-8">
      {/* Summary */}
      {draft.summary && (
        <div className="pb-4 border-b border-[var(--color-border)]">
          <p className="text-[var(--color-muted)] leading-relaxed">{draft.summary}</p>
        </div>
      )}

      {/* Days */}
      {draft.days.map((day) => (
        <div key={day.dayNumber}>
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)]">
              Day {day.dayNumber}
            </span>
            <h3 className="font-semibold text-[var(--color-ink)]">{day.theme}</h3>
          </div>

          <div className="space-y-3 pl-4 border-l-2 border-[var(--color-border)]">
            {day.activities.map((activity, i) => (
              <ActivityRow key={i} activity={activity} />
            ))}
          </div>
        </div>
      ))}

      {/* Food suggestions */}
      {draft.foodSuggestions && draft.foodSuggestions.length > 0 && (
        <div className="rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] p-5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-3">
            Worth trying
          </h4>
          <ul className="space-y-1.5">
            {draft.foodSuggestions.map((s, i) => (
              <li key={i} className="text-sm text-[var(--color-ink)] flex gap-2">
                <span className="text-[var(--color-muted)]">·</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Cultural tips */}
      {draft.culturalTips && draft.culturalTips.length > 0 && (
        <div className="rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] p-5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-3">
            Cultural notes
          </h4>
          <ul className="space-y-1.5">
            {draft.culturalTips.map((tip, i) => (
              <li key={i} className="text-sm text-[var(--color-muted)] flex gap-2">
                <span>·</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Assumptions */}
      {draft.assumptions && draft.assumptions.length > 0 && (
        <details className="text-xs text-[var(--color-muted)]">
          <summary className="cursor-pointer hover:text-[var(--color-ink)] transition-colors">
            Model assumptions ({draft.assumptions.length})
          </summary>
          <ul className="mt-2 space-y-1 pl-3">
            {draft.assumptions.map((a, i) => (
              <li key={i}>· {a}</li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}

function ActivityRow({ activity }: { activity: Activity }) {
  const categoryClass = CATEGORY_COLOR[activity.category] ?? 'bg-gray-50 text-gray-600';

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-paper)] p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-xs font-medium text-[var(--color-muted)]">
              {TIME_LABEL[activity.timeBlock] ?? activity.timeBlock}
            </span>
            {activity.category && (
              <span className={`text-xs rounded-full px-2 py-0.5 capitalize font-medium ${categoryClass}`}>
                {activity.category}
              </span>
            )}
          </div>
          <h4 className="font-medium text-[var(--color-ink)] mb-1">{activity.title}</h4>
          <p className="text-sm text-[var(--color-muted)] leading-relaxed">{activity.description}</p>
          {activity.caveat && (
            <p className="mt-2 text-xs text-amber-700 bg-amber-50 rounded px-2 py-1 inline-block">
              {activity.caveat}
            </p>
          )}
        </div>
        {activity.estimatedCost !== null && activity.estimatedCost !== undefined && (
          <div className="text-right flex-shrink-0 ml-2">
            <p className="text-sm font-medium text-[var(--color-ink)]">
              about {formatCurrency(activity.estimatedCost, activity.currencyCode ?? 'USD')}
            </p>
            <p className="text-xs text-[var(--color-muted)]">Estimate only</p>
          </div>
        )}
      </div>
    </div>
  );
}
