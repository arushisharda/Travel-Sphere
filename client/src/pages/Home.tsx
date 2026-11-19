import React from 'react';
import { Link } from 'react-router-dom';
import { useDestinations } from '../hooks/useDestinations';
import { MediaCard } from '../components/cards/MediaCard';
import { OrbCard, FeatureCard } from '../components/cards/index';
import { Section, Container } from '../components/layout/Container';
import { Orb } from '../components/shared/Orb';
import { Spinner } from '../components/ui/Spinner';

export default function Home() {
  const { data, isLoading } = useDestinations({ limit: 6 });

  return (
    <main id="main">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[var(--color-paper)] pt-24 pb-20">
        <Orb variant="mint" size="xl" className="-top-32 -left-32" />
        <Orb variant="peach" size="lg" className="-bottom-16 -right-16" />
        <Container className="relative">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-widest text-[var(--color-muted)] mb-4">
              Cultural intelligence · Itinerary drafting · Live data
            </p>
            <h1 className="font-display text-5xl md:text-7xl font-light leading-none text-[var(--color-ink)] mb-6">
              Every destination,
              <br />
              in full detail.
            </h1>
            <p className="text-lg text-[var(--color-muted)] max-w-xl mb-8 leading-relaxed">
              Research destinations, understand local customs, check live weather and exchange rates, and draft a day-by-day itinerary — all without switching tabs.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/destinations"
                className="inline-flex h-12 items-center justify-center rounded-full bg-[var(--color-ink)] px-7 text-base font-medium text-[var(--color-paper)] hover:opacity-90 transition-opacity"
              >
                Browse destinations
              </Link>
              <Link
                to="/planner"
                className="inline-flex h-12 items-center justify-center rounded-full border border-[var(--color-ink)] px-7 text-base font-medium text-[var(--color-ink)] hover:bg-[var(--color-surface-strong)] transition-colors"
              >
                Plan a trip
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Featured destinations */}
      <Section>
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-[var(--color-ink)]">Featured destinations</h2>
            <p className="text-sm text-[var(--color-muted)] mt-1">Hand-picked with detailed cultural context</p>
          </div>
          <Link to="/destinations" className="text-sm text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors">
            View all →
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><Spinner /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.items.map((dest) => (
              <MediaCard key={dest.slug} {...dest} summary={dest.summary} />
            ))}
          </div>
        )}
      </Section>

      {/* Feature cards */}
      <section className="bg-[var(--color-surface)] py-16 md:py-24">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold text-[var(--color-ink)]">Everything you need to plan well</h2>
            <p className="text-sm text-[var(--color-muted)] mt-2 max-w-md mx-auto">
              Built on real data sources. No fabricated numbers.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              title="Live weather forecasts"
              description="7-day forecasts for every destination from Open-Meteo. Toggle between Celsius and Fahrenheit."
            />
            <FeatureCard
              title="Currency conversion"
              description="Live exchange rates from Frankfurter. Useful estimates — not financial advice."
            />
            <FeatureCard
              title="Cultural context"
              description="Etiquette, food, festivals, and local customs curated for each destination."
            />
            <FeatureCard
              title="Itinerary drafts"
              description="Answer a short form and get a structured day-by-day draft. Always verify details locally."
            />
            <FeatureCard
              title="Destination comparison"
              description="Compare two to four destinations side-by-side across climate, budget, and culture."
            />
            <FeatureCard
              title="Travel passport"
              description="Log places you have visited and track your wishlist in one place."
            />
          </div>
        </Container>
      </section>

      {/* Orb cards */}
      <Section>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <OrbCard
            orb="mint"
            title="Understand before you go"
            description="Cultural notes, tipping customs, dress codes, and local laws — the kind of context a guidebook buries on page 300."
          />
          <OrbCard
            orb="peach"
            title="Draft, then verify"
            description="The itinerary planner drafts from your answers. Opening hours and prices change — always check with local sources."
          />
          <OrbCard
            orb="mint"
            title="Your data, your control"
            description="Wishlist and passport data are stored against your account. Delete your account and all data is removed."
          />
        </div>
      </Section>

      {/* Quick currency band */}
      <section className="bg-[var(--color-ink)] py-12">
        <Container className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-semibold text-[var(--color-paper)]">Need a quick currency check?</h2>
            <p className="text-sm text-[var(--color-paper)]/60 mt-1">Live rates on every destination page.</p>
          </div>
          <Link
            to="/destinations"
            className="inline-flex h-11 items-center rounded-full border border-[var(--color-paper)]/30 px-6 text-sm text-[var(--color-paper)] hover:border-[var(--color-paper)] transition-colors"
          >
            Explore destinations →
          </Link>
        </Container>
      </section>

      {/* CTA band */}
      <Section>
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-3xl font-semibold text-[var(--color-ink)] mb-4">Ready to plan your next trip?</h2>
          <p className="text-[var(--color-muted)] mb-8">
            Create a free account to save trips, build a wishlist, and get personalised destination suggestions.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/register"
              className="inline-flex h-12 items-center rounded-full bg-[var(--color-ink)] px-8 text-base font-medium text-[var(--color-paper)] hover:opacity-90 transition-opacity"
            >
              Create account
            </Link>
            <Link
              to="/destinations"
              className="inline-flex h-12 items-center rounded-full border border-[var(--color-border)] px-8 text-base font-medium text-[var(--color-ink)] hover:bg-[var(--color-surface-strong)] transition-colors"
            >
              Browse first
            </Link>
          </div>
        </div>
      </Section>
    </main>
  );
}
