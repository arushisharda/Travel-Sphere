import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { QuoteCard } from '../cards/index';
import { Spinner } from '../ui/Spinner';
import { EmptyState } from '../ui/EmptyState';

type CultureEntry = {
  id: string;
  topic: string;
  title: string;
  body: string;
  source?: string;
};

const TOPICS = ['ETIQUETTE', 'FOOD', 'DRESS', 'MONEY', 'LANGUAGE', 'TRANSPORT', 'SAFETY', 'FESTIVALS', 'MUSIC', 'GREETING'];

export function CulturePanel({ destinationSlug }: { destinationSlug: string }) {
  const [topic, setTopic] = useState<string | null>(null);

  // culture endpoint returns a plain array
  const { data, isLoading } = useQuery<CultureEntry[]>({
    queryKey: ['culture', destinationSlug, topic],
    queryFn: async () => {
      const res = await api.get(`/culture/${destinationSlug}`, {
        params: topic ? { topic } : {},
      });
      // API returns array directly
      return Array.isArray(res.data) ? res.data : (res.data.data ?? []);
    },
    staleTime: 1000 * 60 * 60 * 24,
  });

  const filtered = topic ? data?.filter((e) => e.topic.toLowerCase() === topic.toLowerCase()) : data;

  return (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-4">
        Cultural Context
      </h3>

      {/* Topic filter pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setTopic(null)}
          className={`text-xs rounded-full px-3 py-1 border transition-colors ${!topic ? 'bg-[var(--color-ink)] text-[var(--color-paper)] border-[var(--color-ink)]' : 'border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-ink)]'}`}
        >
          All
        </button>
        {TOPICS.map((t) => (
          <button
            key={t}
            onClick={() => setTopic(topic === t ? null : t)}
            className={`text-xs rounded-full px-3 py-1 border transition-colors ${topic === t ? 'bg-[var(--color-ink)] text-[var(--color-paper)] border-[var(--color-ink)]' : 'border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-ink)]'}`}
          >
            {t.charAt(0) + t.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {isLoading && <div className="flex justify-center py-8"><Spinner /></div>}

      {!isLoading && (!filtered || filtered.length === 0) && (
        <EmptyState title="No entries yet" description="Cultural guidance for this destination is being compiled." />
      )}

      {filtered && filtered.length > 0 && (
        <div className="space-y-4">
          {filtered.map((entry) => (
            <QuoteCard
              key={entry.id}
              topic={entry.topic}
              quote={entry.body}
              attribution={entry.source}
            />
          ))}
        </div>
      )}
    </div>
  );
}
