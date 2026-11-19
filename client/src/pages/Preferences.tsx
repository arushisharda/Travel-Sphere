import React from 'react';
import { usePreferences, useSuggestions } from '../hooks/useDestinations';
import { MediaCard } from '../components/cards/MediaCard';
import { Container } from '../components/layout/Container';
import { Spinner } from '../components/ui/Spinner';
import { Button } from '../components/ui/Button';
import { toast } from '../components/ui/Toast';

const INTEREST_OPTIONS = ['Adventure', 'Culture', 'Food', 'Nature', 'History', 'Photography', 'Beach', 'Cities', 'Hiking', 'Wellness'];
const CLIMATE_PREFS = [
  { label: 'Tropical', value: 'tropical' },
  { label: 'Temperate', value: 'temperate' },
  { label: 'Arid', value: 'arid' },
  { label: 'Alpine', value: 'alpine' },
  { label: 'Mediterranean', value: 'mediterranean' },
];
const BUDGET_PREFS = [
  { label: 'Budget', value: 1 },
  { label: 'Moderate', value: 3 },
  { label: 'Luxury', value: 5 },
];
const PACE_PREFS = [
  { label: 'Relaxed', value: 'relaxed' },
  { label: 'Balanced', value: 'balanced' },
  { label: 'Packed', value: 'packed' },
];

export default function Preferences() {
  const { data, isLoading, update } = usePreferences();
  const { data: suggestions } = useSuggestions();
  const [saving, setSaving] = React.useState(false);
  const [local, setLocal] = React.useState<any>(null);

  React.useEffect(() => {
    if (data && !local) {
      setLocal({
        interests: Array.isArray(data.interests) ? data.interests : [],
        climate: data.climate ?? null,
        budgetLevel: data.budgetLevel ?? null,
        pace: data.pace ?? null,
        foodPrefs: data.foodPrefs ?? '',
      });
    }
  }, [data]);

  const handleSave = async () => {
    if (!local) return;
    setSaving(true);
    try {
      await update.mutateAsync({
        interests: local.interests ?? [],
        climate: local.climate || undefined,
        budgetLevel: local.budgetLevel || undefined,
        pace: local.pace || undefined,
        foodPrefs: local.foodPrefs || undefined,
      });
      toast('Preferences saved!', 'success');
    } catch {
      toast('Could not save preferences', 'error');
    } finally { setSaving(false); }
  };

  const toggleInterest = (interest: string) => {
    const curr: string[] = local?.interests ?? [];
    const val = interest.toLowerCase();
    setLocal((prev: any) => ({
      ...prev,
      interests: curr.map(i => i.toLowerCase()).includes(val)
        ? curr.filter((i) => i.toLowerCase() !== val)
        : [...curr, val],
    }));
  };

  if (isLoading) return <div className="flex justify-center py-32"><Spinner /></div>;

  return (
    <main id="main">
      <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)] py-8">
        <Container>
          <h1 className="text-3xl font-semibold text-[var(--color-ink)]">Travel Preferences</h1>
          <p className="text-sm text-[var(--color-muted)] mt-1">Personalise your destination suggestions</p>
        </Container>
      </div>
      <Container className="py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Prefs form */}
          <div className="space-y-7">

            {/* Interests */}
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-3">Interests</h2>
              <div className="flex flex-wrap gap-2">
                {INTEREST_OPTIONS.map((interest) => {
                  const val = interest.toLowerCase();
                  const active = (local?.interests ?? []).map((i: string) => i.toLowerCase()).includes(val);
                  return (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`text-sm rounded-full px-4 py-1.5 border capitalize transition-colors ${active ? 'bg-[var(--color-ink)] text-[var(--color-paper)] border-[var(--color-ink)]' : 'border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-ink)]'}`}
                    >
                      {interest}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Climate */}
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-3">Preferred climate</h2>
              <div className="flex flex-wrap gap-2">
                {CLIMATE_PREFS.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setLocal((prev: any) => ({ ...prev, climate: local?.climate === c.value ? null : c.value }))}
                    className={`text-sm rounded-full px-4 py-1.5 border transition-colors ${local?.climate === c.value ? 'bg-[var(--color-ink)] text-[var(--color-paper)] border-[var(--color-ink)]' : 'border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-ink)]'}`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Budget */}
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-3">Budget range</h2>
              <div className="flex flex-wrap gap-2">
                {BUDGET_PREFS.map((b) => (
                  <button
                    key={b.value}
                    onClick={() => setLocal((prev: any) => ({ ...prev, budgetLevel: local?.budgetLevel === b.value ? null : b.value }))}
                    className={`text-sm rounded-full px-4 py-1.5 border transition-colors ${local?.budgetLevel === b.value ? 'bg-[var(--color-ink)] text-[var(--color-paper)] border-[var(--color-ink)]' : 'border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-ink)]'}`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Pace */}
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-3">Travel pace</h2>
              <div className="flex flex-wrap gap-2">
                {PACE_PREFS.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => setLocal((prev: any) => ({ ...prev, pace: local?.pace === p.value ? null : p.value }))}
                    className={`text-sm rounded-full px-4 py-1.5 border transition-colors ${local?.pace === p.value ? 'bg-[var(--color-ink)] text-[var(--color-paper)] border-[var(--color-ink)]' : 'border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-ink)]'}`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Food prefs */}
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-3">Dietary preferences</h2>
              <input
                type="text"
                value={local?.foodPrefs ?? ''}
                onChange={(e) => setLocal((prev: any) => ({ ...prev, foodPrefs: e.target.value }))}
                placeholder="e.g. vegetarian, halal, no seafood"
                className="h-11 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-paper)] px-3 text-sm focus:outline-none focus:border-[var(--color-ink)]"
              />
            </div>

            <Button onClick={handleSave} loading={saving}>Save preferences</Button>
          </div>

          {/* Suggestions */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)] mb-4">Suggested for you</h2>
            {!suggestions || suggestions.length === 0 ? (
              <p className="text-sm text-[var(--color-muted)]">Set your preferences above and save to see personalised suggestions.</p>
            ) : (
              <div className="space-y-4">
                {suggestions.slice(0, 5).map((dest: any) => (
                  <MediaCard key={dest.slug} {...dest} />
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </main>
  );
}
