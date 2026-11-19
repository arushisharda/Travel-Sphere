import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTrip, useTrips } from '../hooks/useDestinations';
import { Container } from '../components/layout/Container';
import { Spinner } from '../components/ui/Spinner';
import { ErrorState } from '../components/ui/EmptyState';
import { ItineraryView } from '../components/planner/ItineraryView';
import { DraftNotice } from '../components/planner/DraftNotice';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { formatDate } from '../lib/format';
import { toast } from '../components/ui/Toast';
import { api } from '../lib/api';

const STATUS_VARIANT: Record<string, 'mint' | 'peach' | 'default'> = {
  DRAFT: 'default',
  PLANNED: 'mint',
  COMPLETED: 'peach',
};

const STATUS_CYCLE: Record<string, string> = {
  DRAFT: 'PLANNED',
  PLANNED: 'COMPLETED',
  COMPLETED: 'DRAFT',
};
const STATUS_NEXT_LABEL: Record<string, string> = {
  DRAFT: 'Mark as Planned',
  PLANNED: 'Mark as Completed',
  COMPLETED: 'Reset to Draft',
};

function downloadItineraryPdf(draft: any, title: string) {
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
          </div>
        </div>`).join('')}
    </div>`).join('');
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title>
  <style>* { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Georgia, serif; color: #1a1510; background: #fff; padding: 32px; max-width: 780px; margin: 0 auto; }
  .header { background: #1a1510; color: #fff; padding: 20px 24px; border-radius: 8px; margin-bottom: 24px; }
  .header h1 { font-size: 22px; font-weight: bold; }
  .header .sub { font-size: 12px; color: rgba(255,255,255,0.65); margin-top: 4px; }
  .summary { font-size: 14px; color: #4a4540; line-height: 1.6; margin-bottom: 24px; padding: 16px; background: #f9f7f5; border-radius: 8px; }
  .day { margin-bottom: 24px; }
  .day-header { background: #f5f0eb; border-left: 3px solid #1a1510; padding: 8px 14px; font-size: 14px; font-weight: bold; border-radius: 0 6px 6px 0; margin-bottom: 10px; }
  .activity { display: flex; gap: 12px; margin-bottom: 10px; padding: 10px 12px; border: 1px solid #e8e3de; border-radius: 6px; }
  .time-label { font-size: 10px; font-weight: bold; text-transform: uppercase; color: #8a8580; min-width: 70px; padding-top: 2px; }
  .act-title { font-size: 13px; font-weight: bold; color: #1a1510; margin-bottom: 3px; }
  .act-desc { font-size: 12px; color: #4a4540; line-height: 1.5; margin-bottom: 3px; }
  .act-cost { font-size: 11px; color: #8a8580; }
  .disclaimer { font-size: 11px; color: #8a8580; border-top: 1px solid #e8e3de; padding-top: 12px; margin-top: 24px; line-height: 1.6; }
  @media print { body { padding: 16px; } }
  </style></head><body>
  <div class="header"><h1>${title}</h1><div class="sub">TravelSphere · ${dateStr}</div></div>
  ${draft.summary ? `<div class="summary">${draft.summary}</div>` : ''}
  ${rows}
  <div class="disclaimer">Drafted automatically. Confirm opening hours, prices and local rules before you travel.</div>
  </body></html>`;
  const win = window.open('', '_blank', 'width=900,height=700');
  if (!win) { toast('Allow popups to download PDF', 'error'); return; }
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => { win.print(); }, 500);
  toast('Print dialog opened — choose "Save as PDF"', 'success');
}

export default function TripDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: trip, isLoading, isError } = useTrip(id!);
  const { updateTrip, deleteTrip } = useTrips();
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (isLoading) return <div className="flex justify-center py-32"><Spinner /></div>;
  if (isError || !trip) return <div className="py-32"><ErrorState title="Trip not found" /></div>;

  const draft = trip.draft ?? null;

  const handleStatusChange = async () => {
    setUpdatingStatus(true);
    try {
      const nextStatus = STATUS_CYCLE[trip.status] ?? 'DRAFT';
      await api.patch(`/trips/${trip.id}`, { status: nextStatus });
      toast(`Trip marked as ${nextStatus.toLowerCase()}`, 'success');
      // Refetch
      window.location.reload();
    } catch {
      toast('Could not update status', 'error');
    } finally { setUpdatingStatus(false); }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${trip.title}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await api.delete(`/trips/${trip.id}`);
      toast('Trip deleted');
      navigate('/trips', { replace: true });
    } catch {
      toast('Could not delete trip', 'error');
    } finally { setDeleting(false); }
  };

  return (
    <main id="main">
      {/* Header */}
      <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)] py-8">
        <Container>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs text-[var(--color-muted)] mb-1">
                <Link to="/trips" className="underline underline-offset-4 hover:text-[var(--color-ink)]">My trips</Link> /
              </p>
              <h1 className="text-3xl font-semibold text-[var(--color-ink)]">{trip.title}</h1>
              {trip.destination && (
                <p className="text-sm text-[var(--color-muted)] mt-1">
                  {trip.destination.name}, {trip.destination.country}
                </p>
              )}
            </div>
            <Badge variant={STATUS_VARIANT[trip.status] ?? 'default'}>
              {trip.status.charAt(0) + trip.status.slice(1).toLowerCase()}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-4 mt-4 text-xs text-[var(--color-muted)]">
            {trip.startDate && (
              <span>
                {formatDate(trip.startDate)}
                {trip.endDate && <> — {formatDate(trip.endDate)}</>}
              </span>
            )}
            <span>{trip.durationDays} day{trip.durationDays !== 1 ? 's' : ''}</span>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 mt-5">
            {draft && (
              <Button
                variant="outline"
                onClick={() => downloadItineraryPdf(draft, trip.title)}
              >
                Download PDF
              </Button>
            )}
            <Button
              variant="outline"
              onClick={handleStatusChange}
              loading={updatingStatus}
            >
              {STATUS_NEXT_LABEL[trip.status] ?? 'Update status'}
            </Button>
            <Link to={`/planner?destination=${trip.destination?.slug ?? ''}&city=${encodeURIComponent(trip.destination?.name ?? '')}&country=${encodeURIComponent(trip.destination?.country ?? '')}`}>
              <Button variant="outline">Re-draft in Planner</Button>
            </Link>
            <Button
              variant="outline"
              onClick={handleDelete}
              loading={deleting}
              className="text-red-600 hover:border-red-500"
            >
              Delete
            </Button>
          </div>
        </Container>
      </div>

      <Container className="py-10 max-w-3xl">
        {trip.notes && (
          <p className="text-[var(--color-muted)] mb-6 italic border-l-2 border-[var(--color-border)] pl-4">
            {trip.notes}
          </p>
        )}

        {draft ? (
          <div className="space-y-4">
            <DraftNotice />
            <ItineraryView draft={draft} />
          </div>
        ) : trip.items && trip.items.length > 0 ? (
          <div className="space-y-6">
            {Object.entries(
              trip.items.reduce((acc: Record<number, any[]>, item: any) => {
                (acc[item.dayNumber] ||= []).push(item);
                return acc;
              }, {})
            )
              .sort(([a], [b]) => Number(a) - Number(b))
              .map(([day, items]) => (
                <div key={day}>
                  <h2 className="text-base font-semibold text-[var(--color-ink)] mb-3">Day {day}</h2>
                  <div className="space-y-2">
                    {(items as any[]).map((item: any) => (
                      <div key={item.id} className="flex gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
                        <span className="text-xs text-[var(--color-muted)] w-20 shrink-0 mt-0.5 capitalize">
                          {item.timeBlock.toLowerCase()}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[var(--color-ink)]">{item.title}</p>
                          {item.description && (
                            <p className="text-xs text-[var(--color-muted)] mt-0.5">{item.description}</p>
                          )}
                        </div>
                        {item.estimatedCost != null && (
                          <span className="text-xs text-[var(--color-muted)] shrink-0">
                            ~{item.estimatedCost} {item.currencyCode}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-[var(--color-border)] p-10 text-center">
            <p className="text-sm text-[var(--color-muted)]">No itinerary saved for this trip yet.</p>
            <Link
              to={`/planner?destination=${trip.destination?.slug ?? ''}`}
              className="mt-3 inline-block text-sm underline underline-offset-4 text-[var(--color-ink)]"
            >
              Draft one in the Planner
            </Link>
          </div>
        )}
      </Container>
    </main>
  );
}
