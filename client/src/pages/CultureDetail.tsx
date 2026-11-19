import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CulturePanel } from '../components/context-panels/CulturePanel';
import { useDestination } from '../hooks/useDestinations';
import { Container } from '../components/layout/Container';
import { Spinner } from '../components/ui/Spinner';

export default function CultureDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: dest, isLoading } = useDestination(slug!);

  return (
    <main id="main">
      <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)] py-8">
        <Container>
          {isLoading ? <Spinner /> : (
            <>
              <Link to="/culture" className="text-xs text-[var(--color-muted)] hover:text-[var(--color-ink)] mb-3 inline-block">
                ← All culture
              </Link>
              <div className="flex items-center justify-between flex-wrap gap-4 mt-2">
                <div>
                  <h1 className="text-3xl font-semibold text-[var(--color-ink)]">
                    {dest?.name ?? slug}
                  </h1>
                  {dest && <p className="text-sm text-[var(--color-muted)] mt-1">{dest.country} · {dest.region}</p>}
                </div>
                {dest && (
                  <Link
                    to={`/planner?destination=${dest.slug}&city=${encodeURIComponent(dest.name)}&country=${encodeURIComponent(dest.country)}`}
                    className="inline-flex h-10 items-center rounded-full bg-[var(--color-ink)] px-5 text-sm font-medium text-[var(--color-paper)] hover:opacity-90 transition-opacity"
                  >
                    Plan a trip to {dest.name} →
                  </Link>
                )}
              </div>
            </>
          )}
        </Container>
      </div>
      <Container className="py-10 max-w-2xl">
        <CulturePanel destinationSlug={slug!} />
      </Container>
    </main>
  );
}
