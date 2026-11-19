import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Container } from '../components/layout/Container';
import { Spinner } from '../components/ui/Spinner';

type Destination = {
  slug: string;
  name: string;
  country: string;
  region: string;
  climateType?: string;
  budgetLevel?: number;
  currencyCode?: string;
  bestSeason?: string;
  summary?: string;
  foodScore?: number;
  travelStyles?: string | string[];
};

type CompareResult = {
  destinations: Destination[];
  dimensions: string[];
};

const BUDGET_LABELS: Record<number, string> = {
  1: 'Budget',
  2: 'Budget–Moderate',
  3: 'Moderate',
  4: 'Moderate–Luxury',
  5: 'Luxury',
};

function fmt(val: unknown): string {
  if (val === null || val === undefined || val === '') return 'Not available';
  if (typeof val === 'number') return BUDGET_LABELS[val] ?? String(val);
  if (Array.isArray(val)) return val.join(', ') || 'Not available';
  return String(val);
}

const COMPARE_FIELDS: { key: keyof Destination; label: string }[] = [
  { key: 'region', label: 'Region' },
  { key: 'climateType', label: 'Climate' },
  { key: 'budgetLevel', label: 'Budget tier' },
  { key: 'currencyCode', label: 'Currency' },
  { key: 'bestSeason', label: 'Best time to visit' },
  { key: 'travelStyles', label: 'Travel styles' },
  { key: 'foodScore', label: 'Food rating (/ 5)' },
];

export default function Compare() {
  const [searchParams] = useSearchParams();
  const initialSlugs = searchParams.get('slugs')?.split(',').filter(Boolean) ?? [];
  const [slugInput, setSlugInput] = React.useState(initialSlugs.join(', '));

  const slugs = slugInput.split(',').map((s) => s.trim()).filter(Boolean);

  const { data, isLoading, isError } = useQuery<CompareResult>({
    queryKey: ['compare', slugs],
    queryFn: async () => {
      const res = await api.get('/compare', { params: { slugs: slugs.join(',') } });
      return res.data;
    },
    enabled: slugs.length >= 2 && slugs.length <= 4,
  });

  return (
    <main id="main">
      <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)] py-8">
        <Container>
          <h1 className="text-3xl font-semibold text-[var(--color-ink)] mb-4">Compare Destinations</h1>
          <div className="max-w-xl">
            <input
              type="text"
              value={slugInput}
              onChange={(e) => setSlugInput(e.target.value)}
              placeholder="e.g. kyoto-japan, paris-france, bali-indonesia"
              className="w-full h-11 rounded-full border border-[var(--color-border)] bg-[var(--color-paper)] px-5 text-sm focus:outline-none focus:border-[var(--color-ink)]"
            />
            <p className="text-xs text-[var(--color-muted)] mt-2">Enter 2–4 destination slugs, comma-separated</p>
          </div>
        </Container>
      </div>

      <Container className="py-10">
        {slugs.length < 2 && (
          <div className="text-center py-16">
            <p className="text-[var(--color-muted)]">Enter at least 2 destination slugs above to compare.</p>
            <p className="text-xs text-[var(--color-muted)] mt-2">
              Example: <code className="bg-[var(--color-surface)] px-1.5 py-0.5 rounded text-xs">kyoto-japan, paris-france, bali-indonesia</code>
            </p>
          </div>
        )}

        {isLoading && <div className="flex justify-center py-16"><Spinner /></div>}

        {isError && (
          <p className="text-red-500 text-sm bg-red-50 rounded-lg px-4 py-3">
            Could not load comparison. Check the destination slugs are correct.
          </p>
        )}

        {data && data.destinations.length >= 2 && (
          <div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left text-xs uppercase tracking-wider text-[var(--color-muted)] py-3 pr-8 w-44">
                      Feature
                    </th>
                    {data.destinations.map((d) => (
                      <th key={d.slug} className="text-left py-3 px-6 border-l border-[var(--color-border)] min-w-[180px]">
                        <Link
                          to={`/destinations/${d.slug}`}
                          className="font-semibold text-[var(--color-ink)] hover:underline underline-offset-4"
                        >
                          {d.name}
                        </Link>
                        <p className="text-xs font-normal text-[var(--color-muted)] mt-0.5">{d.country}</p>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARE_FIELDS.map((field) => (
                    <tr key={field.key} className="border-t border-[var(--color-border)]">
                      <td className="text-sm text-[var(--color-muted)] py-3 pr-8 font-medium">
                        {field.label}
                      </td>
                      {data.destinations.map((d) => (
                        <td key={d.slug} className="py-3 px-6 border-l border-[var(--color-border)] text-sm text-[var(--color-ink)]">
                          {fmt(d[field.key])}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr className="border-t border-[var(--color-border)]">
                    <td className="text-sm text-[var(--color-muted)] py-3 pr-8 font-medium align-top">About</td>
                    {data.destinations.map((d) => (
                      <td key={d.slug} className="py-3 px-6 border-l border-[var(--color-border)] text-sm text-[var(--color-muted)] align-top leading-relaxed">
                        {d.summary || 'Not available'}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-[var(--color-muted)] mt-6">
              All data is for general guidance only. Missing fields shown as "Not available" — not fabricated.
            </p>
          </div>
        )}
      </Container>
    </main>
  );
}
