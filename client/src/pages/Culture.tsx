import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Link } from 'react-router-dom';
import { Container } from '../components/layout/Container';
import { Spinner } from '../components/ui/Spinner';
import { EmptyState } from '../components/ui/EmptyState';

export default function Culture() {
  const [q, setQ] = React.useState('');

  const { data, isLoading, error, refetch } = useQuery<any[]>({
    queryKey: ['destinations-for-culture'],
    queryFn: async () => {
      const res = await api.get('/destinations', { params: { limit: 100 } });
      return res.data.items ?? res.data.data ?? res.data;
    },
    staleTime: 1000 * 60 * 60 * 24,
  });

  const destinations = data ?? [];

  const filtered = q
    ? destinations.filter(
        (d) =>
          d.name?.toLowerCase().includes(q.toLowerCase()) ||
          d.country?.toLowerCase().includes(q.toLowerCase()) ||
          (d.region && d.region.toLowerCase().includes(q.toLowerCase()))
      )
    : destinations;

  return (
    <main id="main">
      <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)] py-8">
        <Container>
          <h1 className="text-3xl font-semibold text-[var(--color-ink)]">Culture Intelligence</h1>
          <p className="text-sm text-[var(--color-muted)] mt-1 mb-4">
            Local etiquette, customs, dining norms, and transit rules across all {data?.length ?? 39} destinations
          </p>
          <input
            type="search"
            placeholder="Search by city, country, or region..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="h-11 w-full max-w-sm rounded-full border border-[var(--color-border)] bg-[var(--color-paper)] px-5 text-sm focus:outline-none focus:border-[var(--color-ink)]"
          />
        </Container>
      </div>
      <Container className="py-10">
        {isLoading && (
          <div className="flex justify-center py-16">
            <Spinner />
          </div>
        )}
        {error && !isLoading && (
          <div className="py-12 text-center">
            <p className="text-sm text-red-600 mb-3">Unable to load destinations. Make sure the backend server is running.</p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 text-xs font-medium rounded-full bg-[var(--color-ink)] text-[var(--color-paper)]"
            >
              Retry
            </button>
          </div>
        )}
        {!isLoading && !error && filtered.length === 0 && (
          <EmptyState title="No destinations found" description="Try a different search query." />
        )}
        {!isLoading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((dest) => {
              const img = dest.imageThumbUrl ?? dest.imageUrl;
              return (
                <Link
                  key={dest.slug}
                  to={`/culture/${dest.slug}`}
                  className="group rounded-xl border border-[var(--color-border)] bg-[var(--color-paper)] overflow-hidden hover:shadow-elevated transition-all flex flex-col"
                >
                  {img && (
                    <div className="h-40 w-full overflow-hidden bg-[var(--color-surface)]">
                      <img
                        src={img}
                        alt={dest.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {dest.region && (
                        <p className="text-xs uppercase tracking-wider text-[var(--color-muted)] mb-1">
                          {dest.region}
                        </p>
                      )}
                      <h3 className="text-lg font-semibold text-[var(--color-ink)] group-hover:underline underline-offset-2">
                        {dest.name}
                      </h3>
                      <p className="text-sm text-[var(--color-muted)]">{dest.country}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[var(--color-border)] flex items-center justify-between text-xs text-[var(--color-muted)]">
                      <span>Explore etiquette & norms</span>
                      <span className="font-medium text-[var(--color-ink)] group-hover:translate-x-1 transition-transform">
                        Read guide →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </Container>
    </main>
  );
}
