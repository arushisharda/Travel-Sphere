import React from 'react';
import { useTrips } from '../hooks/useDestinations';
import { Container } from '../components/layout/Container';
import { EmptyState } from '../components/ui/EmptyState';
import { Spinner } from '../components/ui/Spinner';
import { Button } from '../components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { formatDate } from '../lib/format';
import { toast } from '../components/ui/Toast';

const STATUS_STYLES: Record<string, string> = {
  DRAFT: 'bg-[var(--color-surface)] text-[var(--color-muted)]',
  PLANNED: 'bg-[var(--color-mint)]/20 text-emerald-700',
  COMPLETED: 'bg-[var(--color-peach)]/20 text-orange-700',
};

export default function Trips() {
  const { data, isLoading, deleteTrip } = useTrips();
  const navigate = useNavigate();

  const handleDelete = async (e: React.MouseEvent, id: string, title: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    deleteTrip.mutate(id, {
      onSuccess: () => toast('Trip deleted'),
      onError: () => toast('Could not delete trip', 'error'),
    });
  };

  return (
    <main id="main">
      <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)] py-8">
        <Container>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-[var(--color-ink)]">My Trips</h1>
              <p className="text-sm text-[var(--color-muted)] mt-1">Saved itineraries and plans</p>
            </div>
            <Link to="/planner">
              <Button>+ New trip</Button>
            </Link>
          </div>
        </Container>
      </div>
      <Container className="py-10">
        {isLoading && <div className="flex justify-center py-16"><Spinner /></div>}
        {!isLoading && data?.length === 0 && (
          <EmptyState
            title="No trips yet"
            description="Draft your first itinerary in the Planner and save it here."
            action={<Link to="/planner"><Button>Go to Planner</Button></Link>}
          />
        )}
        {data && data.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {data.map((trip: any) => (
              <Link
                key={trip.id}
                to={`/trips/${trip.id}`}
                className="block rounded-xl border border-[var(--color-border)] bg-[var(--color-paper)] hover:shadow-elevated transition-shadow overflow-hidden group"
              >
                {/* Destination image */}
                {trip.destination?.imageThumbUrl && (
                  <div className="h-32 overflow-hidden">
                    <img
                      src={trip.destination.imageThumbUrl}
                      alt={trip.destination.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-[var(--color-ink)] truncate">{trip.title}</h3>
                      {trip.destination && (
                        <p className="text-sm text-[var(--color-muted)] mt-0.5">{trip.destination.name}</p>
                      )}
                    </div>
                    <span className={`text-xs rounded-full px-2.5 py-0.5 capitalize shrink-0 ${STATUS_STYLES[trip.status] ?? STATUS_STYLES.DRAFT}`}>
                      {trip.status?.toLowerCase()}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs text-[var(--color-muted)]">
                    {trip.startDate && <span>{formatDate(trip.startDate)}</span>}
                    {trip.startDate && trip.endDate && <span>—</span>}
                    {trip.endDate && <span>{formatDate(trip.endDate)}</span>}
                    {!trip.startDate && <span>{trip.durationDays} day{trip.durationDays !== 1 ? 's' : ''}</span>}
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-[var(--color-muted)]">
                      {trip.draft ? 'Itinerary saved' : 'No itinerary'}
                    </span>
                    <button
                      onClick={(e) => handleDelete(e, trip.id, trip.title)}
                      className="text-xs text-[var(--color-muted)] hover:text-red-500 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </main>
  );
}
