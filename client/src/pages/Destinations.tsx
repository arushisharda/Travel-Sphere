import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDestinations } from '../hooks/useDestinations';
import { MediaCard } from '../components/cards/MediaCard';
import { Container } from '../components/layout/Container';
import { Spinner } from '../components/ui/Spinner';
import { EmptyState, ErrorState } from '../components/ui/EmptyState';
import { WorldMap } from '../components/map/WorldMap';
import { useMapDestinations } from '../hooks/useDestinations';

const REGIONS = ['All', 'Asia', 'Europe', 'Africa', 'Americas', 'Oceania', 'Middle East'];
const CLIMATES = ['All', 'Tropical', 'Temperate', 'Arid', 'Continental', 'Polar'];
const BUDGETS = ['All', 'Budget', 'Moderate', 'Luxury'];

type View = 'grid' | 'map';

export default function Destinations() {
  const [q, setQ] = useState('');
  const [region, setRegion] = useState('');
  const [climate, setClimate] = useState('');
  const [budget, setBudget] = useState('');
  const [view, setView] = useState<View>('grid');
  const [compareList, setCompareList] = useState<string[]>([]);
  const navigate = useNavigate();

  const { data, isLoading, isError } = useDestinations({
    q: q || undefined,
    region: region || undefined,
    climate: climate || undefined,
    budget: budget || undefined,
    limit: 24,
  });

  const { data: mapData } = useMapDestinations();

  const toggleCompare = (slug: string) => {
    setCompareList((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : prev.length < 4 ? [...prev, slug] : prev
    );
  };

  return (
    <main id="main">
      <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)] py-8">
        <Container>
          <h1 className="text-3xl font-semibold text-[var(--color-ink)] mb-6">Destinations</h1>

          {/* Search */}
          <input
            type="search"
            placeholder="Search destinations..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="h-11 w-full max-w-sm rounded-full border border-[var(--color-border)] bg-[var(--color-paper)] px-5 text-sm focus:outline-none focus:border-[var(--color-ink)] mb-4"
          />

          {/* Filter rows */}
          <div className="flex flex-wrap gap-2 mb-3">
            {REGIONS.map((r) => (
              <button
                key={r}
                onClick={() => setRegion(r === 'All' ? '' : r)}
                className={`text-xs rounded-full px-3 py-1 border transition-colors ${(r === 'All' && !region) || region === r ? 'bg-[var(--color-ink)] text-[var(--color-paper)] border-[var(--color-ink)]' : 'border-[var(--color-border)] text-[var(--color-muted)]'}`}
              >
                {r}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {CLIMATES.map((c) => (
              <button
                key={c}
                onClick={() => setClimate(c === 'All' ? '' : c)}
                className={`text-xs rounded-full px-3 py-1 border transition-colors ${(c === 'All' && !climate) || climate === c ? 'bg-[var(--color-ink)] text-[var(--color-paper)] border-[var(--color-ink)]' : 'border-[var(--color-border)] text-[var(--color-muted)]'}`}
              >
                {c}
              </button>
            ))}
            {BUDGETS.map((b) => (
              <button
                key={b}
                onClick={() => setBudget(b === 'All' ? '' : b)}
                className={`text-xs rounded-full px-3 py-1 border transition-colors ${(b === 'All' && !budget) || budget === b ? 'bg-[var(--color-ink)] text-[var(--color-paper)] border-[var(--color-ink)]' : 'border-[var(--color-border)] text-[var(--color-muted)]'}`}
              >
                {b}
              </button>
            ))}
          </div>

          {/* View toggle */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setView('grid')}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${view === 'grid' ? 'bg-[var(--color-ink)] text-[var(--color-paper)] border-[var(--color-ink)]' : 'border-[var(--color-border)] text-[var(--color-muted)]'}`}
            >
              Grid
            </button>
            <button
              onClick={() => setView('map')}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${view === 'map' ? 'bg-[var(--color-ink)] text-[var(--color-paper)] border-[var(--color-ink)]' : 'border-[var(--color-border)] text-[var(--color-muted)]'}`}
            >
              Map
            </button>
          </div>
        </Container>
      </div>

      <Container className="py-10">
        {view === 'map' && mapData && (
          <div className="mb-8">
            <WorldMap destinations={mapData} height="500px" />
          </div>
        )}

        {isLoading && <div className="flex justify-center py-16"><Spinner /></div>}
        {isError && <ErrorState retry={() => {}} />}
        {!isLoading && data?.items.length === 0 && (
          <EmptyState title="No destinations match" description="Try adjusting your filters." />
        )}
        {data && data.items.length > 0 && (
          <>
            <p className="text-sm text-[var(--color-muted)] mb-6">{data.total} destinations</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {data.items.map((dest) => (
                <div key={dest.slug} className="relative">
                  <MediaCard {...dest} />
                  <button
                    onClick={() => toggleCompare(dest.slug)}
                    aria-pressed={compareList.includes(dest.slug)}
                    className={`absolute top-3 right-3 text-xs rounded-full px-2.5 py-0.5 transition-colors ${compareList.includes(dest.slug) ? 'bg-[var(--color-ink)] text-[var(--color-paper)]' : 'bg-white/80 text-[var(--color-ink)] hover:bg-white'}`}
                  >
                    {compareList.includes(dest.slug) ? '✓ Compare' : '+ Compare'}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </Container>

      {/* Compare bar */}
      {compareList.length > 0 && (
        <div className="fixed bottom-0 inset-x-0 bg-[var(--color-ink)] text-[var(--color-paper)] px-6 py-3 flex items-center justify-between z-40">
          <span className="text-sm">{compareList.length} selected for comparison</span>
          <div className="flex gap-3">
            <button onClick={() => setCompareList([])} className="text-sm text-[var(--color-paper)]/60 hover:text-[var(--color-paper)]">
              Clear
            </button>
            <button
              onClick={() => navigate(`/compare?slugs=${compareList.join(',')}`)}
              className="text-sm font-medium underline underline-offset-4"
            >
              Compare now →
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
