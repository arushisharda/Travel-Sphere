import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDestination } from '../hooks/useDestinations';
import { WeatherPanel } from '../components/context-panels/WeatherPanel';
import { CurrencyPanel } from '../components/context-panels/CurrencyPanel';
import { CulturePanel } from '../components/context-panels/CulturePanel';
import { WorldMap } from '../components/map/WorldMap';
import { Container } from '../components/layout/Container';
import { Spinner } from '../components/ui/Spinner';
import { ErrorState } from '../components/ui/EmptyState';
import { Badge } from '../components/ui/Badge';
import { WishlistButton } from '../components/personal/WishlistButton';
import { VisitedButton } from '../components/personal/VisitedButton';

const TABS = ['Overview', 'Weather', 'Culture', 'Map'] as const;
type Tab = typeof TABS[number];

export default function DestinationDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [tab, setTab] = useState<Tab>('Overview');
  const { data: dest, isLoading, isError } = useDestination(slug!);

  if (isLoading) return <div className="flex justify-center py-32"><Spinner /></div>;
  if (isError || !dest) return <div className="py-32"><ErrorState title="Destination not found" /></div>;

  const imgUrl = dest.imageUrl ?? `https://source.unsplash.com/1600x900/?${encodeURIComponent(dest.name)},travel`;

  return (
    <main id="main">
      {/* Hero */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img src={imgUrl} alt={dest.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
          <Container>
            <p className="text-white/70 text-sm uppercase tracking-wider mb-1">{dest.region}</p>
            <h1 className="font-display text-4xl md:text-5xl font-light text-white">{dest.name}</h1>
            <p className="text-white/80 mt-1">{dest.country}</p>
          </Container>
        </div>
      </div>

      {/* Sticky tab bar */}
      <div className="sticky top-16 z-30 bg-[var(--color-paper)] border-b border-[var(--color-border)]">
        <Container>
          <nav className="flex gap-6 overflow-x-auto" aria-label="Destination sections">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`py-3 text-sm border-b-2 whitespace-nowrap transition-colors ${tab === t ? 'border-[var(--color-ink)] text-[var(--color-ink)] font-medium' : 'border-transparent text-[var(--color-muted)] hover:text-[var(--color-ink)]'}`}
              >
                {t}
              </button>
            ))}
          </nav>
        </Container>
      </div>

      <Container className="py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {tab === 'Overview' && (
              <div className="space-y-6">
                {dest.summary && (
                  <p className="text-[var(--color-ink)] leading-relaxed text-lg">{dest.summary}</p>
                )}
                <div className="flex flex-wrap gap-2">
                  {dest.climateType && <Badge>{dest.climateType}</Badge>}
                  {dest.budgetLevel && <Badge variant="mint">{dest.budgetLevel}</Badge>}
                  {dest.currencyCode && <Badge variant="outline">Currency: {dest.currencyCode}</Badge>}
                  {dest.travelStyles?.map((s) => (
                    <Badge key={s} variant="outline">{s}</Badge>
                  ))}
                </div>
                {dest.bestSeason && (
                  <div className="rounded-lg bg-[var(--color-surface)] p-4">
                    <p className="text-xs uppercase tracking-wider text-[var(--color-muted)] mb-1">Best time to visit</p>
                    <p className="text-[var(--color-ink)]">{dest.bestSeason}</p>
                  </div>
                )}
                <div className="flex flex-wrap gap-3 pt-2">
                  <Link
                    to={`/planner?destination=${dest.slug}&city=${encodeURIComponent(dest.name)}&country=${encodeURIComponent(dest.country)}`}
                    className="inline-flex h-11 items-center rounded-full bg-[var(--color-ink)] px-6 text-sm font-medium text-[var(--color-paper)] hover:opacity-90 transition-opacity"
                  >
                    Plan a trip here
                  </Link>
                  <WishlistButton destinationSlug={dest.slug} />
                  <VisitedButton destinationId={dest.id} destinationName={dest.name} />
                  <Link
                    to={`/compare?slugs=${dest.slug}`}
                    className="inline-flex h-11 items-center rounded-full border border-[var(--color-border)] px-6 text-sm font-medium text-[var(--color-muted)] hover:border-[var(--color-ink)] hover:text-[var(--color-ink)] transition-colors"
                  >
                    Compare
                  </Link>
                </div>
              </div>
            )}

            {tab === 'Weather' && <WeatherPanel destinationSlug={slug!} />}
            {tab === 'Culture' && <CulturePanel destinationSlug={slug!} />}
            {tab === 'Map' && (
              <WorldMap
                destinations={[{
                  slug: dest.slug,
                  name: dest.name,
                  country: dest.country,
                  latitude: dest.latitude,
                  longitude: dest.longitude,
                }]}
                center={[dest.latitude, dest.longitude]}
                zoom={9}
                height="450px"
              />
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <WeatherPanel destinationSlug={slug!} />
            <CurrencyPanel defaultTo={dest.currencyCode ?? 'USD'} />
          </aside>
        </div>
      </Container>
    </main>
  );
}
