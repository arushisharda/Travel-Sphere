import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { usePlanner } from '../context/PlannerContext';
import { ItineraryView } from '../components/planner/ItineraryView';
import { DraftNotice, PlannerDataNotice } from '../components/planner/DraftNotice';
import { TextInput } from '../components/ui/TextInput';
import { Button } from '../components/ui/Button';
import { Container } from '../components/layout/Container';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from '../components/ui/Toast';
import { api, extractError } from '../lib/api';

const SUPPORTED_CURRENCIES = ['USD', 'INR', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'] as const;
const INTEREST_OPTIONS = ['culture', 'food', 'adventure', 'relaxation', 'nightlife', 'nature', 'shopping', 'history'] as const;
const BUDGET_LABELS: Record<number, string> = {
  1: 'Budget (backpacker)', 2: 'Budget–Moderate', 3: 'Moderate', 4: 'Moderate–Luxury', 5: 'Luxury',
};

const schema = z.object({
  city: z.string().min(2, 'Enter a city name'),
  country: z.string().min(2, 'Enter a country'),
  durationDays: z.coerce.number().int().min(1).max(14),
  startDate: z.string().optional(),
  pace: z.enum(['relaxed', 'balanced', 'packed']),
  budgetLevel: z.coerce.number().int().min(1).max(5),
  budgetCurrency: z.enum(SUPPORTED_CURRENCIES),
  dietaryPreferences: z.string().optional(),
  notes: z.string().max(300).optional(),
});

type FormValues = z.infer<typeof schema>;

function downloadItineraryPdf(draft: any, city: string, country: string, days: number) {
  const title = `${city}${country ? ', ' + country : ''} — ${days}-Day Itinerary`;
  const dateStr = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });

  const rows = (draft.days || []).map((day: any) => `
    <div class="day">
      <div class="day-header">Day ${day.dayNumber}${day.theme ? ' — ' + day.theme : ''}</div>
      ${(day.activities || []).map((act: any) => `
        <div class="activity">
          <div class="time-label">${act.timeBlock}</div>
          <div class="act-body">
            <div class="act-title">${act.title}</div>
            ${act.description ? `<div class="act-desc">${act.description}</div>` : ''}
            ${act.estimatedCost != null ? `<div class="act-cost">Est. ~${act.estimatedCost} ${act.currencyCode || ''}</div>` : ''}
            ${act.caveat ? `<div class="act-caveat">Note: ${act.caveat}</div>` : ''}
          </div>
        </div>`).join('')}
    </div>`).join('');

  const foodHtml = draft.foodSuggestions?.length
    ? `<div class="section"><h3>Food Suggestions</h3><ul>${draft.foodSuggestions.map((f: string) => `<li>${f}</li>`).join('')}</ul></div>` : '';
  const tipsHtml = draft.culturalTips?.length
    ? `<div class="section"><h3>Cultural Tips</h3><ul>${draft.culturalTips.map((t: string) => `<li>${t}</li>`).join('')}</ul></div>` : '';

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Georgia, serif; color: #1a1510; background: #fff; padding: 32px; max-width: 780px; margin: 0 auto; }
    .header { background: #1a1510; color: #fff; padding: 20px 24px; border-radius: 8px; margin-bottom: 24px; }
    .header h1 { font-size: 22px; font-weight: bold; }
    .header .sub { font-size: 12px; color: rgba(255,255,255,0.65); margin-top: 4px; }
    .summary { font-size: 14px; color: #4a4540; line-height: 1.6; margin-bottom: 24px; padding: 16px; background: #f9f7f5; border-radius: 8px; }
    .day { margin-bottom: 24px; }
    .day-header { background: #f5f0eb; border-left: 3px solid #1a1510; padding: 8px 14px; font-size: 14px; font-weight: bold; border-radius: 0 6px 6px 0; margin-bottom: 10px; }
    .activity { display: flex; gap: 12px; margin-bottom: 10px; padding: 10px 12px; border: 1px solid #e8e3de; border-radius: 6px; }
    .time-label { font-size: 10px; font-weight: bold; text-transform: uppercase; color: #8a8580; min-width: 70px; padding-top: 2px; letter-spacing: 0.05em; }
    .act-title { font-size: 13px; font-weight: bold; color: #1a1510; margin-bottom: 3px; }
    .act-desc { font-size: 12px; color: #4a4540; line-height: 1.5; margin-bottom: 3px; }
    .act-cost { font-size: 11px; color: #8a8580; }
    .act-caveat { font-size: 11px; color: #a06030; font-style: italic; margin-top: 3px; }
    .section { margin-bottom: 20px; }
    .section h3 { font-size: 14px; font-weight: bold; margin-bottom: 8px; border-bottom: 1px solid #e8e3de; padding-bottom: 4px; }
    .section ul { padding-left: 18px; }
    .section li { font-size: 12px; color: #4a4540; margin-bottom: 4px; line-height: 1.5; }
    .disclaimer { font-size: 11px; color: #8a8580; border-top: 1px solid #e8e3de; padding-top: 12px; margin-top: 24px; line-height: 1.6; }
    @media print { body { padding: 16px; } }
  </style></head><body>
  <div class="header"><h1>${title}</h1><div class="sub">Generated by TravelSphere · ${dateStr}</div></div>
  ${draft.summary ? `<div class="summary">${draft.summary}</div>` : ''}
  ${rows}${foodHtml}${tipsHtml}
  <div class="disclaimer">Drafted automatically. Please confirm opening hours, prices and local rules before you travel.</div>
  </body></html>`;

  const win = window.open('', '_blank', 'width=900,height=700');
  if (!win) { toast('Allow popups to download PDF', 'error'); return; }
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => { win.print(); }, 500);
  toast('Print dialog opened — choose "Save as PDF"', 'success');
}

export default function Planner() {
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const { draft: plannerDraft, isGenerating, error, generate, clearDraft } = usePlanner();
  const [saving, setSaving] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(plannerDraft?.interests ?? []);

  const preCity = searchParams.get('city') ?? plannerDraft?.city ?? '';
  const preCountry = searchParams.get('country') ?? plannerDraft?.country ?? '';
  const preSlug = searchParams.get('destination') ?? '';

  const { register, handleSubmit, getValues, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      city: preCity,
      country: preCountry,
      durationDays: plannerDraft?.durationDays ?? 3,
      pace: 'balanced',
      budgetLevel: 3,
      budgetCurrency: 'USD',
    },
  });

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const onSubmit = useCallback(async (values: FormValues) => {
    const payload = {
      city: values.city.trim(),
      country: values.country.trim(),
      destinationSlug: preSlug || undefined,
      durationDays: values.durationDays,
      pace: values.pace,
      budgetLevel: values.budgetLevel,
      budgetCurrency: values.budgetCurrency,
      interests: selectedInterests,
      startDate: values.startDate || undefined,
      dietaryPreferences: values.dietaryPreferences
        ? values.dietaryPreferences.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
      notes: values.notes || undefined,
    };
    // This runs in global context — survives navigation!
    generate(payload);
  }, [generate, preSlug, selectedInterests]);

  const saveAsTrip = async () => {
    if (!plannerDraft || !isAuthenticated) return;
    setSaving(true);
    const vals = getValues();
    const city = vals.city || plannerDraft.city;
    const country = vals.country || plannerDraft.country;
    const days = vals.durationDays || plannerDraft.durationDays;

    // Build slug candidates
    const slugFromCityCountry = `${city}-${country}`
      .toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const slugFromCity = city.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    // Try in order: explicit destination slug, city-country slug, city slug, then any fallback
    const slugsToTry = [
      preSlug || null,
      slugFromCityCountry,
      slugFromCity,
    ].filter(Boolean) as string[];

    const title = `${city}${country ? ', ' + country : ''} · ${days} days`;

    const tryCreate = async (destinationSlug: string) => {
      await api.post('/trips', {
        destinationSlug,
        title,
        durationDays: days,
        startDate: vals.startDate || undefined,
        draft: plannerDraft.draft,
      });
    };

    try {
      let saved = false;
      for (const slug of slugsToTry) {
        try {
          await tryCreate(slug);
          saved = true;
          break;
        } catch (e: any) {
          if (e?.response?.status === 404) continue; // try next slug
          throw e; // other errors propagate
        }
      }
      if (!saved) {
        // Fallback: server will use first destination as placeholder
        await api.post('/trips', {
          destinationSlug: 'paris-france',
          title,
          durationDays: days,
          startDate: vals.startDate || undefined,
          draft: plannerDraft.draft,
        });
      }
      toast('Trip saved to My Trips!', 'success');
    } catch {
      toast('Could not save trip — try again', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPdf = () => {
    if (!plannerDraft) return;
    const vals = getValues();
    downloadItineraryPdf(plannerDraft.draft, vals.city || plannerDraft.city, vals.country || plannerDraft.country, vals.durationDays || plannerDraft.durationDays);
  };

  const busy = isGenerating;

  return (
    <main id="main">
      {/* Generating banner — shows even when user is on this page */}
      {busy && (
        <div className="bg-[var(--color-ink)] text-[var(--color-paper)] text-xs text-center py-2 flex items-center justify-center gap-2">
          <span className="inline-block h-3 w-3 rounded-full border border-[var(--color-paper)] border-t-transparent animate-spin" />
          Drafting itinerary in background — you can browse other pages and come back
        </div>
      )}

      <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)] py-8">
        <Container>
          <h1 className="text-3xl font-semibold text-[var(--color-ink)]">Itinerary Planner</h1>
          <p className="text-sm text-[var(--color-muted)] mt-2 max-w-lg">
            Enter any city in the world. Drafting takes 30–60 seconds — you can navigate away and come back anytime.
          </p>
          {!isAuthenticated && (
            <p className="text-xs text-[var(--color-muted)] mt-2">
              <Link to="/login?next=/planner" className="underline underline-offset-4 font-medium">Sign in</Link> — required to draft itineraries.
            </p>
          )}
        </Container>
      </div>

      <Container className="py-10">
        <div className="grid lg:grid-cols-12 gap-10">
          {/* ── FORM ── */}
          <div className="lg:col-span-5">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

              <div className="grid sm:grid-cols-2 gap-4">
                <TextInput label="City" placeholder="e.g. Mumbai, Tokyo, Paris" error={errors.city?.message} {...register('city')} />
                <TextInput label="Country" placeholder="e.g. India, Japan, France" error={errors.country?.message} {...register('country')} />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <TextInput label="Duration (days)" type="number" placeholder="1–14" error={errors.durationDays?.message} {...register('durationDays')} />
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-[var(--color-ink)]">Start date (optional)</label>
                  <input type="date" {...register('startDate')} className="h-11 rounded-lg border border-[var(--color-border)] bg-[var(--color-paper)] px-3 text-sm focus:outline-none focus:border-[var(--color-ink)]" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-[var(--color-ink)]">Budget</label>
                  <select {...register('budgetLevel')} className="h-11 rounded-lg border border-[var(--color-border)] bg-[var(--color-paper)] px-3 text-sm focus:outline-none focus:border-[var(--color-ink)]">
                    {[1,2,3,4,5].map((v) => <option key={v} value={v}>{BUDGET_LABELS[v]}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-[var(--color-ink)]">Currency</label>
                  <select {...register('budgetCurrency')} className="h-11 rounded-lg border border-[var(--color-border)] bg-[var(--color-paper)] px-3 text-sm focus:outline-none focus:border-[var(--color-ink)]">
                    {SUPPORTED_CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-[var(--color-ink)]">Pace</label>
                  <select {...register('pace')} className="h-11 rounded-lg border border-[var(--color-border)] bg-[var(--color-paper)] px-3 text-sm focus:outline-none focus:border-[var(--color-ink)]">
                    <option value="relaxed">Relaxed</option>
                    <option value="balanced">Balanced</option>
                    <option value="packed">Packed</option>
                  </select>
                </div>
              </div>

              {/* Interests */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-[var(--color-ink)]">Interests</label>
                <div className="flex flex-wrap gap-2">
                  {INTEREST_OPTIONS.map((interest) => (
                    <button key={interest} type="button" onClick={() => toggleInterest(interest)}
                      className={`text-sm rounded-full px-4 py-1.5 border capitalize transition-colors ${selectedInterests.includes(interest) ? 'bg-[var(--color-ink)] text-[var(--color-paper)] border-[var(--color-ink)]' : 'border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-ink)]'}`}>
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              <TextInput label="Dietary preferences (optional)" placeholder="e.g. vegetarian, no pork, gluten-free" hint="Comma-separated" {...register('dietaryPreferences')} />

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[var(--color-ink)]">Notes (optional)</label>
                <textarea {...register('notes')} placeholder="e.g. travelling with young kids, anniversary trip, need wheelchair access" rows={3} maxLength={300} className="rounded-lg border border-[var(--color-border)] bg-[var(--color-paper)] px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-[var(--color-ink)]" />
              </div>

              {error && <div className="text-sm text-red-700 bg-red-50 rounded-lg px-4 py-3 border border-red-200">{error}</div>}

              <div>
                <Button type="submit" loading={busy} size="lg" className="w-full">
                  {busy ? 'Drafting… (you can browse other pages)' : 'Draft itinerary'}
                </Button>
                <PlannerDataNotice />
              </div>
            </form>
          </div>

          {/* ── RESULT ── */}
          <div className="lg:col-span-7">
            {!plannerDraft && !busy && !error && (
              <div className="rounded-xl border border-dashed border-[var(--color-border)] p-10 text-center sticky top-24">
                <p className="text-sm text-[var(--color-muted)]">Your itinerary draft will appear here.</p>
                <p className="text-xs text-[var(--color-muted)] mt-2">Works for any city in the world. Navigate away while it generates — it'll be here when you return.</p>
              </div>
            )}

            {busy && (
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-10 text-center sticky top-24">
                <div className="inline-block h-8 w-8 rounded-full border-2 border-[var(--color-ink)] border-t-transparent animate-spin mb-4" />
                <p className="text-sm font-medium text-[var(--color-ink)]">Drafting your itinerary…</p>
                <p className="text-xs text-[var(--color-muted)] mt-2 max-w-xs mx-auto">This takes 30–60 seconds. Feel free to browse other pages — the draft will be waiting here when you return.</p>
              </div>
            )}

            {plannerDraft && !busy && (
              <div className="space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <p className="text-xs text-[var(--color-muted)]">
                    Itinerary for <strong className="text-[var(--color-ink)]">{plannerDraft.city}{plannerDraft.country ? ', ' + plannerDraft.country : ''}</strong>
                    {' · '}{plannerDraft.durationDays} days
                  </p>
                  <button onClick={clearDraft} className="text-xs text-[var(--color-muted)] hover:text-red-500 transition-colors">
                    Clear draft
                  </button>
                </div>

                <DraftNotice />

                <div className="flex gap-3 flex-wrap">
                  <Button variant="outline" onClick={handleDownloadPdf} className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF
                  </Button>
                  {isAuthenticated && (
                    <Button variant="outline" onClick={saveAsTrip} loading={saving}>
                      Save as trip
                    </Button>
                  )}
                </div>

                <ItineraryView draft={plannerDraft.draft} />
              </div>
            )}
          </div>
        </div>
      </Container>
    </main>
  );
}
