import React, { useState } from 'react';
import { usePassport, useDestinations } from '../hooks/useDestinations';
import { Container } from '../components/layout/Container';
import { EmptyState } from '../components/ui/EmptyState';
import { Spinner } from '../components/ui/Spinner';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { formatDate } from '../lib/format';
import { toast } from '../components/ui/Toast';

const STAMP_COLORS = [
  'border-[var(--color-mint)] bg-[var(--color-mint)]/10 text-[var(--color-ink)]',
  'border-[var(--color-peach)] bg-[var(--color-peach)]/10 text-[var(--color-ink)]',
  'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)]',
];

export default function Passport() {
  const { data, isLoading, addStamp, removeStamp } = usePassport();
  const { data: destData, isLoading: destLoading } = useDestinations({ limit: 50 });
  const destinations = destData?.items ?? [];
  const [showAdd, setShowAdd] = useState(false);
  const [destId, setDestId] = useState('');
  const [visitedAt, setVisitedAt] = useState('');
  const [notes, setNotes] = useState('');

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destId || !visitedAt) return;
    addStamp.mutate(
      { destinationId: destId, visitedAt, notes: notes || undefined },
      {
        onSuccess: () => {
          toast('Passport stamp added!', 'success');
          setShowAdd(false);
          setDestId('');
          setVisitedAt('');
          setNotes('');
        },
        onError: () => toast('Could not add stamp', 'error'),
      }
    );
  };

  const totalCountries = new Set(
    (data ?? []).map((s) => s.destination?.country).filter(Boolean)
  ).size;

  return (
    <main id="main">
      <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)] py-8">
        <Container>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-[var(--color-ink)]">Travel Passport</h1>
              <div className="flex gap-5 mt-2">
                <p className="text-sm text-[var(--color-muted)]">
                  <span className="font-semibold text-[var(--color-ink)]">{data?.length ?? 0}</span> {(data?.length ?? 0) === 1 ? 'stamp' : 'stamps'}
                </p>
                {totalCountries > 0 && (
                  <p className="text-sm text-[var(--color-muted)]">
                    <span className="font-semibold text-[var(--color-ink)]">{totalCountries}</span> {totalCountries === 1 ? 'country' : 'countries'}
                  </p>
                )}
              </div>
            </div>
            <Button onClick={() => setShowAdd((v) => !v)} variant={showAdd ? 'outline' : 'primary'}>
              {showAdd ? 'Cancel' : '+ Add stamp'}
            </Button>
          </div>
        </Container>
      </div>

      <Container className="py-10">
        {/* Add stamp form */}
        {showAdd && (
          <form
            onSubmit={handleAdd}
            className="mb-8 rounded-xl border border-[var(--color-border)] bg-[var(--color-paper)] p-6 max-w-md space-y-4"
          >
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">Log a visit</h2>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[var(--color-ink)]">Destination</label>
              <select
                value={destId}
                onChange={(e) => setDestId(e.target.value)}
                required
                className="h-11 rounded-lg border border-[var(--color-border)] bg-[var(--color-paper)] px-3 text-sm focus:outline-none focus:border-[var(--color-ink)]"
              >
                <option value="">
                  {destLoading ? 'Loading destinations…' : destinations.length === 0 ? 'No destinations found' : 'Select destination…'}
                </option>
                {destinations.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}, {d.country}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[var(--color-ink)]">Date visited</label>
              <input
                type="date"
                value={visitedAt}
                onChange={(e) => setVisitedAt(e.target.value)}
                required
                max={new Date().toISOString().split('T')[0]}
                className="h-11 rounded-lg border border-[var(--color-border)] bg-[var(--color-paper)] px-3 text-sm focus:outline-none focus:border-[var(--color-ink)]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[var(--color-ink)]">Notes (optional)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="A short memory from your trip…"
                className="h-11 rounded-lg border border-[var(--color-border)] bg-[var(--color-paper)] px-3 text-sm focus:outline-none focus:border-[var(--color-ink)]"
              />
            </div>
            <Button type="submit" loading={addStamp.isPending}>Add stamp</Button>
          </form>
        )}

        {isLoading && <div className="flex justify-center py-16"><Spinner /></div>}

        {!isLoading && (data?.length ?? 0) === 0 && !showAdd && (
          <EmptyState
            title="No stamps yet"
            description="Mark the destinations you have visited to build your travel passport."
            action={<Button onClick={() => setShowAdd(true)}>Add your first stamp</Button>}
          />
        )}

        {data && data.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.map((stamp, i) => (
              <div
                key={stamp.id}
                className={`rounded-xl border-2 p-5 ${STAMP_COLORS[i % STAMP_COLORS.length]}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    {stamp.destination ? (
                      <>
                        <Link
                          to={`/destinations/${stamp.destination.slug}`}
                          className="font-semibold text-[var(--color-ink)] hover:underline underline-offset-4 block truncate"
                        >
                          {stamp.destination.name}
                        </Link>
                        <p className="text-sm text-[var(--color-muted)] mt-0.5">{stamp.destination.country}</p>
                      </>
                    ) : (
                      <p className="font-semibold text-[var(--color-ink)]">{stamp.stampLabel}</p>
                    )}
                    <p className="text-xs text-[var(--color-muted)] mt-2">
                      Visited {stamp.visitedAt ? formatDate(stamp.visitedAt) : '—'}
                    </p>
                    {stamp.note && (
                      <p className="text-sm text-[var(--color-muted)] mt-2 italic">"{stamp.note}"</p>
                    )}
                  </div>
                  <button
                    onClick={() =>
                      removeStamp.mutate(stamp.id, {
                        onSuccess: () => toast('Stamp removed'),
                        onError: () => toast('Could not remove', 'error'),
                      })
                    }
                    className="text-xs text-[var(--color-muted)] hover:text-red-500 transition-colors flex-shrink-0"
                    aria-label={`Remove ${stamp.destination?.name ?? stamp.stampLabel} stamp`}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </main>
  );
}
